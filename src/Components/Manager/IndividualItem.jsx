import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

import { ConfirmModal } from './ConfirmModal';

const IndividualItem = ({ individualContent, route, index, edit, caminhoAlt = null, confirmDestiny = null }) => {
    const [isChecked, setIsChecked] = useState(individualContent.visivel || false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cellWidths, setCellWidths] = useState([]);
    const rowRef = useRef(null);

    const accessToken = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const adjustCellWidths = () => {
            if (rowRef.current) {
                const widths = Array.from(rowRef.current.children).map(cell => cell.offsetWidth);
                setCellWidths(widths);
            }
        };

        adjustCellWidths();
        window.addEventListener('resize', adjustCellWidths);

        return () => {
            window.removeEventListener('resize', adjustCellWidths);
        };
    }, []);

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

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        setIsChecked(individualContent.visivel);
    }, [individualContent?.visivel])

    return (
        <tr ref={rowRef} className="bg-slate-50">
            <td className="border px-4 w-1/6 py-4" width={`${cellWidths[0] || 'auto'}`}>{index + 1}</td>
            <td className="border px-4 py-4" width={`${cellWidths[1] || 'auto'}`}>{individualContent.titulo || individualContent.nome}</td>
            <td className="border px-4 py-4 w-1/6" width={`${cellWidths[2] || 'auto'}`}>
                {edit ? (
                    <label className="cursor-pointer sort-ignore">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            className="sr-only peer"
                            disabled={loading}
                        />
                        <div className={`relative w-9 h-5 ${loading ? 'opacity-50' : ''} bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600`}></div>
                    </label>
                ) : (
                    individualContent.data
                )}
            </td>
            <td className="border max-sm:text-center px-2 md:px-4 py-2 w-1/6 sort-ignore" width={`${cellWidths[3] || 'auto'}`}>
                {edit ? (
                    <Link to={`/promocao/manager/${route}/editar/${individualContent.id}`} className="h-5 w-5 relative mr-2 md:mr-4 z-[1]">
                        <FontAwesomeIcon icon={faEdit} className="text-slate-700" />
                    </Link>
                ) : (
                    <Link to={`/promocao/manager/${route}/visualizar/${individualContent.id}`} className="h-5 w-5 relative mr-2 md:mr-4 z-[1]">
                        <FontAwesomeIcon icon={faEye} className="text-slate-700" />
                    </Link>
                )}
                <button
                    className="h-5 w-5 relative z-[1]"
                    onClick={openModal}
                    disabled={loading}
                >
                    <FontAwesomeIcon icon={faTrash} className="text-red-700" />
                </button>

                {isModalOpen && (
                    <ConfirmModal
                        icon={faTrash}
                        closeModal={closeModal}
                        type="delete"
                        confirm={`/promocao/manager/${caminhoAlt ? (caminhoAlt + '/' + route) : route}/excluir/${individualContent.id}`}
                        destiny={confirmDestiny}
                    />
                )}
            </td>
        </tr>
    );
};

export default IndividualItem;