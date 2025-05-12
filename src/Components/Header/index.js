import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as S from "./styles";
import { useNavigate, useLocation } from 'react-router-dom';
import { ScrollProvider, useScroll } from '../ScrollContext';

import FormPassword from '../FormPassword';
import { useToken } from '../TokenContext';

export function Header({ setNotification }) {
    const navigate = useNavigate();

    function handleOpenLogin() {
        setShowForm(!showForm);
    }

    const formRef = useRef(null);
    const buttonRef = useRef(null);

    const { tokenData } = useToken();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showForm, setShowForm] = useState(false);
    const accessToken = localStorage.getItem('access_token');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({
                top: 0,
            });
        }
    }, [pathname, hash]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToHash = (n = 0) => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }

        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                const offset = n;
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const adjustedPosition = elementPosition - offset;

                window.scrollTo({
                    top: adjustedPosition,
                    behavior: 'smooth',
                });
            }
        }
    };

    useEffect(() => {
        scrollToHash();
    }, [window.location.hash]);

    const handleScrollTo = (e, path, n = 0) => {
        e.preventDefault();
        navigate(`/promocao${path}`);
        setTimeout(() => {
            scrollToHash(n);
        }, 100);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                showForm &&
                formRef.current &&
                !formRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowForm(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showForm]);

    async function handleLogout() {
        try {
            const response = await fetch(`${baseUrl}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            const result = await response.json();

            if (!response.ok) {
                setNotification({
                    type: 'error',
                    message: 'Não é possível fazer logoff do usuário.',
                    show: true,
                });
                return;
            }

            localStorage.removeItem('user_id');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_type');
            
            window.location.href = "/promocao";

        } catch (error) {
            console.error(error.message);
        }

    }

    const openPasswordModal = () => {
        setShowForm(false)
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors('');

        if (!email || !senha) {
            setErrors('Por favor, preencha seu e-mail e senha.');
            setLoading(false);
            return;
        }

        const loginData = {
            email: email,
            password: senha,
        };

        try {
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.message || 'Usuário ou senha incorretos');
                setLoading(false);
                return;
            }

            const data = await response.json();

            localStorage.setItem('access_token', data.token);
            localStorage.setItem('user_id', data.usuario.id);
            localStorage.setItem('user_type', data.usuario.funcao);

            if (data.usuario.participante.etapa_cadastro == 'etapa1') {
                window.location.replace('/promocao/etapa-2');
            } else {
                window.location.replace('/promocao/compras');
            }

        } catch (e) {
            setErrors('Erro ao conectar com o servidor. Tente novamente.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <S.Header>
            <header>
                <div className="content content--xx-large">
                    <h1 className="menu__logo">
                        <Link to="/promocao">
                            <img src={`/promocao/assets/img/logo.png`} alt="De malas prontas com Marcus James" />
                        </Link>
                    </h1>

                    <div className={`menu${isMenuOpen ? ' menu__open' : ''}`}>
                        <nav className="menu__navigation">
                            <ul className="menu__items clearfix">
                                <li className="menu__item">
                                    <a href="/promocao#como-participar" onClick={(e) => handleScrollTo(e, '/#como-participar', 0)} className="menu__link">Como participar</a>
                                </li>
                                <li className="menu__item">
                                    <a href="/promocao#premio" onClick={(e) => handleScrollTo(e, '/#premio', 200)} className="menu__link">Prêmios</a>
                                </li>
                                <li className="menu__item">
                                    <Link to="/promocao/ganhadores" onClick={() => setIsMenuOpen(false)} className="menu__link">Ganhadores</Link>
                                </li>
                                <li className="menu__item">
                                    <Link to="/promocao/duvidas" onClick={() => setIsMenuOpen(false)} className="menu__link">Dúvidas</Link>
                                </li>
                                <li className="menu__item">
                                    <Link to="/promocao/regulamento" onClick={() => setIsMenuOpen(false)} className="menu__link">Regulamento</Link>
                                </li>
                            </ul>

                            <div className="menu__controls">
                                {tokenData ? (
                                    <ul className="menu__items menu__items--signin clearfix">
                                        <li className="menu__item menu__item--register btnParticipe">
                                            <Link to="/promocao/compras" className="menu__link menu__link--register">Compras</Link>
                                        </li>
                                        <li className="menu__item menu__item--register">
                                            <button onClick={handleLogout} className="menu__link menu__link--login menuSair">Sair</button>
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="menu__items menu__items--signin clearfix">
                                        <li className="menu__item menu__item--register btnParticipe">
                                            <a href="/promocao#cadastro" onClick={(e) => handleScrollTo(e, '/#cadastro', -300)} className="menu__link menu__link--register">Participe</a>
                                        </li>
                                        <li className="menu__item btnEntrar">
                                            <button ref={buttonRef} type="button" onClick={handleOpenLogin} className="menu__link  menu__link--login menuEntrar">
                                                <img src={`/promocao/assets/img/user.png`} alt="" />
                                                <span>Entrar</span>
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </nav>

                        {showForm && (
                            <div ref={formRef} className="formMenu animate-fade-in-down" style={{ animationDuration: '100ms' }}>
                                <h1>Acessar conta</h1>
                                <form onSubmit={handleSubmit} className="">
                                    <fieldset className="form__fieldset">
                                        <div className="form__row clearfix">
                                            <div className="form__control">
                                                <input type="text"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Seu e-mail" className="form__input" />
                                            </div>
                                        </div>
                                        <div className="form__row clearfix">
                                            <div className="form__control">
                                                <input
                                                    value={senha}
                                                    onChange={(e) => setSenha(e.target.value)}
                                                    type="password" placeholder="Sua senha" className="form__input" />
                                            </div>
                                        </div>
                                        <p className="recuperarSenha">
                                            <button type="button" onClick={openPasswordModal}>Esqueci minha senha</button>
                                        </p>
                                        {
                                            errors && (
                                                <div onClick={() => setErrors('')} className="cursor-pointer mt-6 mb-6">
                                                    <div className="flex items-center justify-center w-full border-l-4 border-rose-500 bg-rose-100 px-3 md:px-7 py-1.5 md:py-4 shadow-md md:p-5">
                                                        <div className="mr-1 md:mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-rose-500 max-md:scale-75 origin-left">
                                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                                                                    fill="#ffffff"
                                                                    stroke="#ffffff"
                                                                />
                                                            </svg>
                                                        </div>

                                                        <div className="w-full">
                                                            <h5 className="text-left max-sm:text-sm text-rose-800 text-opacity-80 text-base">{errors}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div className="form__row form__row--small clearfix">
                                            <div className="form__control form__control--submit">
                                                <button
                                                    className='form__submit button secondary-background'>
                                                    {!loading ? (
                                                        'Entrar'
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
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        )}
                    </div>

                    <button className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-[12]" onClick={toggleMenu}>
                        <div className="flex items-center">
                            <div className="relative w-6 h-[17px]">
                                <div
                                    className={`absolute top-0 bg-white h-[3px] w-6 transition-all duration-300 ${isMenuOpen ? 'rotate-45 !top-[8px]' : ''}`}
                                    style={{
                                        transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                        transitionProperty: 'top, transform'
                                    }}
                                ></div>
                                <div
                                    className={`absolute top-[7px] bg-white h-[3px] w-6 transition-all duration-300 ${isMenuOpen ? 'scale-x-0 !top-[8px]' : ''}`}
                                    style={{
                                        transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                        transitionProperty: 'top, transform'
                                    }}
                                ></div>
                                <div
                                    className={`absolute bottom-0 bg-white h-[3px] w-6 transition-all duration-300 ${isMenuOpen ? '-rotate-45 bottom-[6px]' : ''}`}
                                    style={{
                                        transitionDelay: isMenuOpen ? '0ms, 400ms' : '0ms',
                                        transitionProperty: 'bottom, transform'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </button>

                    {isPasswordModalOpen && <FormPassword closeModal={closePasswordModal} />}
                </div>
            </header>
        </S.Header>
    );
}
