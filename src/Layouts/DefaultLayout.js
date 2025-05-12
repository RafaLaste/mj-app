import { useState, useEffect } from "react";
import * as S from "./styelsLayout";
import { Footer } from "../Components/Footer";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { NotificationMessage } from "../Components/Manager/NotificationMessage";
import { useToken } from "../Components/TokenContext";
import { Header } from "../Components/Header";
import AOS from "aos";
import "aos/dist/aos.css";

function DefaultLayout({ children }) {
    const [notification, setNotification] = useState(null);
    const location = useLocation();
    const { tokenData } = useToken();

    useEffect(() => {
        AOS.init({ duration: 900, once: true });
    }, []);

    useEffect(() => {
        if (location.state?.message) {
            setNotification(location.state.message);

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <S.Container>
            <Header setNotification={setNotification} />
            {children}
            {notification && (
                <NotificationMessage
                    type={notification.type}
                    message={notification.text}
                    show={true}
                    onClose={() => setNotification(null)}
                />
            )}
            <Footer />
        </S.Container>
    );
}

export default DefaultLayout;