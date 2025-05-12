import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DayMembersChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.data),
        datasets: [
            {
                label: "Quantidade de Cadastros",
                data: data.map(item => item.total),
                backgroundColor: [
                    '#FF6384ab',
                    '#36A2EBab',
                    '#FFCE56ab',
                    '#4BC0C0ab',
                    '#9966FFab',
                    '#FF9F40ab',
                    '#FF6347ab',
                    '#32CD32ab',
                    '#FFD700ab',
                    '#8A2BE2ab'
                ],
                borderColor:  [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6347',
                    '#32CD32',
                    '#FFD700',
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
            title: { display: true, text: "Cadastros por Dia" },
            datalabels: { display: false }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default DayMembersChart;
