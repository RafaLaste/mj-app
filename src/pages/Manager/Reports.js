import React, { useState } from 'react';

import Select from "react-select";

import AdminLayout from '../../Layouts/AdminLayout';

import ReportsList from '../../Components/Manager/ReportsList';

const App = () => {
    const chartOptions = [
        {value: 'membersDay', label: 'Participantes por dia'},
        {value: 'membersCity', label: 'Participantes por cidade'},
        {value: 'purchasesDay', label: 'Compras por dia'},
        {value: 'purchasesCity', label: 'Compras por cidade'},
        {value: 'drawData', label: 'Dados para sorteio'},
    ]

    const [chart, setChart] = useState(chartOptions[0]);

    const handleChange = (selectedOption) => {
        setChart(selectedOption);
    };

    return (
        <AdminLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-4 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <div className="col-span-12">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-2xl font-bold">Relatórios</h2>

                            <div className="flex items-center gap-3">
                                <h4 className="text-md text-gray-600 font-bold">Tipo de relatório:</h4>
                                <Select
                                    options={chartOptions}
                                    value={chart}
                                    placeholder="Selecione o gráfico"
                                    className="min-w-80"
                                    classNamePrefix="select"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        
                        <ReportsList current={chart.value} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default App;