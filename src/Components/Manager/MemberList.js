import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useNavigate, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faBan, faPlus } from '@fortawesome/free-solid-svg-icons';

import MemberItem from './MemberItem';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [estados, setEstados] = useState([]);

    const [filters, setFilters] = useState({
        nome: ''
    });

    const [resultsPerPage, setResultsPerPage] = useState(20);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const accessToken = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_URL;

    const updateUrlParams = (newFilters) => {
        const filteredParams = Object.fromEntries(
            Object.entries(newFilters).filter(([_, value]) => value !== '' && value !== null)
        );

        const params = new URLSearchParams(filteredParams).toString();
        navigate(`?${params}`);
    };  

    const fetchMembers = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await fetch(`${baseUrl}/manager/participantes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar os participantes.');
            }

            const data = await response.json();
            
            setMembers(data.participantes);
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

        fetchMembers();
    }, []);

    useEffect(() => {
        if (location.state?.message) {
            fetchMembers();
        }
    }, [location.state]);

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedMembers(members.map(member => member.id));
        } else {
            setSelectedMembers([]);
        }
    };

    const isAllSelected = selectedMembers.length === members.length && members.length > 0;

    const handleSelectMember = (memberId) => {
        setSelectedMembers(prevSelected => 
            prevSelected.includes(memberId)
                ? prevSelected.filter(id => id !== memberId)
                : [...prevSelected, memberId]
        );
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = {
            ...filters,
            [name]: value,
        };
        setFilters(updatedFilters);
        updateUrlParams(updatedFilters);
    };

    const handleDeleteSelected = async () => {
        const idsString = selectedMembers.join(',');

        try {
            const response = await fetch(`${baseUrl}/manager/participantes/excluir/${idsString}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                navigate('/promocao/manager/participantes/', { state: { message: { type: 'error', text: 'Erro ao enviar o pedido ao sistema!' } } }, { replace: true });

                throw new Error('Erro ao excluir os itens.');
            }

            navigate('/promocao/manager/participantes/', { state: { message: { type: 'alert', text: 'Registros excluídos com sucesso!' } } }, { replace: true });

            setSelectedMembers([]);
            fetchMembers();
        } catch (error) {
            console.error('Erro ao excluir itens:', error);
        }
    };

    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const matchesnome = member.nome.toLowerCase().includes(filters.nome.toLowerCase());

            return matchesnome;
        });
    }, [members, filters]);

    const columns = useMemo(() => [
        {
            id: 'select',
            Header: ({ getToggleAllRowsSelectedProps }) => (
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
            ),
            Cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={selectedMembers.includes(row.original.id)}
                    onChange={() => handleSelectMember(row.original.id)}
                />
            ),
            headerClassName: 'p-4 w-2 text-left text-sm font-medium uppercase'
        },
        { Header: 'Nome', accessor: 'nome', headerClassName: 'p-2 text-left 2xl:p-4 text-sm font-medium uppercase select-none' },
        { Header: 'CPF', accessor: 'email', headerClassName: 'p-2 text-left 2xl:p-4 text-sm font-medium uppercase select-none' },
        { Header: 'Cadastrado em', accessor: 'cadastrado_em', headerClassName: 'p-2 text-left 2xl:p-4 text-sm font-medium uppercase select-none' },
        { Header: 'Etapa cadastro', accessor: 'etapa_cadastro', headerClassName: 'p-2 text-left 2xl:p-4 text-sm font-medium uppercase select-none' },
        { Header: 'Ações', accessor: '', headerClassName: 'p-2 text-left 2xl:p-4 text-sm font-medium uppercase select-none' },
    ], [isAllSelected, selectedMembers]);

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
            data: filteredMembers,
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

    return (
        <div className="overflow-x-auto no-scrollbar relative mb-6 rounded-sm border border-stroke bg-white px-5 py-5 shadow-md">
            {loading && (
                <div className="absolute z-[100] inset-0 bg-white mx-auto py-20 flex justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
            )}

            <div className="flex items-center justify-between gap-4 min-w-[50rem] mb-6">
                <h4 className="text-xl font-bold text-black">
                    Participantes
                </h4>

                <input 
                    type="text" 
                    name="nome"
                    placeholder="Nome" 
                    className="border border-gray-300 rounded-md w-64 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.nome}
                    onChange={handleFilterChange}
                />
            </div>

            <table {...getTableProps()} className="w-full min-w-[50rem] table-auto border-collapse bg-gray-2">
                <thead>
                    {headerGroups.map((headerGroup, index) => {
                        const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();

                        return (
                            <tr key={key || index} {...headerGroupProps}>
                                {headerGroup.headers.map((column, groupIndex) => {
                                    const { key: colKey, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps({ title: undefined }));

                                    return (
                                        <th
                                            key={colKey || groupIndex}
                                            {...columnProps}
                                            className={column.headerClassName}
                                        >
                                            {column.render('Header')}
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
                                            ) : ''}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody  {...getTableBodyProps()}>
                    {page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <MemberItem
                                key={row.id}
                                row={row}
                                onSelect={handleSelectMember}
                                isSelected={selectedMembers.includes(row.original.id)}
                            />
                        );
                    })}
                </tbody>
            </table>

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


                    <span className="relative inline-flex items-center justify-center font-medium rounded w-9 h-9 text-white bg-secondary ring-1 ring-inset ring-secondary hover:bg-opacity-80 hover:border-opacity-80">
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
        </div>
    );
}

export default MemberList;
