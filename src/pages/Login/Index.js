import * as S from "../Cadastro/styles";

import FormLogin from '../../Components/FormLogin';
import { useState } from "react";
import FormPassword from "../../Components/FormPassword";

function App() {
    const [formData, setFormData] = useState({
        email: "",
        senha: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dados enviados:", formData);
    };

    function handleOpenLogin() {
        setShowForm(!showForm);
    }

    const openPasswordModal = () => {
        setShowForm(false)
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };


    return (
        <S.Container>
            <section className="login pt-1 pb-2">
                <div className="content content--xx-large over-stamp">
                    <h1 data-aos="flip-up" data-aos-duration="900">Acessar conta</h1>
                </div>

                <img src={`/promocao/assets/img/nuvemd.png`} alt="Nuvem pequena" className="nuvemD" />
                <img src={`/promocao/assets/img/nuvemg.png`} alt="Nuvem grande" className="nuvemG" />

                <div className="content content--x-small">
                    <div className="form login-stamp">
                        <img
                            src={`/promocao/assets/img/aviao-contato.png`}
                            alt="Avião"
                            className="aviaoLogin moveImg"
                        />
                        <img
                            src={`/promocao/assets/img/taca.png`}
                            alt="Taça"
                            className="tacaLogin moveImg"
                        />
                        <img
                            src={`/promocao/assets/img/mala.png`}
                            alt="Mala"
                            className="malaLogin moveImg"
                        />

                        <form id="ContatoForm" className="form--async-login" onSubmit={handleSubmit} noValidate>
                            <fieldset className="form__fieldset">
                                <div className="form__row clearfix">
                                    <div className="form__control">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="E-mail"
                                            className="form__input"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form__row clearfix">
                                    <div className="form__control">
                                        <input
                                            type="password"
                                            name="senha"
                                            placeholder="Senha"
                                            className="form__input"
                                            value={formData.senha}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <p className="recuperarSenha">
                                    <button onClick={openPasswordModal}>Esqueci minha senha</button>
                                </p>
                                <div className="form__row form__row--small clearfix">
                                    <div className="form__control form__control--submit">
                                        <button type="submit" className="form__submit button secondary-background">
                                            Entrar
                                        </button>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </section>

            {isPasswordModalOpen && <FormPassword closeModal={closePasswordModal} />}
        </S.Container>
    );
}

export default App;