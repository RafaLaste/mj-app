import React, { useState } from 'react';
import { useScroll } from './ScrollContext';
import { useNavigate } from 'react-router-dom';
export const FormRegister = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        nome: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [userErrorData, setUserErrorData] = useState({
        nome: [],
        email: [],
        password: [],
        password_confirmation: [],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [formLoading, setFormLoading] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormLoading(true);
        try {
            const response = await fetch(`${baseUrl}/cadastro/primeira-etapa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            if (response.ok) {

                const loginData = {
                    email: userData.email,
                    password: userData.password,
                    lembrar: false
                };

                const responseLogin = await fetch(`${baseUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData)
                });

                if (!responseLogin.ok) {
                    setFormLoading(false);
                    setError('Não foi possível efetuar o seu login.');
                    return;
                }

                const data = await responseLogin.json();

                localStorage.setItem('access_token', data.token);
                localStorage.setItem('user_id', data.usuario.id);
                localStorage.setItem('user_type', data.usuario.funcao);

                setFormLoading(false);

                window.location.href = '/promocao/etapa-2';
                setError('');

            } else {
                if (response.status === 422) {
                    const errors = await response.json();
                    setFormLoading(false);
                    setUserErrorData(errors.errors);
                    navigate('/promocao', {
                        state: {
                            message: { type: 'error', text: 'Por favor, verifique o(s) campo(s) sinalizados em vermelho.', show: true },
                        },
                    });
                }
            }
        } catch (error) {
            setFormLoading(false);
            setError(error.message);
            console.log(error)
        }
    };

    return (
        <section className="contact" id="cadastro" style={{ backgroundImage: `url(${'assets/img/contato.jpg'})` }}>
            <div className="contactContent">
                <img src={`/promocao/assets/img/aviao-contato.png`} className="aviaoContato moveImg" alt="Aviao" />
                <img src={`/promocao/assets/img/chapeu.png`} className="chapeuContato moveImg" alt="Chapeu" />
                <h1 data-aos="flip-up" data-aos-duration="900">Cadastre-se agora</h1>
                <h3 style={{ marginTop: '5px' }}>
                    <span data-aos="zoom-in">É fácil, </span>
                    <span data-aos="zoom-in" data-aos-delay="1000">rápido </span>
                    <span data-aos="zoom-in" data-aos-delay="2000">e seguro</span>
                </h3>
                <p><strong>Dados para acesso</strong></p>
                <form onSubmit={handleSubmit}>
                    <fieldset className="form__fieldset">
                        <div className="form__row clearfix">
                            <div className="form__control form__control--half">
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                <input
                                    value={userData.nome}
                                    onClick={() => setUserErrorData(prevData => ({ ...prevData, nome: [] }))}
                                    onChange={handleChange}
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    placeholder="Nome completo"
                                    className="form__input"
                                />
                                {userErrorData.nome && userErrorData.nome[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.nome[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, nome: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                            </div>
                            <div className="form__control form__control--half">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                                <input
                                    value={userData.email}
                                    onClick={() => setUserErrorData(prevData => ({ ...prevData, email: [] }))}
                                    onChange={handleChange}
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="E-mail"
                                    className="form__input"
                                />
                                {userErrorData.email && userErrorData.email[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.email[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, email: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                            </div>
                        </div>
                        <div className="form__row clearfix">
                            <div className="form__control form__control--half">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                                <input
                                    value={userData.password}
                                    onClick={() => setUserErrorData(prevData => ({ ...prevData, password: [] }))}
                                    onChange={handleChange}
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Crie sua senha"
                                    className="form__input"
                                />
                                {userErrorData.password && userErrorData.password[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.password[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, password: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}

                            </div>
                            <div className="form__control form__control--half">
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">Confirmar senha</label>
                                <input
                                    value={userData.password_confirmation}
                                    onClick={() => setUserErrorData(prevData => ({ ...prevData, password_confirmation: [] }))}
                                    onChange={handleChange}
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    placeholder="Repetir senha"
                                    className="form__input"
                                />
                                {userErrorData.password_confirmation && userErrorData.password_confirmation[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.password_confirmation[0]} <span onClick={() => setUserErrorData(prevData => ({ ...prevData, password_confirmation: [] }))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                            </div>
                        </div>
                        <div className="form__control form__control--submit">

                            <button
                                className='form__submit button button--dark form__disable'
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
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
    );
};
