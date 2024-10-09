// Función que agrupa los datos de trabajos por empresa, calcula trabajos, horas trabajadas por mes, lugares y tiempo por trabajo
//Para el componente DatosUsers
export const groupDataByEmpresa = (data, codigo) => {
    // Filtrar los trabajos que corresponden al cliente con el ID especificado
    const allClientes = data
        .filter(job => job.customer.id.toString() === codigo)
        .map(job => ({
            id: job.customer.id,// ID del cliente
            nombre: job.customer.name, // Nombre del cliente
            date: new Date(job.dateCreated), // Fecha de creación del trabajo
            actualStart: job.actualStart ? new Date(job.actualStart) : null, // Fecha de inicio real del trabajo
            actualEnd: job.actualEnd ? new Date(job.actualEnd) : null, // Fecha de fin real del trabajo
            addressCity: job.addressCity, // Ciudad donde se realizó el trabajo
            year: new Date(job.dateCreated).getFullYear(), // Año de creación del trabajo
            month: new Date(job.dateCreated).getMonth(), // Mes de creación del trabajo
        }));

    // Objeto donde se agruparán los datos del cliente
    const dataGroupedByEmpresa = {};
    const hoy = new Date(); // Fecha actual
    const mesActual = hoy.getMonth(); // Mes actual
    const anyoActual = hoy.getFullYear(); // Año actual

    // Itera sobre todos los clientes filtrados y agrupados por la empresa
    allClientes.forEach(cliente => {
        const { year, month, actualStart, actualEnd, nombre, addressCity } = cliente;
        const mesesAtras = (anyoActual - year) * 12 + (mesActual - month); // Calcula la diferencia de meses entre el trabajo y la fecha actual

        // Verificar si el trabajo fue hecho en los últimos 12 meses
        if (mesesAtras >= 0 && mesesAtras < 12) {
            // Si la empresa no ha sido añadida al objeto de datos agrupados se inicializan sus proliedades
            if (!dataGroupedByEmpresa[nombre]) {
                dataGroupedByEmpresa[nombre] = {
                    nombreempresa: {}, // Nombre del cliente
                    trabajosPorMes: Array(12).fill(0), // Array de 12 meses para contar los trabajos por mes
                    horasTrabajadasPorMes: Array(12).fill(0), // Array de 12 meses para contar horas trabajadas por mes
                    lugares: {}, // Objeto para contar los trabajos realizados en cada ciudad
                    tiempoPorTrabajo: [] // Array para registrar el tiempo trabajado en cada trabajo
                };
            }

            const index = 11 - mesesAtras; // Calcula el índice correspondiente al mes
            dataGroupedByEmpresa[nombre].trabajosPorMes[index] += 1; // Incrementa el número de trabajos en el mes correspondiente
            dataGroupedByEmpresa[nombre].name = nombre; // Asign el nombre del cliente

            // Si hay fechas de inicio y fin del trabajo calcula las horas trabajadas
            if (actualStart && actualEnd) {
                const horasTrabajadas = (actualEnd - actualStart) / (1000 * 60 * 60); // Convertir la diferencia en milisegundos a horas
                dataGroupedByEmpresa[nombre].horasTrabajadasPorMes[index] += parseFloat(horasTrabajadas.toFixed(1)); // Suma las horas trabajadas y redondea a un decimal
                dataGroupedByEmpresa[nombre].tiempoPorTrabajo.push({
                    fecha: actualStart, // Fecha de inicio del trabajo
                    horasTrabajadas, // Horas trabajadas en ese trabajo
                });
            }

            // Cuenta el número de trabajos realizados en cada ciudad
            if (!dataGroupedByEmpresa[nombre].lugares[addressCity]) {
                dataGroupedByEmpresa[nombre].lugares[addressCity] = 1; // Si es la primera vez que aparece la ciudad, inicializar el conteo
            } else {
                dataGroupedByEmpresa[nombre].lugares[addressCity] += 1; // Si la ciudad ya está registrada, incrementar el conteo
            }
        }
    });

    // Obtiene el nombre del cliente si hay trabajos registrados, de lo contrario, devolver null
    const clienteNombre = allClientes.length > 0 ? allClientes[0].nombre : null;
    return dataGroupedByEmpresa[clienteNombre] || null; // Devuelve los datos agrupados por empresa o null si no hay datos
};
