import { useNavigate } from 'react-router-dom';
import * as S from "./styles";
import { useToken } from '../../Components/TokenContext';
import { FormRegisterEtapa3 } from '../../Components/FormRegisterEtapa3';
import { useEffect, useState } from 'react';
function TerceiraEtapa() {
    const { tokenData } = useToken();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        const typeUser = localStorage.getItem("user_type");

        if (tokenData?.participante?.etapa_cadastro === "concluido") {
            navigate('/promocao/compras', {
                state: {
                    message: { type: 'success', text: 'Cadastro finalizado, agora você pode utilizar o sistema!' },
                },
            });
            return;
        }

        setIsLoading(false);
    }, [navigate, tokenData?.participante?.etapa_cadastro]);

    if (isLoading) {
        return null;
    }

    return (
        <S.Container>
            <FormRegisterEtapa3 />
        </S.Container>
    );
}

export default TerceiraEtapa;