import { useNavigate } from 'react-router-dom';
import { PromoSection } from '../../Components/PromoSection'
import * as S from "./styles";
import { Steps } from '../../Components/Steps';
import { useToken } from '../../Components/TokenContext';
import { CountdownTimer } from '../../Components/CountdownTimer';
import { Premios } from '../../Components/Premios';
import { FormRegister } from '../../Components/FormRegister';
import '../../default.css'
import { useEffect } from 'react';
function Home() {
    const { tokenData } = useToken();
    const navigate = useNavigate();
    const storedUserType = localStorage.getItem('user_type');

    useEffect(() => {
        if (storedUserType === 'administrador' && window.location.pathname === '/promocao') {
            navigate('/promocao/manager', { replace: true });
        }
    }, [navigate, storedUserType]);

    return (
        <S.Container>
            <PromoSection />
            <Steps tokenData={tokenData} />
            <CountdownTimer deadline="2025-08-31T23:59:59" />
            <Premios />
            {!tokenData && (
                <FormRegister />
            )}
        </S.Container>
    );
}

export default Home;