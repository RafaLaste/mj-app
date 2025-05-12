import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AdminLayout from '../../Layouts/AdminLayout';

import BlockContent from '../../Components/Manager/BlockContent';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const accessToken = localStorage.getItem("access_token");
    const baseUrl = process.env.REACT_APP_API_URL;
    
    const fetchContent = async () => {
        try {
            const response = await fetch(`${baseUrl}/manager/produtos/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data.produtos || []);
            } else {
                console.error("Erro ao buscar os produtos.");
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

    const contentProducts = {
        nome: ['Produtos', 'produto'],
        route: 'produtos',
        imagens: true,
        editavel: true,
        conteudo: products,
        destino: '/manager/produtos/'
    };

    return (
        <AdminLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-4 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <div className="col-span-12">
                        <BlockContent content={contentProducts} loading={loading} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default App;