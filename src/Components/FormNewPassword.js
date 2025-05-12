import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function FormLogin() {
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({
        password: '',
        password_confirmation: ''
    });

    const [userErrorData, setUserErrorData] = useState({
        password: [],
        password_confirmation: [],
    });

    const navigate = useNavigate();
    const { token } = useParams();
    const baseUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormLoading(true);
        try {
            const response = await fetch(`${baseUrl}/senha/atualizar/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                const data = await response.json();

                navigate('/promocao', {
                    state: { message: { type: 'success', text: data.message, show: true } },
                });

            } else {
                if (response.status === 422) {
                    const errors = await response.json();

                    setFormLoading(false);
                    setUserErrorData(errors);
                    navigate(`/promocao/alterar-senha/${token}`, {
                        state: {
                            message: { type: 'error', text: 'Por favor, verifique o(s) campo(s) sinalizados.', show: true},
                        },
                    });
                }
            }
        } catch (error) {
            setFormLoading(false);
            setError(error.message);
        }
    };

    return (
        <>
            <section className="login pt-1 pb-2">
                <div className="content content--xx-large over-stamp">
                    <h1 data-aos="flip-up" data-aos-duration="900">Definir nova senha</h1>
                </div>

                <img src={`/promocao/assets/img/nuvemd.png`} alt="Nuvem pequena" className="nuvemD" />
                <img src={`/promocao/assets/img/nuvemg.png`} alt="Nuvem grande" className="nuvemG" />

                <div className="content content--x-small">
                    <div className="form login-stamp">
                        <img
                            src={`/promocao/assets/img/aviao-contato.png`}
                            alt="Avião"
                            className="aviaoLogin moveImg"
                        />
                        <img
                            src={`/promocao/assets/img/taca.png`}
                            alt="Taça"
                            className="tacaLogin moveImg"
                        />
                        <img
                            src={`/promocao/assets/img/mala.png`}
                            alt="Mala"
                            className="malaLogin moveImg"
                        />

                        <form id="ContatoForm" className="form--async-login" onSubmit={handleSubmit}>
                            <fieldset className="form__fieldset">
                                <div className="form__row clearfix">
                                    <div className="form__control">
                                        <input
                                        placeholder='Senha'
                                        type="password"
                                        name="password"
                                        value={userData.password}
                                        onClick={() => setUserErrorData(prevData => ({...prevData, password: []}))}
                                        onChange={handleChange}
                                        className="form__input"
                                    />
                                        <span className="absolute right-3 top-9">
                                            <svg
                                                className="fill-current"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.5">
                                                    <path
                                                        d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                                        fill=""
                                                    ></path>
                                                    <path
                                                        d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                                        fill=""
                                                    ></path>
                                                </g>
                                            </svg>
                                        </span>
                                        {userErrorData.password && userErrorData.password[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.password[0]} <span onClick={() => setUserErrorData(prevData => ({...prevData, password: []}))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>

                                    <div className="form__row clearfix">
                                        <input
                                            type="password"
                                            placeholder='Confirme a Senha'
                                            name="password_confirmation"
                                            value={userData.password_confirmation}
                                            onClick={() => setUserErrorData(prevData => ({...prevData, password_confirmation: []}))}
                                            onChange={handleChange}
                                            className="form__input"
                                        />
                                          <span className="absolute right-3 top-9">
                                            <svg
                                                className="fill-current"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.5">
                                                    <path
                                                        d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                                        fill=""
                                                    ></path>
                                                    <path
                                                        d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                                        fill=""
                                                    ></path>
                                                </g>
                                            </svg>
                                        </span>
                                        {userErrorData.password_confirmation && userErrorData.password_confirmation[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{userErrorData.password_confirmation[0]} <span onClick={() => setUserErrorData(prevData => ({...prevData, password_confirmation: []}))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                                    </div>
                                </div>

                                <button type="submit" className="form__submit button secondary-background">
                                    {!formLoading ? (
                                        'Enviar'
                                    ) : (
                                        <div role="status" className="flex justify-center items-center">
                                            <svg aria-hidden="true" className="w-6 h-6 text-white text-opacity-60 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    )}
                                </button>
                            </fieldset>
                        </form>
                        
                        {
                            error && (
                                <div onClick={()=> setError('')} className="cursor-pointer -mt-4 mb-6">
                                    <div className="flex items-center justify-center w-full border-l-4 border-rose-500 bg-rose-100 px-7 py-4 shadow-md md:p-5">
                                        <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-rose-500">
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path 
                                                d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z" 
                                                fill="#ffffff" 
                                                stroke="#ffffff"
                                                />
                                            </svg>
                                        </div>

                                        <div className="w-full">
                                            <h5 className="text-left text-rose-800 text-opacity-80 font-medium">{error}</h5>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </section>
        </>
    );
}

export default FormLogin;