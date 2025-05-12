import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from "./styles";
import { useToken } from '../../Components/TokenContext';

function Duvidas() {
    const [loading, setLoading] = useState(true);
    const [doubts, setDoubts] = useState([]);

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${baseUrl}/duvidas`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDoubts(data.duvidas);
                } else {
                    console.error("Erro ao buscar as dúvidas.");
                }
            } catch (error) {
                console.error("Erro na requisição", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <S.Container>
            <section className="doubts py-1">
                <img src={`/promocao/assets/img/nuvemd.png`} className="nuvemD" alt="Nuvem D" />
                <img src={`/promocao/assets/img/nuvem.png`} className="nuvemD2" alt="Nuvem D2" />

                <div className="content content--xx-large">
                    <h1 data-aos="flip-up" data-aos-duration="900">Dúvidas</h1>
                </div>

                <div className="content content--x-small">
                    <div className="accordion doubt-stamp">
                        {loading ? (
                            <div className="mx-auto py-20 flex justify-center">
                                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-t-transparent" />
                            </div>
                        ) : (
                            doubts.map((value, index) => {
                                const isActive = activeIndex === index;

                                return (
                                    <div className={`accordion__item backgroundDuvidas ${isActive ? 'accordion__item--active' : ''}`} key={index}>
                                        <button
                                            className="accordion__title-btn"
                                            onClick={() => toggleAccordion(index)}
                                            dangerouslySetInnerHTML={{ __html: `${value.pergunta} <span class="accordion__indicator"></span>` }}
                                        />
                                        <div className={`accordion__content ${activeIndex === index ? 'open' : ''}`} dangerouslySetInnerHTML={{ __html: value.resposta }} />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>
        </S.Container>
    );
}

export default Duvidas;