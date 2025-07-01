import { useEffect } from "react";
import { Link } from "react-router-dom";
import * as S from "./styles";

export const Premios = () => {

    return (
        <S.Container>
            <section className="premios" id="premio">
                <img src={`/promocao/assets/img/oculos.png`} alt="Óculos" className="oculos moveImg" />
                <h1 data-aos="flip-up">Prêmios</h1>
                <p>
                    Prêmios incríveis esperam por você!<br />Quanto mais vinhos você comprar, mais chances tem de ganhar.

                </p>
                <div className="premiosContent">
                    <div className="premiosContentSingle">
                        <img src={`/promocao/assets/img/viagens.png`} alt="Viagens" />
                        <div className="moreIcon"></div>
                        <h1>
                            5 viagens
                            <br />
                            dos sonhos
                        </h1>
                        <p>Concorra a um voucher de viagem<br />no valor de R$ 6.000,00</p>
                    </div>
                    <div className="premiosContentSingle">
                        <img src={`/promocao/assets/img/ticket.png`} alt="Garrafa" />
                        <h1>
                            R$ 10.000,00
                            <br /> em vinhos
                        </h1>
                        <p>São 20 vales-compra para uso<br />na loja virtual da Vinícola Aurora</p>
                    </div>
                </div>
            </section>
        </S.Container>
    );
};