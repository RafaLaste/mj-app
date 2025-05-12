import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import format from "date-fns/format";

registerLocale("pt-BR", ptBR);

const DrawData = React.memo(() => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [error, setError] = useState(null);

    const accessToken = localStorage.getItem("access_token");
    const baseUrl = process.env.REACT_APP_API_URL;

    const formatDateForBackend = (date) =>
        date ? format(date, "MM-dd-yyyy") : null;

    const exportToExcel = async () => {
        try {
            const params = new URLSearchParams();

            if (startDate)
                params.append("data_inicio", formatDateForBackend(startDate));
            if (endDate)
                params.append("data_fim", formatDateForBackend(endDate));

            const response = await fetch(
                `${baseUrl}/manager/relatorios/dados-sorteio/export?${params}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao exportar arquivo");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "Dados para Sorteio - Marcus James.xlsx";
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Erro ao baixar o arquivo:", error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">
                    Dados para sorteio
                </h3>

                <div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-4 w-full">
                            <div className="w-60 [&_.react-datepicker-wrapper]:w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Período
                                </label>
                                <DatePicker
                                    selectsRange
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => setDateRange(update)}
                                    isClearable
                                    locale="pt-BR"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Selecione um período"
                                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded w-full"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={exportToExcel}
                                className="w-12 h-12 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                                title="Exportar Excel"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pb-4">
                <div className="py-4">
                    Sem visualização disponível
                </div>
            </div>
        </>
    );
});

export default DrawData;
