import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as S from "./styles";

export function Footer() {

    return (
        <S.Footer>
            <footer className="footer">
                <div className="footerContent">
                    <div className="footer__containment">
                        <Link to="/promocao">
                            <img
                                src={`/promocao/assets/img/logo_w.png`}
                                alt="De malas prontas com Marcus James"
                                className="footer__containment-logo"
                            />
                        </Link>
                    </div>
                    <ul className="ulFooter">
                        <li><Link to="/promocao/regulamento" className="menu__link">Regulamentos</Link></li>
                        <li><Link to="/promocao/duvidas" className="menu__link">Dúvidas</Link></li>
                        <li><Link to="/promocao/fale-conosco" className="menu__link">Fale conosco</Link></li>
                        <li><Link to="/promocao/politica-privacidade" className="menu__link">Aviso de privacidade</Link></li>
                    </ul>
                    <p>
                        Período de participação de 01/05/2025 a 31/08/2025. Consulte formas de
                        participação e datas dos sorteios no Regulamento. Imagens
                        ilustrativas. Certificados de Autorização SPA/ME Nº 04.040676/2025
                    </p>
                    <div className="midias">
                        <p>Nossas mídias</p>
                        <div className="midiasContent">
                            <a href="https://www.instagram.com/marcusjamesoficial/" target="_blank" rel="noopener noreferrer">
                                <img src={`/promocao/assets/img/insta.png`} alt="Instagram" />
                            </a>
                            <a href="https://www.instagram.com/marcusjamesoficial/" target="_blank" rel="noopener noreferrer">
                                <img src={`/promocao/assets/img/face.png`} alt="Facebook" />
                            </a>
                        </div>
                    </div>
                    <div className="linksPolicy">
                        <Link to="/promocao/politica-privacidade">Política de privacidade</Link>
                    </div>
                    <p className="direitos">© {new Date().getFullYear()} Marcus James | Todos os direitos reservados.</p>
                </div>
                <div className="desenvolvido">
                    <p>Desenvolvido por:</p>
                    <a href="https://8poroito.com.br/" target="_blank" rel="noopener noreferrer">
                        <img src={`/promocao/assets/img/8poroito.png`} alt="8poroito" className="logo8" />
                    </a>
                </div>
            </footer>
        </S.Footer>
    );
}
