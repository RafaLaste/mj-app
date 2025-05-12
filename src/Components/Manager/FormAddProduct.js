import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faImage, faVideo, faFile } from '@fortawesome/free-solid-svg-icons';

import { useToken } from '../TokenContext';
import { InputFileImage } from './InputFileImage';

const FormAddProduct = () => {
    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState({
        nome: '',
        img: '',
    });

    const [productErrorData, setProductErrorData] = useState({
        nome: [],
        img: [],
    });

    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    const { tokenData } = useToken();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const baseUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageCrop = (croppedImage, fileExtenstion, name) => {
        setProductData(prevData => ({
            ...prevData,
            [name]: croppedImage == '' ? null : croppedImage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const formData = new FormData();
        
            Object.keys(productData).forEach(key => {
                if (key !== 'img') {
                    if (typeof productData[key] === 'boolean') {
                        formData.append(key, productData[key] ? 1 : 0);
                    } else {
                        formData.append(key, productData[key]);
                    }
                }
            });

            if (productData.img) {
                formData.append('img', productData.img);
            }

            const response = await fetch(`${baseUrl}/manager/produtos/novo/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData
            });
            if (response.ok) {
                setFormLoading(false);
                navigate('/promocao/manager/produtos', {
                    state: {
                        message: { type: 'success', text: 'Produto adicionado com sucesso!' },
                    },
                });
            } else {
                if (response.status === 422) {
                    const errors = await response.json();
                    setFormLoading(false);
                    setProductErrorData(errors);
                }
            }
        } catch (error) {
            setFormLoading(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        setLoading(false);
    }, []);
    
    if (loading) return (
        <div className="mx-auto py-20 flex justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );

    return (
        <>
            <Link to="/manager/produtos" className="bg-slate-100 px-4 py-1.5 rounded border border-slate-300 float-right ml-2 transition-all hover:bg-slate-200">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Voltar
            </Link>

            <h4 className="mb-6 text-xl font-bold text-black">
                Adicionar produto
            </h4>

            <div className="flex flex-col">
                <form onSubmit={handleSubmit} className="max-w-5xl pb-10">
                    
                    <div className="mb-6 2xl:mb-10">
                        <div className="mb-3 flex gap-5 flex-col lg:flex-row">
                            <div className="w-full lg:w-3/4">
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={productData.nome}
                                    onClick={() => setProductErrorData(prevData => ({...prevData, nome: []}))}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 2xl:py-2 border border-gray-300 rounded-md outline-none focus:border-secondary focus-visible:shadow-none"
                                    
                                />
                                {productErrorData.nome && productErrorData.nome[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{productErrorData.nome[0]} <span onClick={() => setProductErrorData(prevData => ({...prevData, nome: []}))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
                            </div>
                        </div>
                        
                        <div className="mb-3 flex gap-5 flex-col lg:flex-row">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium">Imagem</label>

                                <InputFileImage 
                                    name="img"
                                    imagem={`/assets/img/admin/image-select.png`} 
                                    size={{ largura: '1000', altura: '1000' }} 
                                    allowCrop={false}
                                    onImageCrop={handleImageCrop}
                                />
                                {productErrorData.img && productErrorData.img[0] && (<span className="flex justify-between border-b border-red-500 text-xs 2xl:text-sm text-red-500 tracking-tight 2xl:tracking-normal mt-1 pb-1 pl-2">{productErrorData.img[0]} <span onClick={() => setProductErrorData(prevData => ({...prevData, img: []}))} className="rotate-45 -my-2 p-2 cursor-pointer">+</span></span>)}
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

export default FormAddProduct;