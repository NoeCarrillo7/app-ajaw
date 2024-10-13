import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement
);

// Función que obtiene los últimos 12 meses
const getUltimos12Meses = () => {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const hoy = new Date();  // Obtener la fecha actual
    let mesActual = hoy.getMonth();  // Obtener el mes actual
    let ultimos12Meses = [];  // Array para almacenar los últimos 12 meses

    // Itera para obtener los últimos 12 meses
    for (let i = 0; i < 12; i++) {
        ultimos12Meses.unshift(meses[mesActual]);  // Agregar el mes actual al inicio del array
        mesActual = (mesActual - 1 + 12) % 12;  // Calcular el mes anterior
    }

    return ultimos12Meses;
};

// Función para renderizar gráficos para un cliente
const renderChartsForEmpresa = (empresaData) => {
    const meses = getUltimos12Meses();  // Obtener los últimos 12 meses

    const totalTrabajos = empresaData.trabajosPorMes
        ? empresaData.trabajosPorMes.reduce((acc, cur) => acc + cur, 0)
        : 0;
    const totalHorasTrabajadas = empresaData.horasTrabajadasPorMes
        ? empresaData.horasTrabajadasPorMes.reduce((acc, cur) => acc + cur, 0)
        : 0;

    // Configuración de datos para el gráfico de barras (trabajos realizados)
    const barData = {
        labels: meses,
        datasets: [{
            label: `Trabajos Realizados en los últimos 12 meses`,
            data: empresaData.trabajosPorMes || Array(12).fill(0),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    // Configuración de datos para el gráfico de líneas (horas trabajadas)
    const lineData = {
        labels: meses,
        datasets: [{
            label: `Horas Trabajadas en los últimos 12 meses`,
            data: empresaData.horasTrabajadasPorMes || Array(12).fill(0),
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1,
        }],
    };

    // Configuración de datos para el gráfico circular (lugares de trabajo)
    const lugaresData = {
        labels: Object.keys(empresaData.lugares),
        datasets: [{
            data: Object.values(empresaData.lugares),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
            borderWidth: 1,
        }],
    };

    // Configuración de datos para el gráfico de barras (tiempo invertido en cada trabajo)
    const trabajosLabels = empresaData.tiempoPorTrabajo
        .slice(-13)  // Obtener los últimos 13 trabajos
        .map(trabajo => trabajo.fecha.toLocaleDateString());

    const trabajosData = empresaData.tiempoPorTrabajo
        .slice(-13)
        .map(trabajo => trabajo.horasTrabajadas);  // Obtener horas trabajadas de los últimos 13 trabajos

    const tiempoPorTrabajoData = {
        labels: trabajosLabels,
        datasets: [{
            label: 'Tiempo Invertido en Cada Trabajo',
            data: trabajosData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <div className='contenedor1'>
            <div className="contenedor2">
                <div className="graficas">  {/*gráfico de barras */}
                    <Bar data={barData} />
                    <p className='nombre-graficas'>TRABAJOS REALIZADOS POR MES</p>
                    <p className='nombre-graficas'>TOTAL DE TRABAJOS: {totalTrabajos}</p>
                </div>
                <div className="graficas">  {/* Gráfico de líneas */}
                    <Line data={lineData} />
                    <p className='nombre-graficas'>HORAS TRABAJADAS POR MES</p>
                    <p className='nombre-graficas'>TOTAL DE HORAS TRABAJADAS: {totalHorasTrabajadas.toFixed(2)}</p>
                </div>

                <div className="circular1">  {/*Gráfico circular */}
                    <Pie data={lugaresData} />
                    <p className='nombre-graficas'>LUGARES DE TRABAJO</p>
                </div>

                <div className="graficas">
                    <Bar data={tiempoPorTrabajoData} />  {/* Gráfico de barras */}
                    <p className='nombre-graficas'>TIEMPO INVERTIDO EN CADA TRABAJO</p>
                </div>
            </div>
        </div>
    );
};

export default renderChartsForEmpresa;
