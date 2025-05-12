import { Link, useNavigate } from "react-router-dom";
import * as S from "./styles";
import { useToken } from "../../Components/TokenContext";
import { useEffect, useState } from "react";
import { InputMask } from '@react-input/mask';
import Select from 'react-select';
import FileDropzone from '../../Components/FileDropzone';
import RegisterModal from '../../Components/RegisterModal';
import HelpNumbersModal from '../../Components/HelpNumbersModal';
import HelpGeneralModal from '../../Components/HelpGeneralModal';

import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';

import { NumericFormat } from "react-number-format";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

registerLocale('pt-BR', ptBR);

function Compras() {
    const navigate = useNavigate();
    const { tokenData, checkToken } = useToken();
    const [isLoading, setIsLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [showHelpNumbersModal, setShowHelpNumbersModal] = useState(false);
    const [showHelpGeneralModal, setShowHelpGeneralModal] = useState(false);
    const [generalModalData, setGeneralModalData] = useState({
        message: '',
        image: ''
    });
    const [compras, setCompras] = useState([]);
    const [isOn, setIsOn] = useState(true);
    const [productsSelect, setProductsSelect] = useState([]);
    
    const baseUrl = process.env.REACT_APP_API_URL;
    const accessToken = localStorage.getItem('access_token');

    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeCompra, setActiveCompra] = useState(false);
    
    const toggleAccordion = () => {
        setActiveCompra(!activeCompra);
    };
    
    const [buyData, setBuyData] = useState({
        numero_cupom: '',
        data: '',
        valor: '',
        quantidade: '',
        cnpj_loja: '',
        produtos_ids: [],
        imagem: null,
    });

    const [buyErrorData, setBuyErrorData] = useState({
        numero_cupom: [],
        data: [],
        valor: [],
        quantidade: [],
        cnpj_loja: [],
        produtos_ids: [],
        imagem: [],
    });

    const fetchData = async () => {
        try {
            const [productsResponse, comprasResponse, promoResponse] = await Promise.all([
                fetch(`${baseUrl}/produtos`),
                fetch(`${baseUrl}/compras`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                }),
                fetch(`${baseUrl}/promocao/data`)
            ]);

            if (!productsResponse.ok) throw new Error('Erro ao buscar os produtos.');
            if (!comprasResponse.ok) throw new Error('Erro ao buscar as suas compras.');
            if (!promoResponse.ok) throw new Error('Erro ao buscar as informações da promoção.');

            const [productsData, comprasData, promoData] = await Promise.all([
                productsResponse.json(),
                comprasResponse.json(),
                promoResponse.json()
            ]);

            setProductsSelect(productsData.produtos.map(p => ({
                value: p.id,
                image: p.imagem,
                label: `${p.nome}`,
            })));

            setCompras(comprasData.compras);

            if (promoData.promocao && promoData.promocao.termina_em) {
                const dataTermino = new Date(promoData.promocao.termina_em);
                const dataAtual = new Date();
                const primeiroDeMaio = new Date(dataAtual.getFullYear(), 4, 1); 

                setIsOn(dataAtual >= primeiroDeMaio && dataAtual <= dataTermino);
            } else {
                setIsOn(false);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchData();
        checkToken();
    }, []);

    const handleOpenHelpModal = (message, image) => {
      setGeneralModalData({ message, image });
      setShowHelpGeneralModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBuyData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setBuyData(prevData => ({
            ...prevData,
            [name]: selectedOption
        }));
    };

    const handleDateChange = (date: Date) => {
        const formatBackendDate = (inputDate: Date) => {
            const year = inputDate.getFullYear();
            const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
            const day = inputDate.getDate().toString().padStart(2, '0');
            const hours = inputDate.getHours().toString().padStart(2, '0');
            const minutes = inputDate.getMinutes().toString().padStart(2, '0');
          
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        const formattedDate = formatBackendDate(date);
        
        setBuyData(prev => ({ 
            ...prev, 
            data: formattedDate 
        }));

        if (setBuyErrorData) {
            setBuyErrorData(prev => ({ ...prev, data: [] }));
        }
    };

    const dateValue = buyData.data 
        ? new Date(buyData.data) 
        : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData();

        Object.keys(buyData).forEach(key => {
            if (key !== 'imagem' && buyData[key]) {
                if (key === 'produtos_ids' && Array.isArray(buyData[key])) {
                    buyData[key].forEach(id => formData.append('produtos_ids[]', id));
                } else {
                    formData.append(key, buyData[key]);
                }
            }
        });


        if (buyData.imagem) {
            formData.append('imagem', buyData.imagem);
        }

        try {
            console.log(buyData);

            const response = await fetch(`${baseUrl}/compras/cadastrar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setFormLoading(false);
                setBuyErrorData(result.errors);
                navigate('/promocao/compras', {
                    state: {
                        message: { type: 'error', text: 'Por favor, verifique o(s) campo(s) sinalizados' },
                    },
                });
                return;
            }

            setFormLoading(false);

            setBuyData({
                numero_cupom: '',
                data: '',
                hora: '',
                valor: '',
                quantidade: '',
                cnpj_loja: '',
                produtos_ids: [],
                imagem: null,
            });

            setBuyErrorData({
                numero_cupom: [],
                data: [],
                hora: [],
                valor: [],
                quantidade: [],
                cnpj_loja: [],
                produtos_ids: [],
                imagem: [],
            });

            fetchData();

            navigate('/promocao/compras', {
                state: {
                    message: { type: 'success', text: result.message },
                },
            });


        } catch (error) {
            setFormLoading(false);
            console.log(error.message);
        }
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#fff",
            paddingLeft: "5px",
            border: state.isFocused ? "1.5px solid #8D8D8D" : "1.5px solid #8D8D8D",
            borderRadius: "10px",
            minHeight: "40px",
            boxShadow: state.isFocused ? "0 0 5px rgba(0, 0, 0, 0.1)" : "none",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#8D8D8D",
            fontSize: "14px"
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#007bff" : state.isFocused ? "#f0f0f0" : "#fff",
            paddingLeft: "15px",
            paddingRight: "15px",
            color: state.isSelected ? "#fff" : "#000",
            padding: 10,
            fontSize: "14px"
        }),
    };

    const getOptionLabel = (option) => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <img
                src={option.image}
                alt={option.label}
                style={{ width: 40, marginRight: 10 }}
            />
            {option.label}
        </div>
    );

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        const typeUser = localStorage.getItem("user_type");

        if (!accessToken || typeUser !== "participante") {
            navigate("/promocao/", { replace: true });
            return;
        }

        let etapa = tokenData.participante.etapa_cadastro;
        if (etapa === "etapa1") {
            navigate("/promocao/etapa-2", { replace: true });
            return;
        }

        if (etapa === "etapa2") {
            setTimeout(() => {
                setShowPopup(true);
            }, 2000);
        }

        setIsLoading(false);
    }, [navigate, tokenData]);

    if (isLoading) {
        return null;
    }

    return (
        <S.Container>
            <section className="relative register py-1 AjusteRegister overflow-hidden">
                <img src={`/promocao/assets/img/nuvemg.png`} className="nuvemG" alt="Nuvem grande" />
                <img src={`/promocao/assets/img/nuvem.png`} className="nuvemG2" alt="Nuvem" />
                <img src={`/promocao/assets/img/oculos.png`} className="oculosG moveImg" alt="Óculos" />

                <div className="content content--xx-large over-stamp">
                    <h1 data-aos="flip-up" data-aos-duration="900">Cadastre suas compras</h1>
                    <p>Cadastre seu cupom fiscal aqui e boa sorte!</p>
                </div>

                <div className="coupons content content--x-small">
                    <div className="accordion products-stamp">
                        <div className="accordion__item backgroundGanhadores">
                            <button
                                href="javascript:void(0);"
                                className="accordion__compras accordion__title-btn"
                                onClick={() => toggleAccordion()}
                            >
                                MEU CADASTRO - COMPRAS CADASTRADAS <span className="accordion__indicator"></span>
                            </button>
                            <div className={`accordion__content transition-all overflow-hidden [&>p_+_p]:mt-2 ${!activeCompra ? 'max-h-0 !py-0' : 'max-h-[1000px]'}`}>
                                {compras && compras.length > 0 ? (
                                    compras.map((value, index) => (
                                        <p key={index} className="!text-xl">
                                            {index + 1} - Nº do Cupom/Nota Fiscal: <b>{value.cupom}</b>
                                            <br />
                                            Número(s) da sorte: <b className="lucky__number--item">
                                                {value.numeros_sorte}
                                            </b>
                                        </p>
                                    ))
                                ) : (
                                    <span className="">
                                        Não há compras cadastradas até o momento.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isOn ? (
                    tokenData.liberado <= 10 ? (
                        <div className="form-container content content--x-small formCupons">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <img src={`/promocao/assets/img/aviao-contato.png`} className="aviaoG moveImg" alt="Avião" />
                                <fieldset className="form__fieldset">
                                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                                        <div className="w-full">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="text"
                                                    name="numero_cupom"
                                                    placeholder="Nº do cupom / nota fiscal*"
                                                    value={buyData.numero_cupom}
                                                    onChange={handleChange}
                                                    onClick={() => setBuyErrorData(prevData => ({ ...prevData, numero_cupom: [] }))}
                                                    className="p-2 border rounded form__input"
                                                />

                                                <div className="absolute right-2">
                                                    <button type="button" className="peer" onClick={() => setShowHelpNumbersModal(true)}>
                                                        <FontAwesomeIcon icon={faInfoCircle} className="text-neutral-800 text-lg opacity-80 transition-all hover:opacity-100" />
                                                    </button>

                                                    <div className="absolute -right-3 sm:right-auto md:left-1/2 top-full mt-4 w-max md:-translate-x-1/2 scale-95 opacity-0 transition-all duration-200 ease-out pointer-events-none peer-hover:pointer-events-auto peer-hover:opacity-100 peer-hover:scale-100 z-10">
                                                        <div className="relative bg-tertiary text-neutral-800 px-4 py-2.5 rounded-lg shadow-lg">
                                                            <span className="text-white text-xs">Não sabe onde encontrar o número do seu<br /> cupom fiscal? Clique aqui para ver um exemplo.</span>
                                                            <div className="absolute right-3 sm:right-auto -top-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-tertiary rotate-45"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {buyErrorData.numero_cupom && buyErrorData.numero_cupom[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{buyErrorData.numero_cupom[0]} <span onClick={() => setBuyErrorData(prevData => ({ ...prevData, numero_cupom: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                        </div>
                                        <div className="w-full">
                                            <div className="relative flex items-center">
                                                <DatePicker
                                                    selected={dateValue}
                                                    onChange={handleDateChange}
                                                    locale="pt-BR"
                                                    dateFormat="dd/MM/yyyy HH:mm"
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={1}
                                                    timeCaption="Hora"
                                                    className="form__input"
                                                    placeholderText="Data e Hora* __/__/____  hh:mm"
                                                    maxDate={new Date()}
                                                />

                                                <div className="absolute right-2">
                                                    <button
                                                        type="button"
                                                        className="peer"
                                                        onClick={() =>
                                                            handleOpenHelpModal(
                                                                'Confira a data do cupom fiscal destacado em vermelho.',
                                                                'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-data.png'
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faInfoCircle} className="text-neutral-800 text-lg opacity-80 transition-all hover:opacity-100" />
                                                    </button>

                                                    <div className="absolute -right-3 sm:right-auto md:left-1/2 top-full mt-4 w-max md:-translate-x-1/2 scale-95 opacity-0 transition-all duration-200 ease-out pointer-events-none peer-hover:pointer-events-auto peer-hover:opacity-100 peer-hover:scale-100 z-10">
                                                        <div className="relative bg-tertiary text-neutral-800 px-4 py-2.5 rounded-lg shadow-lg">
                                                            <span className="text-white text-xs">
                                                                Essas informações estão próximas ao início <br />do cupom. Clique aqui para saber onde localizar.
                                                            </span>
                                                            <div className="absolute right-3 sm:right-auto -top-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-tertiary rotate-45"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {buyErrorData.data && buyErrorData.data[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{buyErrorData.data[0]} <span onClick={() => setBuyErrorData(prevData => ({ ...prevData, data: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                        </div>
                                    </div>
                                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                                        <div className="w-full">
                                            <div className="relative flex items-center">
                                                <InputMask
                                                    value={buyData.cnpj_loja}
                                                    name="cnpj_loja"
                                                    mask="__.___.___/____-__"
                                                    replacement={{ _: /\d/ }}
                                                    onClick={() => setBuyErrorData(prevData => ({ ...prevData, cnpj_loja: [] }))}
                                                    onChange={handleChange}
                                                    type="text"
                                                    id="cnpj"
                                                    placeholder="CNPJ do estabelecimento*"
                                                    className="p-2 border rounded w-full form__input "
                                                />

                                                <div className="absolute right-2">
                                                    <button
                                                        type="button"
                                                        className="peer"
                                                        onClick={() =>
                                                            handleOpenHelpModal(
                                                                'Confira o CNPJ da loja destacado em vermelho.',
                                                                'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-cnpj.png'
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faInfoCircle} className="text-neutral-800 text-lg opacity-80 transition-all hover:opacity-100" />
                                                    </button>

                                                    <div className="absolute -right-3 sm:right-auto md:left-1/2 top-full mt-4 w-max md:-translate-x-1/2 scale-95 opacity-0 transition-all duration-200 ease-out pointer-events-none peer-hover:pointer-events-auto peer-hover:opacity-100 peer-hover:scale-100 z-10">
                                                        <div className="relative bg-tertiary text-neutral-800 px-4 py-2.5 rounded-lg shadow-lg">
                                                            <span className="text-white text-xs">
                                                                O CNPJ geralmente aparece no cabeçalho <br />do cupom fiscal. Clique aqui para identificar.
                                                            </span>
                                                            <div className="absolute right-3 sm:right-auto -top-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-tertiary rotate-45"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {buyErrorData.cnpj_loja && buyErrorData.cnpj_loja[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{buyErrorData.cnpj_loja[0]} <span onClick={() => setBuyErrorData(prevData => ({ ...prevData, cnpj_loja: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                        </div>

                                        <div className="w-full grid grid-cols-5 gap-4">
                                            <div className='w-full col-span-3'>
                                                <div className="relative flex items-center">
                                                    <NumericFormat
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        prefix="R$ "
                                                        placeholder="a"
                                                        allowNegative={false}
                                                        onClick={() => setBuyErrorData(prevData => ({ ...prevData, valor: [] }))}
                                                        fixedDecimalScale
                                                        decimalScale={2}
                                                        value={buyData.valor}
                                                        onValueChange={(values) => {
                                                            const { value } = values;
                                                            setBuyData((prev) => ({ ...prev, valor: value }));
                                                        }}
                                                        className="p-2 border rounded w-full form__input"
                                                        placeholder="Valor compra*"
                                                    />

                                                    <div className="absolute right-2">
                                                        <button
                                                            type="button"
                                                            className="peer"
                                                            onClick={() =>
                                                                handleOpenHelpModal(
                                                                    'Confira o valor da compra destacado em vermelho.',
                                                                    'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-valor.png'
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faInfoCircle} className="text-neutral-800 text-lg opacity-80 transition-all hover:opacity-100" />
                                                        </button>

                                                        <div className="absolute -right-3 sm:right-auto md:left-1/2 top-full mt-4 w-max md:-translate-x-1/2 scale-95 opacity-0 transition-all duration-200 ease-out pointer-events-none peer-hover:pointer-events-auto peer-hover:opacity-100 peer-hover:scale-100 z-10">
                                                            <div className="relative bg-tertiary text-neutral-800 px-4 py-2.5 rounded-lg shadow-lg">
                                                                <span className="text-white text-xs">
                                                                    Informe o valor total da sua compra,<br /> exatamente como aparece no cupom.
                                                                </span>
                                                                <div className="absolute right-3 sm:right-auto -top-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-tertiary rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {buyErrorData.valor && buyErrorData.valor[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{buyErrorData.valor[0]} <span onClick={() => setBuyErrorData(prevData => ({ ...prevData, valor: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                            </div>
                                            <div className='w-full col-span-2'>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="number"
                                                        name="quantidade"
                                                        placeholder="Qtde*"
                                                        onClick={() => setBuyErrorData(prevData => ({ ...prevData, quantidade: [] }))}
                                                        value={buyData.quantidade}
                                                        onChange={handleChange}
                                                        className="p-2 border rounded w-full form__input "
                                                    />

                                                    <div className="absolute right-2">
                                                        <button
                                                            type="button"
                                                            className="peer"
                                                            onClick={() =>
                                                                handleOpenHelpModal(
                                                                    'Confira a quantidade de vinhos Marcus James comprados (desconsidere outros produtos da nota).',
                                                                    'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-qtde.png'
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faInfoCircle} className="text-neutral-800 text-lg opacity-80 transition-all hover:opacity-100" />
                                                        </button>

                                                        <div className="absolute -right-3 sm:right-auto md:left-1/2 top-full mt-4 w-max md:-translate-x-1/2 scale-95 opacity-0 transition-all duration-200 ease-out pointer-events-none peer-hover:pointer-events-auto peer-hover:opacity-100 peer-hover:scale-100 z-10">
                                                            <div className="relative bg-tertiary text-neutral-800 px-4 py-2.5 rounded-lg shadow-lg">
                                                                <span className="text-white text-xs">
                                                                    Quantidade de <b>vinhos Marcus James</b> comprados<br />(desconsidere outros produtos da nota).
                                                                </span>
                                                                <div className="absolute right-3 sm:right-auto -top-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-tertiary rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {buyErrorData.quantidade && buyErrorData.quantidade[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{buyErrorData.quantidade[0]} <span onClick={() => setBuyErrorData(prevData => ({ ...prevData, quantidade: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full mb-5'>
                                        <div className="relative flex items-center">
                                            <Select
                                                styles={customStyles}
                                                name="produtos_ids"
                                                options={productsSelect}
                                                className="basic-multi-select w-full"
                                                isMulti
                                                value={productsSelect.filter(option => buyData.produtos_ids.includes(option.value))}
                                                onClick={() => setBuyErrorData(prevData => ({ ...prevData, produtos_ids: [] }))}
                                                onChange={selectedOptions => handleSelectChange('produtos_ids', selectedOptions.map(option => option.value))}
                                                getOptionLabel={getOptionLabel}
                                                placeholder="Produtos adquiridos"
                                            />

                                            <div className="absolute right-12">
                                                <button
                                                    type="button"
                                                    className="peer"
                                                    onClick={() =>
                                                        handleOpenHelpModal(
                                                            'Confira os produtos destacados em vermelho.',
                                                            'https://promocao-media.marcusjames.com.br/uploads/examples/cupom-produtos.png'
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon icon={faInfoCircle} className="text-neutral-800 text-lg opacity-80 transition-all hover:opacity-100" />
                                                </button>

                                                <div className="absolute -right-3 sm:right-auto md:left-1/2 top-full mt-4 w-max md:-translate-x-1/2 scale-95 opacity-0 transition-all duration-200 ease-out pointer-events-none peer-hover:pointer-events-auto peer-hover:opacity-100 peer-hover:scale-100 z-10">
                                                    <div className="relative bg-tertiary text-neutral-800 px-4 py-2.5 rounded-lg shadow-lg">
                                                        <span className="text-white text-xs">
                                                            Selecione <b>todos os vinhos Marcus James</b><br /> presentes no cupom fiscal.
                                                        </span>
                                                        <div className="absolute right-3 sm:right-auto -top-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-tertiary rotate-45"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {buyErrorData.produtos_ids && buyErrorData.produtos_ids[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{buyErrorData.produtos_ids[0]} <span onClick={() => setBuyErrorData(prevData => ({ ...prevData, produtos_ids: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>
                                    <div className="relative">
                                        <FileDropzone
                                            name="imagem"
                                            value={buyData.imagem}
                                            onChangeFile={(file) => {
                                                setBuyData(prev => {
                                                    console.log("Novo arquivo:", file);
                                                    return { ...prev, imagem: file };
                                                });
                                                setBuyErrorData(prevData => ({ ...prevData, imagem: [] }));
                                            }}
                                            onDelete={() => setBuyData(prev => ({ ...prev, imagem: null }))}
                                        />
                                        {buyErrorData.imagem && buyErrorData.imagem[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{buyErrorData.imagem[0]} <span onClick={() => setBuyErrorData(prevData => ({ ...prevData, imagem: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}

                                        <div className="absolute top-3.5 right-[5.6rem] md:right-[7.2rem]">
                                            <span
                                                className="peer"
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} className="text-neutral-800 text-lg opacity-80 transition-all hover:opacity-100" />
                                            </span>

                                            <div className="absolute -right-24 sm:right-auto max-w-[85vw] md:left-1/2 top-full mt-4 w-max md:-translate-x-1/2 scale-95 opacity-0 transition-all duration-200 ease-out pointer-events-none peer-hover:pointer-events-auto peer-hover:opacity-100 peer-hover:scale-100 z-10">
                                                <div className="relative bg-tertiary text-neutral-800 px-4 py-2.5 rounded-lg shadow-lg">
                                                    <span className="text-white text-xs">
                                                        A imagem deve estar legível e mostrar:
                                                        <ul className="list-disc pl-4">
                                                            <li>Data da compra</li>
                                                            <li>CNPJ do estabelecimento</li>
                                                            <li>UF do local da compra</li>
                                                            <li>Número do cupom/nota fiscal</li>
                                                            <li>Valor total da compra</li>
                                                            <li>Quantidade de vinhos Marcus James</li>
                                                            <li>COO ou CCF (se for cupom)</li>
                                                            <li>Chave de acesso da nota fiscal (44 dígitos) e/ou QR Code</li>
                                                        </ul>
                                                    </span>
                                                    <div className="absolute right-24 sm:right-auto -top-2 md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-tertiary rotate-45"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="form__submit button button--dark"
                                        type="submit"
                                    >
                                        {!formLoading ? (
                                            'Cadastrar'
                                        ) : (
                                            <div role="status" className="flex justify-center items-center">
                                                <svg aria-hidden="true" className="w-6 h-6 text-white text-opacity-60 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        )}
                                    </button>
                                </fieldset>
                            </form>
                        </div>
                    ) : (
                        <div className="content-xx-small">
                            <p className="title-support">Você atingiu o limite de notas cadastradas, confira o <Link to="/regulamento" className="font-bold underline">Regulamento</Link> para saber mais</p>
                        </div>
                    )
                ) : (
                    <div className="content-xx-small">
                        <p className="title-support">O cadastro de novas notas encerrou em 31/08.</p>
                    </div>
                )}

                {showPopup && <RegisterModal setShowPopup={setShowPopup} />}

                {showHelpNumbersModal && <HelpNumbersModal setShowHelpNumbersModal={setShowHelpNumbersModal} />}

                {showHelpGeneralModal && <HelpGeneralModal setShowHelpGeneralModal={setShowHelpGeneralModal} imageSrc={generalModalData.image} imageText={generalModalData.message} />}
            </section>
        </S.Container>
    );
}

export default Compras;
