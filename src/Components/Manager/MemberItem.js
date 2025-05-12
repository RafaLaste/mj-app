import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ConfirmModal } from './ConfirmModal';

function MemberItem({ row, onSelect, isSelected }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const member = row.original;
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleCheckboxChange = () => onSelect(member.id);

    const { key, ...rowProps } = row.getRowProps();

    const step = {
        etapa1: { label: 'Primeira Etapa', color: 'bg-gray-500' },
        etapa2: { label: 'Segunda Etapa', color: 'bg-gray-500' },
        concluido: { label: 'Concluído', color: 'bg-green-500' },
    };

    return (
        <tr {...rowProps} className="border-b border-stroke">
            <td className="text-left xl:p-4 text-sm font-medium">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                />
            </td>
            <td className="p-2 2xl:p-4 xl:pl-0 text-left font-medium uppercase">{member.nome}</td>
            <td className="p-2 2xl:p-4 text-sm text-black font-medium leading-tight max-w-80">{member.cpf}</td>
            <td className="p-2 2xl:p-4 xl:pl-0 text-left text-xs 2xl:text-sm font-medium">{member.data_cadastro}</td>
            <td className="p-2 2xl:p-4 text-sm text-black font-medium leading-tight max-w-80">
                <span className={`w-10 ${step[member.etapa_cadastro].color} text-white px-3 py-1`}>{step[member.etapa_cadastro].label}</span>
            </td>
            <td className="p-2 pr-0 text-left 1xl:p-4 xl:pr-0 text-xs 1xl:text-sm">
                <div className="flex items-center gap-2">
                    <Link to={`/promocao/manager/participantes/visualizar/${member.id}`} className="bg-primary w-8 h-8 rounded-full flex items-center justify-center duration-200 ease-in-out hover:bg-opacity-80" title="Visualizar">
                        <FontAwesomeIcon icon={faEye} className="text-white ml-[1px] mb-[1px]" />
                    </Link>

                    <button onClick={openModal} className="bg-red-700 w-8 h-8 pr-0.5 rounded-full flex items-center justify-center duration-200 ease-in-out hover:bg-opacity-80">
                        <FontAwesomeIcon icon={faTrash} className="text-white ml-[1px] mb-[1px]" />
                    </button>
                </div>

                {isModalOpen && <ConfirmModal icon={faTrash} closeModal={closeModal} type="delete" confirm={`/manager/participantes/excluir/${member.id}`} destiny={`/manager/participantes`} />}
            </td>
        </tr>
    );
}

export default MemberItem;
