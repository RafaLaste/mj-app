import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faFile, faImage } from '@fortawesome/free-solid-svg-icons';

const FileDropzone = ({ name, value, label, onChangeFile, onDelete, disabled }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];

        if (file && isValidFileType(file)) {
            handleFile(file);
        }
    }, []);

    const isValidFileType = (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        return validTypes.includes(file.type);
    };

    const handleFile = (file) => {
        if (file && isValidFileType(file)) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
            onChangeFile(file);
        }
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleDelete = () => {
        setPreview(null);
        onDelete();
    };

    return (
        <div className="w-full">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative group form__input ${isDragging ? 'border-secondary bg-secondary bg-opacity-10' : 'border-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <span className="absolute left-4 right-4 top-1/2 -translate-y-1/2 text-sm" style={{color: '#8D8D8D'}}>{value ? value.name : 'Foto do cupom/NF de compra*'}</span>
                <span className="absolute top-0 right-0 bottom-0 bg-secondary rounded-r-lg text-white text-sm flex items-center px-3 md:px-6 transition-all group-hover:bg-primary">Carregar</span>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default FileDropzone;