import { useState, useEffect } from "react";
import * as S from "./styelsLayout";
import { Footer } from "../Components/Footer";
import { Link, useLocation } from "react-router-dom";
import { NotificationMessage } from "../Components/Manager/NotificationMessage";

function AuthLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [notification, setNotification] = useState(null);
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(false);
    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setLoading(false), 300);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (location.state?.message && location.state?.message.show == true) {
            setNotification(location.state.message);

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <S.Container>
            <header className="headerAuth">
                <div className={`headerContentAuth ${showNavbar && "active"}`}>
                    <nav>
                        <ul className="adjustHeaderAuth">
                            <div className="left">
                                <li onClick={handleShowNavbar}>
                                    <Link to="/promocao/manager/login">Login</Link>
                                </li>
                            </div>
                            <div className="centerImg">
                                <li className="adJustLeft">
                                    <Link to="/promocao" className="logoArea">
                                        <img className="logo" src={`/promocao/assets/img/logo.svg`} />
                                    </Link>
                                </li>
                            </div>
                            <div className="right">
                                <li onClick={handleShowNavbar} className="adJustLeft center">
                                    <Link to="/participantes/cadastro">Cadastro</Link>
                                </li>
                            </div>
                        </ul>
                    </nav>
                </div>
                <div className="responsiveHeader">
                    <div className="responsiveHeaderContent">
                        <Link to="/promocao" className="logoArea">
                            <img className="logo" src={`/promocao/assets/img/logo.svg`} />
                        </Link>
                        <S.Icon className={`menu-icon ${showNavbar && "active"}`} active={showNavbar} onClick={handleShowNavbar}>
                            <span></span>
                        </S.Icon>
                    </div>
                </div>

            </header>
            <div className="central">
                <img src={`/promocao/assets/img/lettering.svg`} />
            </div>
            {loading ? (
                <div className={`fixed left-0 top-0 z-[999999] flex h-screen w-screen items-center justify-center bg-white transition-opacity duration-300 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
            ) : (
                <>
                    {children}
                    <Footer />
                </>
            )}

            {notification && (
                <NotificationMessage
                    type={notification.type}
                    message={notification.text}
                    show={true}
                    onClose={() => setNotification(null)}
                />
            )}
        </S.Container>
    );
}

export default AuthLayout;