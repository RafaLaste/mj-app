import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ConfirmModal } from './ConfirmModal';

const IndividualContent = ({ individualContent, imagensPath, imagensClass, route, caminhoAlt = null, confirmDestiny = null }) => {
    const [isChecked, setIsChecked] = useState(individualContent.visivel || false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const baseUrl = process.env.REACT_APP_API_URL;
    const accessToken = localStorage.getItem('access_token');

    const handleCheckboxChange = async () => {
        const newState = !isChecked;
        setLoading(true);

        try {
            setIsChecked(!isChecked);
            
            const response = await fetch(`${baseUrl}/manager/${caminhoAlt ? (caminhoAlt + '/' + route) : route}/visibilidade/${individualContent.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ visivel: newState }),
            });

            if (!response.ok) {
                throw new Error('Erro ao alterar visibilidade.');
            }

            const data = await response.json();
            if (data.success) {
                setIsChecked(newState);
            } else {
                console.error('Erro na resposta da API:', data.message);
            }
        } catch (error) {
            console.error('Erro ao alterar visibilidade:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        setIsChecked(individualContent.visivel);
    }, [individualContent?.visivel])

    return (
        <>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center">
                    <label className="cursor-pointer sort-ignore">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            disabled={loading}
                            className="sr-only peer"
                        />
                        <div className={`relative w-9 h-5 ${loading ? 'opacity-50' : ''} bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600`}></div>
                    </label>
                    <span className="max-lg:leading-tight font-medium text-gray-700 ml-2 xl:ml-3">
                        {individualContent.titulo || individualContent.nome}
                    </span>
                </div>
            </div>

            <div className="flex justify-center min-h-40 mb-6">
                <img
                    src={
                        individualContent.imagem
                            ? `${individualContent.imagem}`
                            : `${individualContent.preview}`
                    }
                    className={`p-4 max-h-100 max-w-[100%] object-contain border border-stroke ${imagensClass || ''}`}
                />
            </div>

            <div className="flex justify-end mb-4 sort-ignore">
                <Link
                    to={`/promocao/manager/${route}/editar/${individualContent.id}`}
                    className="h-5 w-5 relative mr-4 z-[1] before:content-[''] before:absolute before:-top-[7px] before:-left-[10px] before:w-9 before:h-9 before:bg-slate-100 before:rounded-full before:-mt-[-2px] before:-z-[1] before:transition-all before:transform before:scale-0 hover:before:scale-100"
                >
                    <FontAwesomeIcon icon={faEdit} className="text-slate-700" />
                </Link>

                <button
                    className="h-5 w-5 relative z-[1] before:content-[''] before:absolute before:-top-[7px] before:-left-[8px] before:w-9 before:h-9 before:bg-slate-100 before:rounded-full before:-mt-[-2px] before:-z-[1] before:transition-all before:transform before:scale-0 hover:before:scale-100"
                    onClick={openModal}
                >
                    <FontAwesomeIcon icon={faTrash} className="text-red-700" />
                </button>
            </div>

            {isModalOpen && (
                <ConfirmModal
                    icon={faTrash}
                    closeModal={closeModal}
                    type="delete"
                    confirm={`/promocao/manager/${caminhoAlt ? (caminhoAlt + '/' + route) : route}/excluir/${individualContent.id}`}
                    destiny={confirmDestiny}
                />
            )}
        </>
    );
};

export default IndividualContent;