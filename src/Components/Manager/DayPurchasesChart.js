import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CityPurchasesChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.data),
        datasets: [
            {
                label: "Quantidade de Compras",
                data: data.map(item => item.total),
                backgroundColor: [
                    '#FFD700ab',
                    '#FF6384ab',
                    '#9966FFab',
                    '#36A2EBab',
                    '#FFCE56ab',
                    '#4BC0C0ab',
                    '#FF9F40ab',
                    '#FF6347ab',
                    '#32CD32ab',
                    '#8A2BE2ab'
                ],
                borderColor:  [
                    '#FFD700',
                    '#FF6384',
                    '#9966FF',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#FF9F40',
                    '#FF6347',
                    '#32CD32',
                    '#8A2BE2'
                ],
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Compras por Dia" },
            datalabels: { display: false }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default CityPurchasesChart;
