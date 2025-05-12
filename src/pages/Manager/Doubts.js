import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AdminLayout from '../../Layouts/AdminLayout';

import BlockContent from '../../Components/Manager/BlockContent';

function App() {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const accessToken = localStorage.getItem("access_token");
    const baseUrl = process.env.REACT_APP_API_URL;
    
    const fetchContent = async () => {
        try {
            const response = await fetch(`${baseUrl}/manager/duvidas/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDoubts(data.duvidas || []);
            } else {
                console.error("Erro ao buscar os duvidas.");
            }

        } catch (error) {
            console.error("Erro na requisição", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.message) {
            fetchContent();
        }
    }, [location.state]);

    useEffect(() => {
        fetchContent();
    }, []);

    const contentDoubts = {
        nome: ['Dúvidas', 'dúvida'],
        route: 'duvidas',
        imagens: false,
        editavel: true,
        conteudo: doubts,
        destino: '/promocao/manager/duvidas/'
    };

    return (
        <AdminLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-4 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <div className="col-span-12">
                        <BlockContent content={contentDoubts} loading={loading} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default App;