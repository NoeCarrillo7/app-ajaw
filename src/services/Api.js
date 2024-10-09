// Función asíncrona para obtener datos de una API, con soporte para paginación
const fetchApiData = async (endpoint, pageSize = 100) => {
    // Base URL del servidor API
    const baseUrl = 'https://servidorapi.ajaw.com.mx/api.php';

    try {
        // Primera solicitud para obtener el número total de registros, usando pageSize=1 para solo un registro
        const urlTotal = `${baseUrl}?endpoint=/Api/v3/job/list&page=1&pageSize=1`;
        const responseTotal = await fetch(urlTotal, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!responseTotal.ok) {
            throw new Error(`HTTP error! status: ${responseTotal.status}`);
        }

        const responseDataTotal = await responseTotal.json();
        const totalRegistros = responseDataTotal.recordsTotal; // Número total de registros
        const totalPages = Math.ceil(totalRegistros / pageSize); // Calcula el número total de páginas según pageSize
        const allData = [];

        // Bucle para realizar solicitudes a cada página de resultados
        for (let page = 1; page <= totalPages; page++) {
            const url = `${baseUrl}?endpoint=/Api/v3/job/list&page=${page}&pageSize=${pageSize}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            allData.push(...responseData.data); // Agrega los datos de la página actual a allData
        }

        return allData;

    } catch (error) {
        console.error('No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo nuevamente.', error);
        throw error;
    }
};

export default fetchApiData;
