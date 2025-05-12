import * as S from "./Cadastro/styles";

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import FormNewPassword from '../Components/FormNewPassword';

function App() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [error, setError] = useState(null);

    const baseUrl = process.env.REACT_APP_API_URL;

    const fetchToken = async () => {
        try {
            const response = await fetch(`${baseUrl}/participante/senha/verificar-token/${token}`, {
                method: 'GET',
            });

            const data = await response.json();
            console.log('data', data)
            if (!response.ok) {
                navigate('/promocao/participantes/login', {
                    state: { message: { type: 'error', text: 'Este link expirou ou já foi utilizado. Solicite a alteração de senha novamente.', show: false} },
                });
                return;
            }

            if (!data.token) {
                navigate('/promocao/participantes/login', {
                    state: { message: { type: 'error', text: 'Este link expirou ou já foi utilizado. Solicite a alteração de senha novamente.', show: false } },
                });
            }

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchToken();
    }, []);

    return (
        <S.Container>
            <FormNewPassword />
        </S.Container>
    );
}

export default App;