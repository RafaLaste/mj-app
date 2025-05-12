import { useState, useEffect } from 'react';

import * as S from "./styles";

const Regulamento = () => {
    const [loading, setLoading] = useState(true);
    const [rules, setRules] = useState(null);

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${baseUrl}/promocao/data`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRules(data.promocao.regulamento || []);
                } else {
                    console.error("Erro ao buscar o regulamento.");
                }
            } catch (error) {
                console.error("Erro na requisição", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <S.Container>
            <section className="regulation py-1">
                <img src={`/promocao/assets/img/nuvemr.png`} className="nuvemR" alt="Nuvem 1" />
                <img src={`/promocao/assets/img/nuvem-total.png`} className="nuvemR2" alt="Nuvem 2" />
                <img src={`/promocao/assets/img/nuvem-total.png`} className="nuvemR3" alt="Nuvem 3" />
                <img src={`/promocao/assets/img/nuvemr2.png`} className="nuvemR4" alt="Nuvem 4" />
                <img src={`/promocao/assets/img/nuvemr3.png`} className="nuvemR5" alt="Nuvem 5" />

                <div className="content content--xx-large">
                    <h1 data-aos="flip-up" data-aos-duration="900">Regulamento</h1>
                </div>

                <div className="contentRegulation pt-1">
                    <div className="regulation__container rules-stamp">

                        {loading ? (
                            <div className="mx-auto py-20 flex justify-center">
                                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-t-transparent" />
                            </div>
                        ) : (
                            <div className="regulation__content" dangerouslySetInnerHTML={{ __html: rules }} />
                        )}
                    </div>
                </div>
            </section>
        </S.Container>
    );
}

export default Regulamento;