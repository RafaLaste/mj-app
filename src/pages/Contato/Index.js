import { useNavigate } from 'react-router-dom';
import * as S from "./styles";
import { useToken } from '../../Components/TokenContext';
import { useState, useCallback } from 'react';
import { InputMask } from '@react-input/mask';
import Select from "react-select";
import debounce from "lodash.debounce";

function Contato() {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [optionsLoading, setOptionsLoading] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        email: '',
        cidade: '',
        assunto: '',
        mensagem: '',
    });

    const [formErrorData, setFormErrorData] = useState({
        nome: [],
        telefone: [],
        valor: [],
        email: [],
        cidade: [],
        assunto: [],
        mensagem: [],
    });

    const [formLoading, setFormLoading] = useState(false);

    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: selectedOption
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await fetch(`${baseUrl}/contato/enviar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                if (response.status === 422) {
                    const errors = await response.json();
                    setFormLoading(false);
                    setFormErrorData(errors.errors);
                    
                    navigate('/promocao/fale-conosco', {
                        state: {
                            message: { type: 'error', text: 'Por favor, verifique o(s) campo(s) sinalizados' },
                        },
                    });
                    return;
                }
            }

            setFormLoading(false);

            // setFormData({
            //     numero_cupom: '',
            //     data: '',
            //     hora: '',
            //     valor: '',
            //     quantidade: '',
            //     cnpj_loja: '',
            //     produtos_ids: [],
            //     imagem: null,
            // });

            // setFormErrorData({
            //     numero_cupom: [],
            //     data: [],
            //     hora: [],
            //     valor: [],
            //     quantidade: [],
            //     cnpj_loja: [],
            //     produtos_ids: [],
            //     imagem: [],
            // });

            navigate('/promocao/fale-conosco', {
                state: {
                    message: { type: 'success', text: 'Contato enviado com sucesso! Nossa equipe entrará em contato assim que possível.' },
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
            fontSize: "0.9em",
            border: state.isFocused ? "1.5px solid #8D8D8D" : "1.5px solid #8D8D8D",
            borderRadius: "10px",
            minHeight: "45px",
            boxShadow: state.isFocused ? "0 0 5px rgba(0, 0, 0, 0.1)" : "none",
            paddingLeft: "6px"
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#8D8D8D",
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: "0.9em",
            backgroundColor: state.isSelected ? "#007bff" : state.isFocused ? "#f0f0f0" : "#fff",
            color: state.isSelected ? "#000" : "#000",
            padding: 10,
        }),
    };

    const fetchOptions = async (input, callback) => {
        setOptionsLoading(true);

        if (!input) {
            setOptions([]);
            return callback([]);
        }
        try {
            const res = await fetch(`${baseUrl}/cidades?q=${input}`);
            const data = await res.json();
            setNextPageUrl(data.next_page_url);
            setOptions(data.cidades);
            callback(data.cidades);
        } catch (err) {
            console.error("Erro ao buscar cidades:", err);
            callback([]);
        } finally {
            setOptionsLoading(false);
        }
    };

    const debouncedFetchOptions = useCallback(
        debounce(fetchOptions, 500),
        [baseUrl]
    );

    const loadOptions = (input, callback) => {
        setInputValue(input);
        debouncedFetchOptions(input, callback);
    };

    const loadMore = async () => {
        if (!nextPageUrl) return;
        setOptionsLoading(true);
        try {
            const res = await fetch(nextPageUrl);
            const data = await res.json();
            const novasCidades = data.cidades;
            setNextPageUrl(data.next_page_url);
            setOptions((prev) => [...prev, ...novasCidades]);
        } catch (err) {
            console.error("Erro ao carregar mais cidades:", err);
        } finally {
            setOptionsLoading(false);
        }
    };

    const LoadingSpinner = () => {
        if (!optionsLoading) return null;
        
        return (
            <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    };

    return (
        <S.Container>
            <section className="contact" style={{ backgroundImage: `url(${'/promocao/assets/img/contato.jpg'})` }}>
                <div className="contactContent" id="contato">
                    <img
                        src={`/promocao/assets/img/aviao-contato.png`}
                        alt="Avião de Contato"
                        className="aviaoContato moveImg"
                    />
                    <img
                        src={`/promocao/assets/img/chapeu.png`}
                        alt="Chapéu"
                        className="chapeuContato moveImg"
                    />
                    <h1 data-aos="flip-up" data-aos-duration="900">
                        Fale conosco
                    </h1>
                    <p>Entre em contato em caso de dúvidas, comentários ou sugestões.</p>

                    <div className="form contact-stamp">
                        <form id="ContatoForm" className="async-form" onSubmit={handleSubmit} noValidate>
                            <fieldset className="form__fieldset">
                                <div className="form__row clearfix">
                                    <div className="form__control form__control--half">
                                        <input
                                            type="text"
                                            name="nome"
                                            placeholder="Nome*"
                                            onClick={() => setFormErrorData(prevData => ({ ...prevData, nome: [] }))}
                                            className="form__input"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formErrorData.nome && formErrorData.nome[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{formErrorData.nome[0]} <span onClick={() => setFormErrorData(prevData => ({ ...prevData, nome: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>
                                    <div className="form__control form__control--half">
                                        <InputMask
                                            type="text"
                                            name="telefone"
                                            placeholder="Telefone*"
                                            mask="(__) _____-____"
                                            replacement={{ _: /\d/ }}
                                            onClick={() => setFormErrorData(prevData => ({ ...prevData, telefone: [] }))}
                                            className="form__input mask-phone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formErrorData.telefone && formErrorData.telefone[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{formErrorData.telefone[0]} <span onClick={() => setFormErrorData(prevData => ({ ...prevData, telefone: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>
                                </div>

                                <div className="form__row clearfix">
                                    <div className="form__control form__control--half">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="E-mail*"
                                            onClick={() => setFormErrorData(prevData => ({ ...prevData, email: [] }))}
                                            className="form__input"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formErrorData.email && formErrorData.email[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{formErrorData.email[0]} <span onClick={() => setFormErrorData(prevData => ({ ...prevData, email: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>
                                    <div className="form__control form__control--half relative">
                                        <LoadingSpinner />
                                        <Select
                                            styles={customStyles}
                                            name="cidade"
                                            className="select2-dinamic-city"
                                            options={options}
                                            placeholder="Cidade*"
                                            noOptionsMessage={() => inputValue.length < 1 ? "Digite 1 ou mais caracteres" : "Nenhuma cidade encontrada"}
                                            onChange={(selectedOption) =>
                                                handleSelectChange("cidade", selectedOption ? selectedOption.value : null)
                                            }
                                            onMenuScrollToBottom={loadMore}
                                            onInputChange={(input) => {
                                                setInputValue(input);
                                                if (input.length >= 1) {
                                                    debouncedFetchOptions(input, () => {});
                                                }
                                                setFormErrorData(prevData => ({ ...prevData, cidade: [] }))
                                            }}
                                            onMenuClose={() => {
                                                setOptions([]);
                                                setInputValue('');
                                                setNextPageUrl(null);
                                            }}
                                        />
                                        {formErrorData.cidade && formErrorData.cidade[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{formErrorData.cidade[0]} <span onClick={() => setFormErrorData(prevData => ({ ...prevData, cidade: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>
                                </div>

                                <div className="form__row clearfix">
                                    <div className="form__control">
                                        <input
                                            type="text"
                                            name="assunto"
                                            placeholder="Assunto*"
                                            onClick={() => setFormErrorData(prevData => ({...prevData, assunto: []}))}
                                            className="form__input"
                                            value={formData.assunto}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formErrorData.assunto && formErrorData.assunto[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{formErrorData.assunto[0]} <span onClick={() => setFormErrorData(prevData => ({ ...prevData, assunto: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>
                                </div>

                                <div className="form__row clearfix">
                                    <div className="form__control">
                                        <textarea
                                            name="mensagem"
                                            placeholder="Mensagem*"onClick={() => setFormErrorData(prevData => ({ ...prevData, mensagem: [] }))}
                                            className="form__input form__input--textarea"
                                            value={formData.mensagem}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                        {formErrorData.mensagem && formErrorData.mensagem[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{formErrorData.mensagem[0]} <span onClick={() => setFormErrorData(prevData => ({ ...prevData, mensagem: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>
                                </div>

                                <div className="form__row clearfix">
                                    <div className="form__control form__control--submit">
                                        <button type="submit" className="relative form__submit button button--dark">
                                            <span className={formLoading && 'opacity-0'}>Enviar</span>

                                            {formLoading && (
                                                <div role="status" className="flex justify-center items-center absolute inset-0">
                                                    <svg aria-hidden="true" className="w-6 h-6 text-white text-opacity-60 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                    </svg>
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </section>
        </S.Container>
    );
}

export default Contato;