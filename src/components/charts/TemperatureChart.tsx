import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Temperature, Location } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TemperatureChartProps {
  temperatures: Temperature[];
  locations: Location[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ temperatures, locations }) => {
  const sortedTemperatures = [...temperatures].sort((a, b) => {
    const dateA = new Date(`${a.data}T${a.horario}`);
    const dateB = new Date(`${b.data}T${b.horario}`);
    return dateA.getTime() - dateB.getTime();
  });

  const data = {
    labels: sortedTemperatures.map(temp => {
      const date = new Date(`${temp.data}T${temp.horario}`);
      return date.toLocaleDateString('pt-BR') + ' ' + temp.horario;
    }),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: sortedTemperatures.map(temp => temp.temperatura),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Variação de Temperatura'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Temperatura (°C)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Data e Hora'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default TemperatureChart;