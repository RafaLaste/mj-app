import React, { createContext, useContext, useRef } from 'react';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
    const contatoRef = useRef(null);

    const scrollToContato = () => {
        if (contatoRef.current) {
            contatoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <ScrollContext.Provider value={{ contatoRef, scrollToContato }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => {
    return useContext(ScrollContext);
};
