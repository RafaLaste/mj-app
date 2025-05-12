import { Link } from "react-router-dom";
import * as S from "./styles";
import { Link as ScrollLink } from 'react-scroll';

export const Steps = ({ tokenData }) => {
    return (
        <S.Container>
            <section className="steps" id="como-participar">
                <img src={`/promocao/assets/img/nuvem.png`} alt="Nuvem" className="imgNuvem" />
                <img src={`/promocao/assets/img/aviao.png`} alt="Avião" className="imgAviao moveImg" />
                <div className="stepsContent">
                    <h1 data-aos="flip-up">Como participar</h1>
                    { /* <p className="textCenter">Sua participação em apenas 4 etapas:</p> */ }
                    <div className="stepByStep" data-aos="fade-up">
                        <div className="stepByStepSingle">
                            <p>
                                <span>
                                    <strong style={{ fontWeight: 900 }}>Compre 1 vinho</strong>
                                </span>{" "}
                                da linha <strong style={{ fontWeight: 900 }}>Reservado Marcus James</strong>
                            </p>
                        </div>
                        <div className="stepByStepSingle">
                            <p>
                                <span>
                                    <strong style={{ fontWeight: 900 }}>Faça seu</strong>
                                </span>{" "}
                                cadastro
                            </p>
                            <ScrollLink
                                to="cadastro"
                                style={{ cursor: 'pointer' }}
                                className="menu__link"
                                smooth={true}
                                duration={500}
                            >
                                Participar
                            </ScrollLink>
                        </div>
                        <div className="stepByStepSingle">
                            <p>
                                <span>
                                    <strong style={{ fontWeight: 900 }}>Registre suas</strong>
                                </span>{" "}
                                notas fiscais
                            </p>
                            {tokenData ? (
                                <Link to="/promocao/compras">Registrar</Link>
                            ) : (
                                <Link to="/promocao/login">Registrar</Link>
                            )}
                        </div>
                        <div className="stepByStepSingle">
                            <p>
                                <span>
                                    <strong style={{ fontWeight: 900 }}>Receba seus</strong>
                                </span>{" "}
                                números da sorte
                            </p>
                            <Link to="/promocao/regulamento">Regulamento</Link>
                        </div>
                    </div>
                </div>
            </section>
        </S.Container>
    );
};
