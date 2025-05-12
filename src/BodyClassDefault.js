import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BodyClassDefault = () => {
    const location = useLocation();

    useEffect(() => {
        if (!document.body) return;

        const elements = document.querySelectorAll("body, h1, h2, h3, h4, h5, h6, main, a, ul, section");

        if (!location.pathname.startsWith("/promocao/manager")) {
            elements.forEach(el => el.classList.add("default"));
        } else {
            elements.forEach(el => el.classList.remove("default"));
        }

        return () => {
            elements.forEach(el => el.classList.remove("default"));
        };
    }, [location.pathname]);

    return null;
};

export default BodyClassDefault;
