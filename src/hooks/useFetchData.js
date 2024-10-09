import { useState, useEffect } from 'react';
import fetchApiData from '../services/Api'; // Importa la función fetchApiData que obtiene los datos de la API

// Custom Hook para gestionar la obtención de datos desde la API
const useFetchData = (endpoint) => {
    // Gestionar el estado de los datos, el estado de carga (loading), y los posibles errores
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función asíncrona para obtener los datos desde la API
        const fetchData = async () => {
            try {
                // Llama a la función fetchApiData con el endpoint proporcionado
                const result = await fetchApiData(endpoint);
                
                // Almacena los datos obtenidos en el estado 'data'
                setData(result);
                
                // Cambia el estado de 'loading' a false, ya que los datos se han cargado
                setLoading(false);
            } catch (err) {
                // Si hay un error, almacena el error en el estado 'error' y deja de cargar
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return { data, loading, error };
};

export default useFetchData;
