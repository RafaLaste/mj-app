import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faShoppingCart, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarStroke } from "@fortawesome/free-regular-svg-icons";

import RegisterChart from './RegisterChart';
import NumbersChart from './NumbersChart';
import CitiesChart from './CitiesChart';

const HomeStats = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [registrations, setRegistrations] = useState({});
    const [luckyNumbers, setLuckyNumbers] = useState({});
    const [topNumbers, setTopNumbers] = useState({});
    const [topCities, setTopCities] = useState({});
    
    const accessToken = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_URL;

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${baseUrl}/manager/stats`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                   setError('Erro ao buscar os dados do prêmio.');
                }

                const data = await response.json();
                setStats(data.stats);
                setRegistrations(data.cadastros);
                setLuckyNumbers(data.numerosSorte);
                setTopNumbers(data.topParticipantes);
                setTopCities(data.topCidades);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statsBox = [
        {
            title: "Usuários",
            value: stats.participantesTotal,
            icon: faUsers,
            color: "text-blue-500",
        },
        {
            title: "Compras cadastradas",
            value: stats.comprasTotal,
            icon: faShoppingCart,
            color: "text-green-500",
        },
        {
            title: "Números da sorte gerados",
            value: stats.numerosGerados,
            icon: faStar,
            color: "text-yellow-500",
        },
        {
            title: "Números da sorte restantes",
            value: stats.numerosRestantes,
            icon: faStarStroke,
            color: "text-purple-500",
        },
    ];

    if (loading) {
        return (
            <div className="mx-auto my-20 w-fit" role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {statsBox.map((stat, index) => (
                <div
                    key={index}
                    className="flex items-center px-4 py-8 bg-white shadow rounded-sm border border-stroke"
                >
                    <div className={`p-3 bg-gray-100 rounded-full ${stat.color}`}>
                        <FontAwesomeIcon icon={stat.icon} className="w-6 h-6" />
                    </div>

                    <div className="ml-4">
                        <p className="text-lg font-semibold">{stat.value}</p>
                        <p className="text-gray-500">{stat.title}</p>
                    </div>
                </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow xl:pb-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-black">Novos cadastros</h3>
                    </div>

                    <div className="mt-10 pb-4">
                        {registrations && Object.entries(registrations) && !loading ? (
                            <RegisterChart data={registrations} />
                        ) : (
                            <div className="mx-auto my-20 w-fit" role="status">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow xl:pb-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-black">Quantidade de números da sorte</h3>
                    </div>

                    <div className="mt-10 pb-4">
                        {luckyNumbers && Object.entries(luckyNumbers) && !loading ? (
                            <NumbersChart data={luckyNumbers} />
                        ) : (
                            <div className="mx-auto my-20 w-fit" role="status">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow xl:pb-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-black">Top números da sorte</h3>
                    </div>

                    <div className="mt-6 overflow-y-auto max-h-[369px]">
                        <div className="flex flex-col">
                            <div className="grid grid-cols-3 rounded-sm bg-gray-2 sm:grid-cols-5">
                                <div className="p-2.5 xl:p-4 col-span-2">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">Nome</h5>
                                </div>
                                
                                <div className="hidden sm:block p-2.5 text-center xl:p-4 col-span-2">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">Cidade</h5>
                                </div>

                                <div className="p-2.5 text-center xl:p-4">
                                    <h5 className="text-sm font-medium uppercase xsm:text-base">Qtd.</h5>
                                </div>
                            </div>

                            {topNumbers.map((item, index) => (
                                <div key={index} className={`grid grid-cols-3 sm:grid-cols-5${topNumbers.length === index + 1 ? '' : ' border-b border-stroke'}`}>
                                    <div className="p-2.5 xl:p-4 col-span-2">
                                        <p className="hidden font-medium text-black sm:block">{item.nome}</p>
                                    </div>      

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-4 col-span-2">
                                        <p className="font-medium text-black">{item.cidade}</p>
                                    </div>

                                    <div className="items-center justify-center p-2.5 xl:p-4">
                                        <p className="font-medium flex justify-center text-meta-5">{item.quantidade}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow sm:px-7.5 xl:pb-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-black">Top cidades</h3>
                    </div>

                    <div className="mt-10 pb-4">
                        {topCities && Object.entries(topCities) && !loading ? (
                            <div className="max-w-80 mx-auto pb-5">
                                <CitiesChart data={topCities} />
                            </div>
                        ) : (
                            <div className="mx-auto my-20 w-fit" role="status">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeStats;