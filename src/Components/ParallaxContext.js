import React, { createContext, useContext, useState, useEffect } from 'react';
const ParallaxContext = createContext();

export const ParallaxProvider = ({ children }) => {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [rect, setRect] = useState({ width: 0, height: 0 });


    useEffect(() => {
        const updateRect = () => {
            const bodyRect = document.body.getBoundingClientRect();
            setRect({ width: bodyRect.width, height: bodyRect.height });
        };

        updateRect();
        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect);

        return () => {
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const rectBody = document.body.getBoundingClientRect();
            setMouse({
                x: e.clientX - rectBody.left,
                y: e.clientY - rectBody.top,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        let animationFrameId;

        const tick = () => {
            if (window.innerWidth > 1180) {
                parallaxIt(".moveImg", -30);
                parallaxIt(".moveImg2", 10);
            }
            animationFrameId = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [mouse, rect]);

    const parallaxIt = (selector, movement) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            const x = ((mouse.x - rect.width / 2) / rect.width) * movement;
            const y = ((mouse.y - rect.height / 2) / rect.height) * movement;

            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    };

    return (
        <ParallaxContext.Provider value={{}}>
            {children}
        </ParallaxContext.Provider>
    );
};

export const useToken = () => useContext(ParallaxContext);
