import { useNavigate } from 'react-router-dom';
import * as S from "./styles";
import { useToken } from '../../Components/TokenContext';
import { FormRegisterEtapa2 } from '../../Components/FormRegisterEtapa2';
import { useEffect, useState } from 'react';
function SegundaEtapa() {
    const { tokenData } = useToken();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        const typeUser = localStorage.getItem("user_type");

        if (!accessToken || typeUser !== "participante") {
            navigate("/promocao/", { replace: true });
            return;
        }

        if (tokenData?.participante?.etapa_cadastro === "etapa2") {
            navigate("/promocao/compras", { replace: true });
            return;
        }

        setIsLoading(false);
    }, [navigate, tokenData?.participante?.etapa_cadastro]);

    if (isLoading) {
        return null;
    }

    return (
        <S.Container>
            <FormRegisterEtapa2 />
        </S.Container>
    );
}

export default SegundaEtapa;