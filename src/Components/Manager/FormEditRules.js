import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { InputTipTapEditor } from './InputTipTapEditor';

const FormEditRules = () => {
    const [loading, setLoading] = useState(true);
    const [rulesData, setRulesData] = useState({
        regulamento: '',
    });

    const [rulesErrorData, setRulesErrorData] = useState({
        regulamento: [],
    });

    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRulesData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${baseUrl}/manager/data`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRulesData(data.promocao || []);
                } else {
                    console.error("Erro ao buscar o regulamento.");
                }
            } catch (error) {
                console.error("Erro na requisição", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await fetch(`${baseUrl}/manager/data/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(rulesData)
            });
            if (response.ok) {
                setFormLoading(false);
                navigate('/promocao/manager/regulamento', {
                    state: {
                        message: { type: 'success', text: 'Regulamento atualizado com sucesso!' },
                    },
                });
            } else {
                if (response.status === 422) {
                    const errors = await response.json();
                    setFormLoading(false);
                    setRulesErrorData(errors);
                    setError('Erro ao adicionar o usuário');
                }
            }
        } catch (error) {
            setFormLoading(false);
            setError(error.message);
        }
    };

    if (loading) return (
        <div className="mx-auto py-20 flex justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
        </div>
    );

    return (
        <>
            <h4 className="mb-6 text-xl font-bold text-black">
                Regulamento
            </h4>

            <div className="flex flex-col">
                <form onSubmit={handleSubmit} className="pb-10">
                    
                    <div className="mb-6 2xl:mb-10">
                        <div className="mb-3 flex gap-5 flex-col lg:flex-row">
                            <div className="w-full lg:w-3/4">
                                <label className="block text-sm font-medium mb-1">Regulamento</label>
                                <InputTipTapEditor
                                    name="regulamento"
                                    toolbar={[
                                        'Heading',
                                        'Bold',
                                        'Italic',
                                        'Underline',
                                        'Link',
                                        'List',
                                        'Table'
                                    ]}
                                    value={rulesData.regulamento}
                                    onChange={(name, content) => handleChange(name, content)}
                                />
                                {rulesErrorData.regulamento && rulesErrorData.regulamento[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{rulesErrorData.regulamento[0]} <span onClick={() => setRulesErrorData(prevData => ({...prevData, regulamento: []}))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full lg:w-3/4 bg-secondary text-white py-2 px-4 rounded-md hover:bg-opacity-80 disabled:bg-opacity-80 disabled:cursor-not-allowed"
                        
                    >
                        {!formLoading ? (
                            'Salvar'
                        ) : (
                            <div role="status" className="flex justify-center items-center">
                                <svg aria-hidden="true" className="w-6 h-6 text-white text-opacity-60 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}

export default FormEditRules;