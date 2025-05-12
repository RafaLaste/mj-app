import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from './TokenContext';
import { InputMask } from '@react-input/mask';
export const FormRegisterEtapa2 = () => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { tokenData, checkToken } = useToken();

    const [userData, setUserData] = useState({
        id: tokenData.id,
        cpf: '',
        rg: '',
        data_nascimento: '',
        regulamento: false,
        privacidade: false,
        telefone: '',
    });

    const [userErrorData, setUserErrorData] = useState({
        cpf: [],
        rg: [],
        data_nascimento: [],
        telefone: [],
    });

    const accessToken = localStorage.getItem('access_token');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [formLoading, setFormLoading] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        if (!userData.regulamento && userData.privacidade) {
            navigate('/promocao/etapa-2', {
                state: {
                    message: { type: 'error', text: 'Aceite os termos da regulamentação antes de cadastrar!' },
                },
            });
            setFormLoading(false);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/cadastro/segunda-etapa`, {
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
                navigate('/promocao/etapa-2', {
                    state: {
                        message: { type: 'error', text: 'Por favor, verifique o(s) campo(s) sinalizados' },
                    },
                });
                return;
            }

            setFormLoading(false);
            setLoading(false);

            navigate('/promocao/etapa-2', {
                state: {
                    message: { type: 'success', text: result.message },
                },
            });

            setTimeout(() => {
                window.location.href = '/promocao/compras';
                // checkToken();
            }, 3000);

        } catch (error) {
            setFormLoading(false);
            console.log(error.message);
        }
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <section id="contato" className="contact">
            <div className="contactContent">
                <img src={`/promocao/assets/img/aviao-contato.png`} className="aviaoContato moveImg" alt="Aviao" />
                <img src={`/promocao/assets/img/chapeu.png`} className="chapeuContato moveImg" alt="Chapeu" />
                <h1 data-aos="flip-up" data-aos-duration="900">Segunda etapa</h1>
                <h3 style={{ marginTop: '15px' }}>
                    <span data-aos="zoom-in">É fácil, </span>
                    <span data-aos="zoom-in" data-aos-delay="1000">rápido </span>
                    <span data-aos="zoom-in" data-aos-delay="2000">e seguro</span>
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
                                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                                    <InputMask
                                        mask="___.___.___-__"
                                        value={userData.cpf}
                                        replacement={{ _: /\d/ }}
                                        onClick={() => setUserErrorData(prevData => ({ ...prevData, cpf: [] }))}
                                        onChange={handleChange}
                                        type="text"
                                        id="cpf"
                                        name="cpf"
                                        placeholder="CPF"
                                        className="form__input"
                                    />
                                    {userErrorData.cpf && userErrorData.cpf[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.cpf[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, cpf: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>
                                <div className="form__control form__control--half">
                                    <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-2">RG</label>
                                    <input
                                        value={userData.rg}
                                        onClick={() => setUserErrorData(prevData => ({ ...prevData, rg: [] }))}
                                        onChange={handleChange}
                                        type="text"
                                        id="rg"
                                        name="rg"
                                        placeholder="RG"
                                        className="form__input"
                                    />
                                    {userErrorData.rg && userErrorData.rg[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.rg[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, rg: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>

                            </div>
                            <div className="form__row clearfix">
                                <div className="form__control form__control--half">
                                    <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700 mb-2">Data de nascimento</label>
                                    <input
                                        value={userData.data_nascimento}
                                        onClick={() => setUserErrorData(prevData => ({ ...prevData, data_nascimento: [] }))}
                                        onChange={handleChange}
                                        type="date"
                                        id="data_nascimento"
                                        name="data_nascimento"
                                        placeholder="Data de nascimento"
                                        className="form__input"
                                        max="2007-01-01"
                                    />
                                    {userErrorData.data_nascimento && userErrorData.data_nascimento[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.data_nascimento[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, data_nascimento: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>
                                <div className="form__control form__control--half">
                                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <InputMask
                                        type="text"
                                        name="telefone"
                                        placeholder='Telefone'
                                        mask="(__) _____-____"
                                        replacement={{ _: /\d/ }}
                                        value={userData.telefone}
                                        onClick={() => setUserErrorData(prevData => ({ ...prevData, telefone: [] }))}
                                        onChange={handleChange}
                                        className="form__input"
                                    />
                                    {userErrorData.telefone && userErrorData.telefone[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.telefone[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, telefone: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                </div>

                            </div>
                            <div className="form__row clearfix checkArea">
                                <input name="regulamento" onChange={handleChange} checked={userData.regulamento} type="checkbox" className="form__control--checkbox" tabindex="0" />
                                <p>Li e concordo com os termos do <a href="/politica-privacidade" target='_blank' className="footer__text-link">Regulamento da Promoção</a> indicado no Certificado de Autorização SEAE/ME Nº 04.020643/2022.</p>
                            </div>
                            <div className="form__row clearfix checkArea">
                                <input name="privacidade" onChange={handleChange} checked={userData.privacidade} type="checkbox" className="form__control--checkbox" tabindex="0" />
                                <p>Li o Aviso de <a href="/politica-privacidade" target='_blank' className="footer__text-link">Privacidade da Promoção</a> e estou ciente sobre o tratamento dos meus dados pessoais e demais termos.</p>
                            </div>
                            <div className="form__control form__control--submit">

                                <button
                                    className='form__submit button button--dark form__disable'
                                    type="submit"
                                    disabled={!(userData.privacidade && userData.regulamento)}
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
                            </div>
                        </fieldset>
                    )}
                </form>
            </div>
        </section >
    );
};
