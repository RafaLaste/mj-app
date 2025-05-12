import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import format from "date-fns/format";

import CityMembersChart from "./CityMembersChart";

registerLocale("pt-BR", ptBR);

const CityMembers = React.memo(({ cities, states }) => {
    const [loading, setLoading] = useState(true);
    const [participantes, setParticipantes] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [error, setError] = useState(null);
    const [graphLoading, setGraphLoading] = useState(true);

    const menuListRef = useRef(null);

    const accessToken = localStorage.getItem("access_token");
    const baseUrl = process.env.REACT_APP_API_URL;

    const formatDateForBackend = (date) =>
        date ? format(date, "MM-dd-yyyy") : null;

    const fetchData = async () => {
        try {
            setGraphLoading(true);

            const params = new URLSearchParams();

            if (selectedStates.length)
                params.append(
                    "estado",
                    selectedStates.map((e) => e.value)
                );
            if (selectedCities.length)
                params.append(
                    "cidade",
                    selectedCities.map((c) => c.value)
                );
            if (startDate)
                params.append("data_inicio", formatDateForBackend(startDate));
            if (endDate)
                params.append("data_fim", formatDateForBackend(endDate));

            const response = await fetch(
                `${baseUrl}/manager/relatorios/participantes/?${params}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar os dados de participantes.");
            }

            const data = await response.json();
            setParticipantes(data.participantes);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setGraphLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const exportToExcel = async () => {
        try {
            const params = new URLSearchParams();

            if (selectedStates.length)
                params.append(
                    "estado",
                    selectedStates.map((e) => e.value)
                );
            if (selectedCities.length)
                params.append(
                    "cidade",
                    selectedCities.map((c) => c.value)
                );
            if (startDate)
                params.append("data_inicio", formatDateForBackend(startDate));
            if (endDate)
                params.append("data_fim", formatDateForBackend(endDate));

            const response = await fetch(
                `${baseUrl}/manager/relatorios/participantes/export?${params}`,
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
            a.download = "Participantes - Marcus James.xlsx";
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
                    Novos cadastros
                </h3>

                <div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-4 w-full">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estados
                                </label>
                                <Select
                                    options={states.map((e) => ({
                                        value: e.id,
                                        label: e.estado,
                                    }))}
                                    isMulti
                                    placeholder="Selecione o(s) Estado(s)"
                                    onChange={setSelectedStates}
                                    className="w-full min-w-40 max-w-[34vw] text-sm"
                                    classNamePrefix="select"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cidades
                                </label>
                                    <Select
                                        options={cities.map((c) => ({
                                            value: c.id,
                                            label: c.nome,
                                        }))}
                                        isMulti
                                        placeholder="Selecione a(s) Cidade(s)"
                                        className="w-full min-w-40 max-w-[34vw] text-sm"
                                        classNamePrefix="select"
                                        onChange={setSelectedCities}
                                    />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Período Cadastro
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
                                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={fetchData}
                                className="w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                                title="Filtrar"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

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
                <div className="p-4">
                    {participantes && !loading ? (
                        <div className={`${graphLoading ? "opacity-50" : ""}`}>
                            <CityMembersChart data={participantes} />
                        </div>
                    ) : (
                        <div className="mx-auto my-20 w-fit" role="status">
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 text-gray-200 animate-spin fill-primary"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});

export default CityMembers;
