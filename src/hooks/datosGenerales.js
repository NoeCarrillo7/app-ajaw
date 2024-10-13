const procesarDatosGenerales = (data) => {
    const trabajosPorMes = Array(12).fill(0);
    const horasTrabajadasPorMes = Array(12).fill(0);
    const lugares = {};
    const tiempoPorTrabajo = [];

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();

    data.forEach(job => {
        const jobDate = new Date(job.actualStart);
        const mesTrabajo = jobDate.getMonth();
        const añoTrabajo = jobDate.getFullYear();
        const mesesAtras = (añoActual - añoTrabajo) * 12 + (mesActual - mesTrabajo);

        if (mesesAtras >= 0 && mesesAtras < 12) {
            const actualStart = new Date(job.actualStart);
            const actualEnd = job.actualEnd ? new Date(job.actualEnd) : null;
            const horasTrabajadas = actualEnd ? (actualEnd - actualStart) / (1000 * 60 * 60) : 0;

            const index = 11 - mesesAtras;

            trabajosPorMes[index] += 1;
            horasTrabajadasPorMes[index] += horasTrabajadas;

            if (job.site && job.site.name) {
                if (!lugares[job.site.name]) {
                    lugares[job.site.name] = 0;
                }
                lugares[job.site.name] += 1;
            }

            tiempoPorTrabajo.push({
                fecha: jobDate,
                horasTrabajadas
            });
        }
    });

    return { trabajosPorMes, horasTrabajadasPorMes, lugares, tiempoPorTrabajo };
};

export default procesarDatosGenerales;