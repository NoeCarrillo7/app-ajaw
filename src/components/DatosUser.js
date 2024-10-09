import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Logo from "../assets/images/LOGO AJAW.png";
import '../styles/userStyles.css'; // Estilos para el componente de usuarios
import { groupDataByEmpresa } from '../hooks/dataEprsUser'; // Función para agrupar datos por empresa
import useFetchData from '../hooks/useFetchData'; // Custom hook para manejar la obtención de datos desde la API
import renderChartsForEmpresa from './common/Charts'; // Función para renderizar gráficos por empresa
import TrabajoDetalles from './common/TrabajoDetalles'; // Componente que muestra los detalles de los trabajos
import BarProgress from './common/BarProgress'; // Componente para mostrar una barra de progreso de carga
import MesSelector from './common/MesSelector'; // Componente que permite seleccionar un mes

function DatosUser() {
    const { codigo } = useParams(); // Obtener el código del cliente desde la URL
    const navigate = useNavigate(); // Hook para manejar la navegación
    const { data, loading, error } = useFetchData('/job/list'); // Usar el hook para obtener los datos de trabajos
    const [datosEmpresa, setDatosEmpresa] = useState(null); // Estado para almacenar los datos de la empresa agrupados
    const [clienteData, setClienteData] = useState({ trabajos: [] }); // Estado para almacenar los trabajos filtrados por mes
    const [showMesSelector] = useState(true); // Estado para controlar si se muestra el selector de meses
    const [, setMesSeleccionado] = useState(null); // Estado para almacenar el mes seleccionado por el usuario

    // para actualizar los datos de la empresa cuando se obtienen los datos desde la API o cambia el código
    useEffect(() => {
        if (!data || data.length === 0 || !codigo) return; // Verifica si hay datos o si el código es válido
        
        // Agrupar los datos por empresa según el código proporcionado
        const groupedData = groupDataByEmpresa(data, codigo);
        setDatosEmpresa(groupedData);
    }, [data, codigo]);

    // Función que maneja el cambio de mes en el selector
    const handleMesChange = (event) => {
        const selectedMes = parseInt(event.target.value); // Obtener el mes seleccionado
        setMesSeleccionado(selectedMes); // Actualizar el mes seleccionado

        if (selectedMes !== null && data && data.length > 0) {
            // Filtrar los trabajos por el mes seleccionado y el nombre del cliente
            const trabajosMes = data.filter(job => {
                const jobDate = new Date(job.dateCreated); // Fecha de creación del trabajo
                return job.customer && job.customer.name === datosEmpresa?.name &&
                    jobDate.getMonth() === selectedMes; // Verificar si coincide el mes y el cliente
            }).map(job => {
                // Formatear los datos de cada trabajo
                const actualStart = new Date(job.actualStart); // Fecha de inicio real
                const actualEnd = job.actualEnd ? new Date(job.actualEnd) : null; // Fecha de fin real
                const tiempoTrabajado = job.actualEnd
                    ? calculateTimeDifference(actualStart, actualEnd) // Calcular tiempo trabajado si el trabajo terminó
                    : "N/A"; // Si no terminó, mostrar "N/A"

                // Devolver un objeto con los detalles relevantes del trabajo
                return {
                    type: job.type?.name,
                    description: job.description,
                    addressCity: job.addressCity,
                    equipmentName: job.equipment?.name,
                    technicianName: job.technician?.name,
                    sitio: job.site?.name,
                    actualStart: actualStart.toLocaleDateString(), // Fecha de inicio formateada
                    actualEnd: job.actualEnd ? actualEnd.toLocaleDateString() : "N/A", // Fecha de fin formateada (o "N/A")
                    tiempoTrabajado, // Tiempo trabajado calculado
                };
            });

            setClienteData({ trabajos: trabajosMes }); // Actualizar los trabajos filtrados por mes
        } else {
            setClienteData({ trabajos: [] }); // Si no hay mes seleccionado, limpiar los trabajos
        }
    };

    // Función para calcular la diferencia de tiempo entre dos fechas
    const calculateTimeDifference = (start, end) => {
        const diff = end - start; // Calcular la diferencia en milisegundos
        const hours = Math.floor(diff / (1000 * 60 * 60)); // Convertir a horas
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Convertir a minutos
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`; // Devolver el tiempo formateado como hh:mm
    };

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Eliminar el token de autenticación del almacenamiento local
        navigate("/"); // Redirigir al usuario a la página de login
    };

    if (loading) {
        return <BarProgress />; // Mostrar barra de progreso mientras los datos se cargan
    }

    if (error) {
        return <div className="error">Error: {error.message}</div>; // Mostrar el mensaje de error
    }

    return (
        <div>
            {/* Encabezado con el logo y el botón de cierre de sesión */}
            <header className='encabezado-user'>
                <div className='logo-user'>
                    <img src={Logo} alt="LOGO AJAW" className="logo-img-ini-user" />
                </div>
                <div className='container-logout'>
                    <button className='logout-button-user' onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </header>

            <div className='nombre-user'>
                <h2 className="empresa-user">{datosEmpresa ? datosEmpresa.name : 'Cliente no encontrado'}</h2>
            </div>

            {/* Renderizado de gráficos si se encuentran datos de la empresa */}
            {datosEmpresa ? renderChartsForEmpresa(datosEmpresa) :
                <h2 className="anuncio1-user">No se encontraron datos para el cliente.</h2>}
            
            {/* Selector de mes y detalles de trabajos */}
            {showMesSelector && (
                <>
                    <center><h2 className="detalles-trabajos-user">DETALLES DE TRABAJOS</h2></center>
                    <MesSelector onChange={handleMesChange} /> {/* Componente para seleccionar el mes */}
                    <br/>
                    <br/>
                </>
            )}

            {/* Componente que muestra los detalles de los trabajos filtrados */}
            <TrabajoDetalles trabajos={clienteData.trabajos} />
        </div>
    );
}

export default DatosUser;
