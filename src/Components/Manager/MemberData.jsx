import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from 'react-table';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const MemberData = () => {
    const [member, setMember] = useState({});
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        numeros_sorte: ''
    });

    const [resultsPerPage, setResultsPerPage] = useState(20);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    
    const accessToken = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_URL;
    
    const updateUrlParams = (newFilters) => {
        const filteredParams = Object.fromEntries(
            Object.entries(newFilters).filter(([_, value]) => value !== '' && value !== null)
        );

        const params = new URLSearchParams(filteredParams).toString();
        navigate(`?${params}`);
    };

    const fetchData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');

            const [participantResponse, purchasesResponse] = await Promise.all([
                fetch(`${baseUrl}/manager/participantes/${id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                }),
                fetch(`${baseUrl}/manager/participantes/compras/${id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                })
            ]);

            if (!participantResponse.ok || !purchasesResponse.ok) {
                throw new Error('Erro ao buscar os dados do participante ou compras.');
            }

            const [participantData, purchasesData] = await Promise.all([
                participantResponse.json(),
                purchasesResponse.json()
            ]);

            setMember(participantData.participante);
            setPurchases(purchasesData.compras);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        for (const param of searchParams) {
            setFilters(prev => ({
                ...prev,
                [param[0]]: param[1]
            }));
        }

        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log(filters)
        const updatedFilters = {
            ...filters,
            [name]: value,
        };
        setFilters(updatedFilters);
        updateUrlParams(updatedFilters);
    };

    const filteredPurchases = useMemo(() => {
        return purchases.filter(purchase => {
            const cleanNumerosSorte = purchase.numeros_sorte.replace(/[./]/g, "");
            const cleanFilter = filters.numeros_sorte.replace(/[./]/g, "");

            const matchesNumerosSorte = cleanNumerosSorte.includes(cleanFilter);

            return matchesNumerosSorte;
        });
    }, [purchases, filters]);

    const columns = useMemo(() => [
        { 
            Header: "#", 
            id: "index",
            headerClassName: "px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider",
            Cell: ({ row }) => row.index + 1
        },
        { Header: 'Número(s) da Sorte', accessor: 'numeros_sorte', headerClassName: 'px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider' },
        { Header: 'Valor', accessor: 'valor', headerClassName: 'px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider' },
        { Header: 'CNPJ', accessor: 'cnpj', headerClassName: 'px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider' },
        {
            Header: 'Produtos',
            accessor: 'produtos',
            headerClassName: 'px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider',
            Cell: ({ value }) => (
                <span dangerouslySetInnerHTML={{ __html: value }} />
            ),
        },
        { Header: 'Qtde', accessor: 'quantidade', headerClassName: 'px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider' },
        { Header: 'Cadastrado em', accessor: 'data', headerClassName: 'px-2 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider' },
        {
            Header: "",
            accessor: 'acoes',
            Cell: ({ row }) => {
                const fileId = row.original.id;

                const handleDownload = async () => {
                    const downloadUrl = `${baseUrl}/manager/participantes/visualizar-nf/${fileId}`;

                    try {
                        const response = await fetch(downloadUrl, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });

                        if (!response.ok) {
                            throw new Error('Erro ao baixar o arquivo');
                        }

                        const blob = await response.blob();
                        const contentDisposition = response.headers.get('Content-Disposition');
                        let filename = 'Cupom ' + row.original.cupom;

                        if (contentDisposition && contentDisposition.includes('filename=')) {
                            filename = contentDisposition
                                .split('filename=')[1]
                                .split(';')[0]
                                .replace(/"/g, '')
                                .trim();
                        }

                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                    } catch (error) {
                        console.error('Erro no download:', error);
                    }
                };

                return (
                    <button
                        onClick={handleDownload}
                        className="text-gray-400 hover:text-gray-700"
                        title="Baixar imagem"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-file-earmark-arrow-down"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                        </svg>
                    </button>
                );
            }
        }
    ], []);

    const pageParams = new URLSearchParams(window.location.search);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        state: { pageIndex },
        gotoPage,
        nextPage,
        previousPage,
    } = useTable(
        {
            columns,
            data: filteredPurchases,
            initialState: { pageIndex: pageParams.has('page') ? (pageParams.get('page') -1) : 0, pageSize: resultsPerPage },
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        if (pageIndex !== 0 || searchParams.has('page')) {
            searchParams.set('page', pageIndex + 1);
            navigate(`?${searchParams.toString()}`, { replace: true });
        }
    }, [pageIndex, navigate]);

    if (error) {
        return <div className="text-2xl text-center text-red-600 font-bold my-10">{error}</div>;
    }

    if (loading) return (
        <div className="mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
            <div className="bg-white mx-auto py-20 flex justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        </div>
    );

    return (
        <>
            <div className="mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
                <div className="flex items-center justify-between gap-4 min-w-[50rem] mb-6">
                    <h4 className="text-xl font-bold text-black">
                        Visualizar participante
                    </h4>

                    <Link to="/promocao/manager/participantes" className="bg-slate-100 px-4 py-1.5 rounded border border-slate-300 ml-2 transition-all hover:bg-slate-200">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Voltar
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-700 text-sm font-medium">Nome</p>
                        <p className="text-gray-600 text-sm">
                            {member.nome}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-700 text-sm font-medium">RG</p>
                        <p className="text-gray-600">{member.rg ?? '---'}</p>
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium">CPF</p>
                        <p className="text-gray-600">{member.cpf ?? '---'}</p>
                    </div>

                    <div>
                        <p className="text-gray-700 text-sm font-medium">
                            Logradouro
                        </p>
                        <p className="text-gray-600">{member.logradouro ?? '---'}</p>
                    </div>

                    <div>
                        <p className="text-gray-700 text-sm font-medium">
                            Número
                        </p>
                        <p className="text-gray-600">{member.numero ?? '---'}</p>
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium">
                            Bairro
                        </p>
                        <p className="text-gray-600">{member.bairro ?? '---'}</p>
                    </div>

                    <div>
                        <p className="text-gray-700 text-sm font-medium">
                            Cidade
                        </p>
                        <p className="text-gray-600">{member.cidade ?? '---'}</p>
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium">CEP</p>
                        <p className="text-gray-600">{member.cep ?? '---'}</p>
                    </div>

                    <div>
                        <p className="text-gray-700 text-sm font-medium">
                            Complemento
                        </p>
                        <p className="text-gray-600">{member.complemento ?? '---'}</p>
                    </div>
                    <div>
                        <p className="text-gray-700 text-sm font-medium">
                            Telefone
                        </p>
                        <p className="text-gray-600">{member.telefone ?? '---'}</p>
                    </div>

                    <div>
                        <p className="text-gray-700 text-sm font-medium">
                            E-mail
                        </p>
                        <p className="text-gray-600">{member.email ?? '---'}</p>
                    </div>
                </div>
            </div>

            <div className="mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
                <div className="flex items-center justify-between gap-4 min-w-[50rem] mb-6">
                    <h4 className="text-xl font-bold text-black">
                        Listagem de compras
                    </h4>

                    <input
                        type="text"
                        name="numeros_sorte"
                        placeholder="Número da sorte"
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.numeros_sorte}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                        <thead>
                            {headerGroups.map((headerGroup, index) => {
                                const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                                return (
                                    <tr key={key || index} {...headerGroupProps} className="bg-gray-50">
                                        {headerGroup.headers.map((column, groupIndex) => {
                                            const { key: colKey, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps({ title: undefined }));

                                            return (
                                                <th
                                                    key={colKey || groupIndex}
                                                    {...columnProps}
                                                    className={column.headerClassName}
                                                >
                                                    {column.render("Header")}
                                                    {column.isSorted ? (
                                                        column.isSortedDesc ? (
                                                            <svg className="fill-gray-500 inline-block mb-1 ml-1" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5 0L0 5H10L5 0Z" fill=""></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="fill-gray-500 inline-block mb-1 ml-1" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill=""></path>
                                                            </svg>
                                                        )
                                                    ) : ""}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </thead>

                        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                            {page.map((row, rowIndex) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {row.cells.map((cell) => {
                                            const { key, ...cellProps } = cell.getCellProps();
                                            
                                            return (
                                                <td key={cell.row.id + cell.column.id} {...cellProps} className={`px-2 py-4${cell.column.id !== 'numeros_sorte' ? ' whitespace-nowrap' : ''}${cell.column.id === 'produtos' ? ' [&_span]:block' : ''} text-sm`}>
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {pageOptions.length > 1 && (
                    <div className="flex items-center min-w-[50rem] mt-6 mb-4">
                        <nav className="pagination isolate inline-flex space-x-1" aria-label="Pagination">
                            <button 
                                onClick={() => previousPage()} 
                                disabled={!canPreviousPage} 
                                className={`relative inline-flex items-center justify-center rounded w-9 h-9 ring-1 ring-inset ring-gray-300 ${canPreviousPage ? 'hover:text-white hover:bg-secondary hover:ring-secondary text-secondary' : 'text-slate-400'}`}
                            >
                                <span className="sr-only">Anterior</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd"></path>
                                </svg>
                            </button>

                            {pageIndex !== 0 && (
                                <button 
                                    onClick={() => gotoPage(0)} 
                                    disabled={!canPreviousPage} 
                                    className={`relative inline-flex items-center justify-center font-medium rounded w-9 h-9 ring-1 ring-inset ring-gray-300 ${canPreviousPage ? 'hover:text-white hover:bg-secondary hover:ring-secondary text-secondary' : 'text-slate-400'}`}
                                >
                                    1
                                </button>
                            )}

                            {pageIndex > 1 && pageOptions.length > 4 && (
                                <span className="relative inline-flex items-center justify-center font-medium rounded w-9 h-9 text-secondary ring-1 ring-inset ring-gray-300">...</span>
                            )}

                            {pageOptions[pageIndex - 1] ? (
                                <button 
                                    onClick={() => gotoPage(pageIndex - 1)} 
                                    className="relative inline-flex items-center justify-center font-medium rounded w-9 h-9 text-secondary ring-1 ring-inset ring-gray-300"
                                >
                                    {pageIndex}
                                </button>
                            ) : null}


                            <span className="relative inline-flex items-center justify-center font-medium rounded w-9 h-9 text-white bg-secondary ring-1 ring-inset ring-secondary hover:bg-slate-700">
                                {pageIndex + 1}
                            </span>

                            {pageOptions[pageIndex + 1] && (
                                <button 
                                    onClick={() => gotoPage(pageIndex + 1)} 
                                    className="relative inline-flex items-center justify-center font-medium rounded w-9 h-9 text-secondary ring-1 ring-inset ring-gray-300"
                                >
                                    {pageIndex + 2}
                                </button>
                            )}

                            {pageIndex < pageOptions.length - 3 && (
                                <span className="relative inline-flex items-center justify-center font-medium rounded w-9 h-9 text-gray-400 ring-1 ring-inset ring-gray-300">...</span>
                            )}

                            {pageIndex < pageOptions.length - 2 && (
                                <button 
                                    onClick={() => gotoPage(pageOptions.length - 1)} 
                                    className="relative inline-flex items-center justify-center font-medium rounded w-9 h-9 text-secondary ring-1 ring-inset ring-gray-300"
                                >
                                    {pageOptions.length}
                                </button>
                            )}

                            <button 
                                onClick={() => nextPage()} 
                                disabled={!canNextPage} 
                                className={`relative inline-flex items-center justify-center rounded w-9 h-9 ring-1 ring-inset ring-gray-300 ${canNextPage ? 'hover:text-white hover:bg-secondary hover:ring-secondary text-secondary' : 'text-slate-400'}`}
                            >
                                <span className="sr-only">Próximo</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
};

export default MemberData;
