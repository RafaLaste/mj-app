import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as S from "./styles";
import { Link as ScrollLink } from 'react-scroll';

export const CountdownTimer = ({ deadline }) => {
    const calculateTimeLeft = () => {
        const difference = new Date(deadline) - new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <S.Container>
            <section className="timeleft">
                <img src={`/promocao/assets/img/mala.png`} alt="Mala" className="mala moveImg" />
                <img src={`/promocao/assets/img/nuvem2.png`} alt="Nuvem" className="nuvem2" />

                <div className="timeleftContent">
                    <h1>A promoção termina em:</h1>
                    <div className="timeJs" data-aos="fade-down">
                        <div className="timeJsSingle timeD">
                            <div className="timeSquare">{timeLeft.days}</div>
                            <p>Dias</p>
                        </div>
                        <div className="timeJsSingle timeH">
                            <div className="timeSquare">{timeLeft.hours}</div>
                            <p>Horas</p>
                        </div>
                        <div className="timeJsSingle timeM">
                            <div className="timeSquare">{timeLeft.minutes}</div>
                            <p>Minutos</p>
                        </div>
                        <div className="timeJsSingle timeS">
                            <div className="timeSquare">{timeLeft.seconds}</div>
                            <p>Segundos</p>
                        </div>
                    </div>
                    <p className="textCenter">Não perca tempo!</p>
                    <ScrollLink
                        to="cadastro"
                        style={{ cursor: 'pointer' }}
                        className="btnDefaultBlue"
                        smooth={true}
                        duration={500}
                        offset={300}
                    >
                        Cadastre-se para participar
                    </ScrollLink>
                </div>
            </section>
        </S.Container>
    );
};