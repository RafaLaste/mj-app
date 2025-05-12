import { useEffect, useState } from 'react';
import { useToken } from './TokenContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, type }) => {
    const { isAuthenticated, checkToken } = useToken();
    const [fadeOut, setFadeOut] = useState(false);
    const storedUserType = localStorage.getItem('user_type');

    useEffect(() => {
        if (isAuthenticated === null) {
            checkToken();
        }
    }, [isAuthenticated, checkToken]);

    useEffect(() => {
        const timer = setTimeout(() => setFadeOut(true), 600);
        return () => clearTimeout(timer);
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className={`fixed left-0 top-0 z-[999999] flex h-screen w-screen items-center justify-center bg-white transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (isAuthenticated) {

        if (type === 'administrador' && storedUserType === 'participante') {
            return <Navigate to="/promocao" replace />;
        }

        if (type === 'participante' && storedUserType === 'administrador') {
            return <Navigate to="/promocao/manager" replace />;
        }

        return <>{element}</>;
    }

    return <Navigate to={`${type === 'administrador' ? '/promocao/manager/login' : '/promocao'}`} replace />;
};

export default ProtectedRoute;
