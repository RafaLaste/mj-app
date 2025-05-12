import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from './TokenContext';
import { InputMask } from '@react-input/mask';
import Select from 'react-select';

export const FormRegisterEtapa3 = () => {
    const [loading, setLoading] = useState(true);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const navigate = useNavigate();
    const { tokenData, checkToken } = useToken();

    const [userData, setUserData] = useState({
        id: tokenData.id,
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    });

    const [userErrorData, setUserErrorData] = useState({
        logradouro: [],
        numero: [],
        complemento: [],
        bairro: [],
        cidade: [],
        estado: [],
        cep: []
    });

    const accessToken = localStorage.getItem('access_token');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleStateChange = async (selectedOption) => {
        setUserData(prevData => ({
            ...prevData,
            estado: selectedOption.value,
            cidade: '',
        }));
        setUserErrorData(prevData => ({
            ...prevData,
            estado: [],
            cidade: [],
        }));

        try {
            const response = await fetch(`${baseUrl}/estados/${selectedOption.value}/cidades/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCities(data.cidades);
            } else {
                console.error("Error fetching cities.");
            }
        } catch (error) {
            console.error("Error in request", error);
        }
    };

    const handleCityChange = (selectedOption) => {
        setUserData(prevData => ({
            ...prevData,
            cidade: selectedOption.value,
        }));
        setUserErrorData(prevData => ({
            ...prevData,
            cidade: [],
        }));
    };

    const [formLoading, setFormLoading] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await fetch(`${baseUrl}/compras/cadastro/terceira-etapa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (!response.ok) {
                setFormLoading(false);
                setUserErrorData(result.errors);
                navigate('/promocao/cadastro/finalizar', {
                    state: {
                        message: { type: 'error', text: 'Por favor, verifique o(s) campo(s) sinalizados' },
                    },
                });
                return;
            }

            setFormLoading(false);
            setLoading(false);
            checkToken();

        } catch (error) {
            setFormLoading(false);
            console.log(error.message);
        }
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const statesResponse = await fetch(`${baseUrl}/estados/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (statesResponse.ok) {
                    const statesData = await statesResponse.json();
                    setStates(statesData.estados);
                } else {
                    console.error("Erro ao buscar os estados.");
                }
            } catch (error) {
                console.error("Erro na requisição", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

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
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#007bff" : state.isFocused ? "#f0f0f0" : "#fff",
            paddingLeft: "15px",
            paddingRight: "15px",
            color: state.isSelected ? "#fff" : "#000",
            padding: 10,
        }),
    };

    return (
        <section id="contato" className="contact">
            <div className="contactContent">
                <img src={`/promocao/assets/img/aviao-contato.png`} className="aviaoContato moveImg" alt="Aviao" />
                <img src={`/promocao/assets/img/chapeu.png`} className="chapeuContato moveImg" alt="Chapeu" />
                <h1 data-aos="flip-up" data-aos-duration="900">Finalize seu cadastro!</h1>
                <h3 style={{ marginTop: '15px' }}>
                    <span data-aos="zoom-in">Insira aqui os dados restantes para confirmar sua participação na promoção</span>
                </h3>
                <form onSubmit={handleSubmit}>
                    {loading ? (
                        <div className="mx-auto py-20 flex justify-center">
                            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
                        </div>
                    ) : (
                        <fieldset className="form__fieldset">
                            <div className="form__row clearfix">
                                <div className="form__control form__control--half">
                                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <Select
                                        styles={customStyles}
                                        name="estado"
                                        options={states}
                                        value={states.find(option => option.value === userData.estado) || null}
                                        onClick={() => setUserErrorData(prevData => ({...prevData, estado: []}))}
                                        onChange={handleStateChange}
                                        placeholder="Selecione um estado..."
                                        className="user-select"
                                    />
                                    {userErrorData.estado && userErrorData.estado[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.estado[0]} <span onClick={() => setUserErrorData(prevData => ({...prevData, estado: []}))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>
                                <div className="form__control form__control--half">
                                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                                    <Select
                                        styles={customStyles}
                                        name="cidade"
                                        options={cities}
                                        value={cities.find(option => option.value === userData.cidade) || null}
                                        onClick={() => setUserErrorData(prevData => ({...prevData, cidade: []}))}
                                        onChange={handleCityChange}
                                        placeholder={!userData.estado ? 'Selecione primeiro um estado' : 'Selecione uma cidade...'}
                                        className="user-select"
                                        isDisabled={!userData.estado}
                                    />
                                    {userErrorData.cidade && userErrorData.cidade[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.cidade[0]} <span onClick={() => setUserErrorData(prevData => ({...prevData, cidade: []}))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>
                            </div>

                            <div className="form__row clearfix">
                                <div className="form__control form__control--half">
                                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                                    <InputMask
                                        mask="_____-___"
                                        value={userData.cep}
                                        replacement={{ _: /\d/ }}
                                        onClick={() => setUserErrorData(prevData => ({ ...prevData, cep: [] }))}
                                        onChange={handleChange}
                                        type="text"
                                        id="cep"
                                        name="cep"
                                        placeholder="CEP"
                                        className="form__input"
                                    />
                                    {userErrorData.cep && userErrorData.cep[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.cep[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, cep: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>
                                
                                <div className="form__control form__control--half">
                                    <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                                    <input
                                        value={userData.logradouro}
                                        onClick={() => setUserErrorData(prevData => ({ ...prevData, logradouro: [] }))}
                                        onChange={handleChange}
                                        type="text"
                                        id="logradouro"
                                        name="logradouro"
                                        placeholder="Logradouro"
                                        className="form__input"
                                    />
                                    {userErrorData.logradouro && userErrorData.logradouro[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.logradouro[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, logradouro: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>
                            </div>
                            <div className="form__row clearfix">
                                <div className="form__control form__control--half">
                                    <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                                    <input
                                        value={userData.bairro}
                                        onClick={() => setUserErrorData(prevData => ({ ...prevData, bairro: [] }))}
                                        onChange={handleChange}
                                        type="text"
                                        id="bairro"
                                        name="bairro"
                                        placeholder="Bairro"
                                        className="form__input"
                                    />
                                    {userErrorData.bairro && userErrorData.bairro[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.bairro[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, bairro: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>
                                
                                <div className="form__control form__control--half">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                                            <InputMask
                                                mask="______"
                                                value={userData.numero}
                                                replacement={{ _: /\d/ }}
                                                onClick={() => setUserErrorData(prevData => ({ ...prevData, numero: [] }))}
                                                onChange={handleChange}
                                                type="text"
                                                id="numero"
                                                name="numero"
                                                placeholder="Número"
                                                className="form__input"
                                            />
                                            {userErrorData.numero && userErrorData.numero[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.numero[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, numero: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                        </div>

                                        <div>
                                            <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                                            <input
                                                value={userData.complemento}
                                                onClick={() => setUserErrorData(prevData => ({ ...prevData, complemento: [] }))}
                                                onChange={handleChange}
                                                type="text"
                                                id="complemento"
                                                name="complemento"
                                                placeholder="Complemento"
                                                className="form__input"
                                            />
                                            {userErrorData.complemento && userErrorData.complemento[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.complemento[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, complemento: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form__control form__control--submit">

                                <button
                                    className='form__submit button button--dark form__disable'
                                    type="submit"
                                >
                                    {!formLoading ? (
                                        'Finalizar'
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
                            </div>
                        </fieldset>
                    )}
                </form>
            </div>
        </section>
    );
};
