import { useNavigate } from 'react-router-dom';
import * as S from "./styles";
import { useToken } from '../../Components/TokenContext';
import { useState } from 'react';
function Ganhadores() {
    const navigate = useNavigate();
    const { tokenData } = useToken();

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const sorteios = [
        {
            titulo: '1º sorteio',
            data: [
                { data: '04/06/2025', numero: '98543', nome: 'Carlos Alberto Taborda' },
                { data: '04/06/2025', numero: '98398', nome: 'Janaina' },
                { data: '04/06/2025', numero: '98494', nome: 'Jessyca Chrystian' },
                { data: '04/06/2025', numero: '98537', nome: 'Thainara Vieira da Silva' },
                { data: '04/06/2025', numero: '98499', nome: 'Alexandre Machado' },
            ]
        },
        {
            titulo: '2º sorteio',
            data: [
                { data: '04/07/2025', numero: '52447', nome: 'Ruth Maria Motta' },
                { data: '04/07/2025', numero: '52448', nome: 'Salvador De Toni' },
                { data: '04/07/2025', numero: '52472', nome: 'Edina Maria Lipke' },
                { data: '04/07/2025', numero: '52481', nome: 'Daniela Martins da Silva' },
                { data: '04/07/2025', numero: '52482', nome: 'Márcia Cristina Morais' },
            ]
        }
        // {
        //     titulo: '3º sorteio',
        //     data: [
        //         { data: '24/08/2024', numero: '7869', nome: 'Jaimir Antonio Benvenutti' },
        //         { data: '24/08/2024', numero: '7873', nome: 'Rosmari Hochmuller Fogaça' },
        //         { data: '24/08/2024', numero: '7874', nome: 'Fabio Rogerio Felipe' },
        //         { data: '24/08/2024', numero: '7875', nome: 'Edenir Loureiro' },
        //         { data: '24/08/2024', numero: '7876', nome: 'Douglas Cezimbra Severo Rossini Brum' },
        //         { data: '24/08/2024', numero: '7880', nome: 'Silvana Borges Coareli' },
        //         { data: '24/08/2024', numero: '7881', nome: 'Seidi Ueta' },
        //         { data: '24/08/2024', numero: '7883', nome: 'Hanniel Menezes Marques' },
        //         { data: '24/08/2024', numero: '7885', nome: 'Marcos Pimentel Dandolini' },
        //         { data: '24/08/2024', numero: '7887', nome: 'Luzia Borges dos Santos' },
        //     ]
        // },
        // {
        //     titulo: '4º sorteio',
        //     data: [
        //         { data: '13/09/2024', numero: '81655', nome: 'Natalia Felix Oliveira' },
        //         { data: '13/09/2024', numero: '81669', nome: 'Silvina Figueiredo Porto' },
        //         { data: '13/09/2024', numero: '81691', nome: 'Mirella Panizzi' },
        //         { data: '13/09/2024', numero: '81704', nome: 'Larissa Massruhá Silva' },
        //         { data: '13/09/2024', numero: '81712', nome: 'Shirley Lobo' },
        //     ]
        // },
    ];

    return (
        <S.Container>
            <section className="doubts py-1 ajustGanhadores">
                <img src={`/promocao/assets/img/nuvemg.png`} className="nuvemG" alt="nuvem" />
                <img src={`/promocao/assets/img/nuvem.png`} className="nuvemG2" alt="nuvem" />
                <img src={`/promocao/assets/img/oculos.png`} className="oculosG moveImg" alt="oculos" />

                <div className="content content--xx-large">
                    <h1 data-aos="flip-up" data-aos-duration="900">Ganhadores</h1>
                    <p>Tem gente que está na maior vibração!</p>
                </div>

                <div className="contentTable ganhadoresTable">
                    <img src={`/promocao/assets/img/aviao-contato.png`} className="aviaoG moveImg" alt="aviao" />

                    <div className="accordion plane-stamp">
                        {sorteios.map((sorteio, index) => (
                            <div
                                className={`accordion__item backgroundGanhadores ${
                                    activeIndex === index ? 'accordion__item--active' : ''
                                }`}
                                key={index}
                            >
                                <button
                                    className="accordion__title-btn secondary-font"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    toggleAccordion(index);
                                  }}
                                >
                                    {sorteio.titulo}
                                    <span className="accordion__indicator"></span>
                                </button>

                                <div className={`accordion__content ${activeIndex === index ? 'open' : ''}`}>
                                    <table style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Nº sorte</th>
                                                <th>Nome</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sorteio.data.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.data}</td>
                                                    <td>{item.numero}</td>
                                                    <td>{item.nome}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </S.Container>
    );
}

export default Ganhadores;