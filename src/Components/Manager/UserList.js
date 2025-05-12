import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useToken } from '../TokenContext';

import { NotificationMessage } from './NotificationMessage';
import { UserItem } from './UserItem';

export const UserList = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const location = useLocation();
    const { tokenData } = useToken();
    const navigate = useNavigate();

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (location.state?.message) {
            setNotification(location.state.message);

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // useEffect(() => {
    //     if (tokenData.data.type === 'normal') {
    //         navigate('/');
    //     }
    // }, [navigate, tokenData]);

    const accessToken = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_URL;

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${baseUrl}/manager/usuarios`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar os usuários.');
            }

            const data = await response.json();
            setUsers(data.usuarios);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return (
        <div className="mx-auto py-10">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );

    if (error) {
        return <div className="text-2xl text-center text-red-600 font-bold my-10">{error}</div>;
    }

    return (
        <>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="p-2 pl-0 2xl:pl-4 text-left text-sm font-medium uppercase">Nome</th>
                        <th className="p-2 text-left 2xl:p-4 text-sm font-medium uppercase">E-mail</th>
                        <th className="p-2 text-left 2xl:p-4 text-sm font-medium uppercase">Criado</th>
                        <th className="p-2 text-left 2xl:p-4 text-sm font-medium uppercase"></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <UserItem
                            key={index}
                            user={user}
                            isSelected={false}
                            isLast={index === users.length - 1}
                        />
                    ))}
                </tbody>
            </table>

            {notification && (
                <NotificationMessage
                    type={notification.type}
                    message={notification.text}
                    show={true}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    );
};
