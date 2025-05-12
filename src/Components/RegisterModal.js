import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterModal({setShowPopup}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[99999]">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPopup(false)}></div>
            <div className="animate-fade-in-down [animation-duration:_0.1s] rounded-lg border border-stroke bg-white w-full max-w-xl px-8 py-10 text-left shadow-md relative">
                <h3 className="text-3xl text-secondary text-center font-bold">Finalize seu cadastro!</h3>
                <h5 className="text-sm text-black text-center mt-5 mb-10">Para garantir a sua participação na promoção, você precisa informar mais alguns dados. É rapidinho, clique logo abaixo e finalize!</h5>
                <Link to="/promocao/cadastro/finalizar" className="block w-fit bg-primary text-lg text-white py-3 px-6 rounded-md mx-auto hover:bg-tertiary">Finalizar cadastro</Link>
            </div>
        </div>
    );
}

export default RegisterModal;