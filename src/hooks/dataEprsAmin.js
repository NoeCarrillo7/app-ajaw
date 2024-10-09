import { useState, useEffect } from 'react';

// Hook que agrupa los datos por empresa para el componente DatosAdmin
const useDataPorEmpresa = (data) => {
    const [dataPorEmpresa, setDataPorEmpresa] = useState({}); // Estado para almacenar los datos agrupados por empresa

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Mapea los trabajos para extraer solo los clientes que tienen datos válidos y formatea las fechas y otros campos
        const allClientes = data.map(job => {
            if (job.customer && job.customer.id && job.customer.name) {
                return {
                    id: job.customer.id, // ID del cliente
                    nombre: job.customer.name, // Nombre del cliente
                    date: new Date(job.dateCreated), // Fecha de creación del trabajo
                    actualStart: job.actualStart ? new Date(job.actualStart) : null, // Fecha de inicio del trabajo
                    actualEnd: job.actualEnd ? new Date(job.actualEnd) : null, // Fecha de fin del trabajo
                    addressCity: job.addressCity, // Ciudad del trabajo
                    year: new Date(job.dateCreated).getFullYear(), // Año de creación del trabajo
                    month: new Date(job.dateCreated).getMonth(), // Mes de creación del trabajo
                };
            } else {
                return null;
            }
        }).filter(cliente => cliente !== null); // Filtrar los valores null para eliminarlos del array

        const dataGroupedByEmpresa = {}; // Objeto para almacenar los datos agrupados por cliente
        const hoy = new Date(); // Fecha actual
        const mesActual = hoy.getMonth(); // Mes actual
        const anyoActual = hoy.getFullYear(); // Año actual

        // Iterar sobre cada cliente para agrupar los datos
        allClientes.forEach(cliente => {
            const { year, month, actualStart, actualEnd, nombre, addressCity, id } = cliente;
            const mesesAtras = (anyoActual - year) * 12 + (mesActual - month); // Calcula cuántos meses atrás ocurrió el trabajo

            // Procesa los trabajos hechos dentro de los últimos 12 meses
            if (mesesAtras >= 0 && mesesAtras < 12) {
                // Si la empresa aún no ha sido añadida al objeto, inicializar sus propiedades
                if (!dataGroupedByEmpresa[nombre]) {
                    dataGroupedByEmpresa[nombre] = {
                        id: {}, // Almacenar el ID del cliente
                        trabajosPorMes: Array(12).fill(0), // Array de 12 meses para contar trabajos por mes
                        horasTrabajadasPorMes: Array(12).fill(0), // Array de 12 meses para horas trabajadas por mes
                        lugares: {}, // Objeto para contar los trabajos por ciudad
                        tiempoPorTrabajo: [] // Array para registrar el tiempo trabajado en cada trabajo
                    };
                }

                const index = 11 - mesesAtras; // Índice para almacenar los datos en el mes correspondiente

                dataGroupedByEmpresa[nombre].trabajosPorMes[index] += 1; // Incrementa el número de trabajos en el mes correspondiente
                dataGroupedByEmpresa[nombre].id = id; // Almacena el ID del cliente

                // Si hay fechas de inicio y fin, calcula las horas trabajadas
                if (actualStart && actualEnd) {
                    const horasTrabajadas = (actualEnd - actualStart) / (1000 * 60 * 60); // Calcula horas trabajadas a partir de la diferencia en milisegundos
                    dataGroupedByEmpresa[nombre].horasTrabajadasPorMes[index] += parseFloat(horasTrabajadas.toFixed(1)); // Suma las horas trabajadas y redondea a un decimal

                    // Registra el tiempo trabajado en este trabajo
                    dataGroupedByEmpresa[nombre].tiempoPorTrabajo.push({
                        fecha: actualStart, // Fecha de inicio del trabajo
                        horasTrabajadas, // Horas trabajadas
                    });
                }

                // Registra el número de trabajos realizados en cada ciudad
                if (!dataGroupedByEmpresa[nombre].lugares[addressCity]) {
                    dataGroupedByEmpresa[nombre].lugares[addressCity] = 1; // Inicializa el conteo si la ciudad no ha sido registrada
                } else {
                    dataGroupedByEmpresa[nombre].lugares[addressCity] += 1; // Incrementa el conteo si la ciudad ya ha sido registrada
                }
            }
        });

        setDataPorEmpresa(dataGroupedByEmpresa);
    }, [data]);

    return dataPorEmpresa; // Devuelve los datos agrupados
};

export default useDataPorEmpresa;
