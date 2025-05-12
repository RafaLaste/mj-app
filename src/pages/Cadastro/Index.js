import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as S from "./styles";
import FormRegister from '../../Components/FormRegister';
function Cadastro() {
    return (
        <S.Container>
            <div className='textCadastro'>
                <h3>Cadastro</h3>
                <p>
                    Preencha os campos abaixo com os respectivos dados solicitados.
                </p>
            </div>
            <FormRegister />
        </S.Container>
    );
}
export default Cadastro;