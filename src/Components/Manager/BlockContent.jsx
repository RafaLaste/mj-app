import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactSortable } from "react-sortablejs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import IndividualContent from './IndividualContent';
import IndividualItem from './IndividualItem';

const BlockContent = ({ content, loading, back = null, id = null }) => {
    const [state, setState] = useState([]);
    const [hasReordered, setHasReordered] = useState(false);
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();
    const accessToken = localStorage.getItem("access_token");
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        setState(content.conteudo);
    }, [content.conteudo])

    useEffect(() => {
        if (hasReordered) {
            setProcessing(true);

            const orderedData = state.map((item, index) => ({
                id: item.id,
                ordem: index,
            }));

            const updateOrder = async () => {
                try {
                    const response = await fetch(`${baseUrl}/manager/${content.caminhoAlt ? (content.caminhoAlt + '/' + content.route) : content.route}/ordenar`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ordem: orderedData }),
                    });

                    if (!response.ok) {
                        throw new Error("Erro ao atualizar a ordem.");
                    }

                        console.log(content)
                    if (content.destino) {
                        navigate(content.destino, { state: { message: { type: 'success', text: 'Registros ordenados com sucesso!' } } }, { replace: true });
                    }
                } catch (error) {
                    console.error("Erro ao atualizar ordem", error);
                } finally {
                    setHasReordered(false);
                    setProcessing(false);
                }
            };

            updateOrder();
        }
    }, [hasReordered]);

    if (loading) return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 xl:gap-10 opacity-20 mb-6 xl:mb-10">
            {[...Array(4)].map((_, index) => (
                <div
                    key={index}
                    role="status"
                    className="flex items-center justify-center h-0 pb-[90%] md:pb-[103%] max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            ))}
        </div>
    );
    
    return content.imagens ? (
        <div className="relative mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">{content.nome[0]}</h3>

                {back && (
                    <Link
                        to={back}
                        className="flex items-center border border-stroke bg-white px-3 py-2 rounded-md transition-all hover:bg-slate-100 ml-auto"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="text-slate-700 mr-2" />
                        Voltar
                    </Link>
                )}

                <Link
                    to={`/promocao/manager/${content.route}/adicionar${back && id ? '/' + id : ''}`}
                    className="flex items-center border border-stroke bg-white px-3 py-2 rounded-md transition-all hover:bg-slate-100 ml-2"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-slate-700 mr-2" />
                    {`Adicionar ${content.nome[1]}`}
                </Link>
            </div>

            <div className="mt-10">
                {content.editavel ? (
                    <ReactSortable
                        animation={150}
                        list={state}
                        setList={(newState) => {
                            if (JSON.stringify(newState) !== JSON.stringify(state)) {
                                setState(newState);
                                setHasReordered(true);
                            }
                        }}
                        filter=".sort-ignore"
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
                    >
                        {state.map((conteudo, index) => (
                            <div
                                key={index}
                                className="relative rounded-md border border-stroke p-4 shadow-sm select-none"
                            >
                                <IndividualContent
                                    individualContent={conteudo}
                                    route={content.route}
                                    caminhoAlt={content.caminhoAlt}
                                    imagensClass={content.imgClass}
                                    confirmDestiny={content.destino}
                                    index={index}
                                />
                            </div>
                        ))}
                    </ReactSortable>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                        {state.map((conteudo, index) => (
                            <div
                                key={index}
                                className="relative rounded-md border border-stroke p-4 shadow-sm"
                            >
                                <IndividualContent
                                    individualContent={conteudo}
                                    route={content.route}
                                    caminhoAlt={content.caminhoAlt}
                                    imagensClass={content.imgClass}
                                    confirmDestiny={content.destino}
                                    index={index}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {processing && (
                <div className="absolute inset-0 bg-white rounded-sm bg-opacity-50 flex items-center justify-center">
                    <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-solid border-secondary border-t-transparent"></div>
                </div>
            )}
        </div>
    ) : (
        <div className="mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">{content.nome[0]}</h3>
                {content.editavel && <Link to={`/promocao/manager/${content.route}/adicionar`} className="flex items-center border border-stroke bg-white px-3 py-2 rounded-md transition-all hover:bg-slate-100 ml-2">
                    <FontAwesomeIcon icon={faPlus} className="text-slate-700 mr-2" />
                    {`Adicionar ${content.nome[1]}`}
                </Link> }
            </div>

            <div className="mt-10 overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[30rem] border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-4 w-1/6 text-left">#</th>
                            <th className="border px-4 py-4 text-left">Valor</th>
                            <th className="border px-4 py-4 w-1/6 text-left">{content.editavel ? 'Visível' : 'Data' }</th>
                            <th className="border px-4 py-4 w-1/6 text-left">Ações</th>
                        </tr>
                    </thead>
                    {content.editavel ? (
                        <ReactSortable
                            animation={150}
                            list={state}
                            setList={(newState) => {
                                if (JSON.stringify(newState) !== JSON.stringify(state)) {
                                    setState(newState);
                                    setHasReordered(true);
                                }
                            }}
                            filter=".sort-ignore"
                            tag="tbody"
                        >
                            {state.map((conteudo, index) => (
                                <IndividualItem
                                    key={index}
                                    individualContent={conteudo}
                                    imagensPath={content.imagensPath}
                                    imagensClass={content.imgClass}
                                    route={content.route}
                                    confirmDestiny={content.destino}
                                    index={index}
                                    edit={content.editavel}
                                />
                            ))}
                        </ReactSortable>
                    ) : (
                        state.map((conteudo, index) => (
                            <IndividualItem 
                                key={index}
                                individualContent={conteudo}
                                imagensPath={content.imagensPath}
                                imagensClass={content.imgClass}
                                route={content.route}
                                confirmDestiny={content.destino}
                                index={index}
                                edit={content.editavel}
                            />
                        ))
                    )}
                </table>
            </div>
        </div>
    );
};

export default BlockContent;