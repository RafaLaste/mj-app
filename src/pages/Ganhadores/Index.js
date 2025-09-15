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
        },
        {
            titulo: '3º sorteio',
            data: [
                { data: '08/08/2025', numero: '52447', nome: 'Keila Carlile Anziliero Pacheco' },
                { data: '08/08/2025', numero: '52448', nome: 'Marco Tramasoli' },
                { data: '08/08/2025', numero: '52472', nome: 'Antônio Francisco Dias Filho' },
                { data: '08/08/2025', numero: '52481', nome: 'Sonia Maria Zerbetto Chagas' },
                { data: '08/08/2025', numero: '52482', nome: 'Sheila Belz' },
            ]
        },
        {
            titulo: '4º sorteio',
            data: [
                { data: '31/08/2025', numero: '58185', nome: 'Carla Pereira dos Santos' },
                { data: '31/08/2025', numero: '58192', nome: 'Guilherme de Camillis' },
                { data: '31/08/2025', numero: '58193', nome: 'Juliana Rodrigues Sandeski' },
                { data: '31/08/2025', numero: '58194', nome: 'Bryan Ker' },
                { data: '31/08/2025', numero: '58203', nome: 'Sandoval Fraga Rodrigues' },
                { data: '31/08/2025', numero: '58212', nome: 'Janaina Nunes de Farias' },
                { data: '31/08/2025', numero: '58228', nome: 'Miriam Almeida' },
                { data: '31/08/2025', numero: '58236', nome: 'Roberto Rafael Zorzi' },
                { data: '31/08/2025', numero: '58237', nome: 'Vanderson Xavier' },
            ]
        },
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