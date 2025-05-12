import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NotificationMessage } from './NotificationMessage';

export const ConfirmModal = ({ closeModal, type, confirm, icon, confirmCancelChange, destiny = null }) => {
    const [notification, setNotification] = useState({
        type: 'info',
        message: '',
        show: false,
    });

    const navigate = useNavigate();

    const accessToken = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const messages = {
        logOut: {
            title: 'Log Out?',
            call: 'Tem certeza que deseja sair?',
            message: 'Pressione [Não] se quiser continuar o trabalho. Pressione [Sim] para sair do usuário atual.',
            success: 'Logout concluído',
            error: 'Não foi possível efetuar o logout',
            method: 'POST'
        },
        delete: {
            title: 'Excluir?',
            call: 'Tem certeza que deseja excluir?',
            message: 'Pressione [Não] se quiser continuar o trabalho. Pressione [Sim] para confirmar a exclusão.',
            success: 'Usuário excluído com sucesso',
            error: 'Não foi possível excluir o registro',
            method: 'DELETE'
        },
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${baseUrl + confirm}`, {
                method: messages[type]['method'],
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                if (destiny) {
                    navigate(`/promocao/${destiny}`, { state: { message: { type: 'alert', text: 'Registro excluído com sucesso!' } } }, { replace: true });
                }
            }

            closeModal();
        } catch (error) {
            console.log(error)
            setNotification({
                type: 'alert',
                message: messages[type]['error'],
                show: true,
            });

            console.error('Erro na requisição:', error);
        }
    };

    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, show: false }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] sort-ignore">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
            <div className="animate-fade-in-down [animation-duration:_0.1s] rounded-sm border border-stroke bg-white max-w-xl px-8 py-12 text-center shadow-md relative">
                <FontAwesomeIcon icon={icon} className={`text-2xl text-red-500 bg-red-100 py-4 rounded-full mb-6${icon.iconName == 'xmark' ? ' px-5' : ' px-4'}`} />
                <h2 className="text-2xl font-bold mb-2">{messages[type]['title']}</h2>
                <p className="text-slate-500 mb-10">{messages[type]['call']}<br />
                    {messages[type]['message']}
                </p>
                <div className="mx-auto flex gap-x-6 max-w-96">
                    <div className="w-full">
                        <button
                            className="w-full bg-gray-100 border border-slate-200 text-secondary py-2 px-4 rounded mr-2 hover:bg-gray-200"
                            onClick={closeModal}
                        >
                            Não
                        </button>
                    </div>

                    <div className="w-full">
                        <button
                            className="block w-full bg-red-500 border border-red-500 text-white py-2 px-4 rounded mr-2 hover:bg-red-600"
                            onClick={handleSubmit}
                        >
                            Sim
                        </button>
                    </div>
                </div>
            </div>

            {notification && notification.show && (
                <NotificationMessage
                    type={notification.type}
                    message={notification.message}
                    show={notification.show}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};
