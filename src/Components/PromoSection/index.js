import { Link } from "react-router-dom";
import * as S from "./styles";
import { Link as ScrollLink } from 'react-scroll';

export const PromoSection = () => {
    return (
        <S.Container>
            <section className="promo" style={{ backgroundImage: `url(${'/promocao/assets/img/fundo-home-1.jpg'})` }}>
                <ScrollLink
                    to="cadastro"
                    style={{ cursor: 'pointer' }}
                    className="btnDefaultOrange"
                    smooth={true}
                    duration={500}
                    offset={300}

                >
                    Quero participar
                </ScrollLink>
                <div className="promo__container">
                    <div className="promo__presentation">
                        <div className="promo__row">
                            <div className="promo__description">
                                <img
                                    src={`/promocao/assets/img/promocao2024.png`}
                                    alt="Promoção 2024"
                                    className="promo__logo"
                                />
                                <div className="textanim">
                                    <p className="promo__description-text"><span className="text">Porque toda boa história começa com uma boa escolha!</span></p>
                                    <h2><span className="text">5 viagens de</span></h2>
                                    <h1><span className="text">R$ 6.000,00<small>/cada</small></span></h1>
                                    <h5 className="and"><span className="text">+</span></h5>
                                    <h2><span className="text">20 vales-compras</span></h2>
                                    <h1><span className="text">R$ 500,00<small>/cada</small></span></h1>
                                    {/* <p id="como-participar" className="buyWine"><span className="text">Compre um vinho <span className="spanBlue">Reservado Marcus James</span> <strong>e concorra!</strong></span></p> */}
                                    <p className="buyWine"><span className="text">a promoção foi <span className="spanBlue"><strong>encerrada!</strong></span></span></p>
                                    <img
                                        src={`/promocao/assets/img/mala-home2.png`}
                                        alt="Mala Home"
                                        className="malaHome"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </S.Container>
    );
};