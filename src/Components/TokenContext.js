import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [tokenData, setTokenData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const baseUrl = process.env.REACT_APP_API_URL;
    const accessToken = localStorage.getItem('access_token');
    const userType = localStorage.getItem('user_type');
    const endpoint = userType === 'administrador' ? '/manager/usuario/' : '/compras/usuario/';

    const checkToken = async () => {
        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTokenData(data);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_type');
                localStorage.removeItem('user_id');
                setIsAuthenticated(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            checkToken();
        } else {
            setIsAuthenticated(false);
        }
    }, [accessToken]);

    const logOutUser = async () => {
        try {
            const response = await fetch(`${baseUrl}${endpoint}logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_type');
                localStorage.removeItem('user_id');
                setIsAuthenticated(false);
                <Navigate to='/promocao' replace />;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <TokenContext.Provider value={{ tokenData, isAuthenticated, checkToken, logOutUser, setIsAuthenticated }}>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => useContext(TokenContext);
