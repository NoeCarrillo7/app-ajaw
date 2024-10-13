import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';
import Logo from "../assets/images/LOGO AJAW.png";
import useFetchData from '../hooks/useFetchData'; //hook para obtener datos de la API
import useDataPorEmpresa from '../hooks/dataEprsAmin'; //hook para procesar datos del cliente
import renderChartsForEmpresa from './common/Charts'; // Componente para gráficos
import TrabajoDetalles from './common/TrabajoDetalles'; // Componente para mostrar detalles de trabajo
import MesSelector from './common/MesSelector'; // Componente para seleccionar el mes
import BarProgress from './common/BarProgress'; // Componente para mostrar la barra de progreso
import procesarDatosGenerales from '../hooks/datosGenerales';


function DatosAdmin() {
    const { data, loading, error } = useFetchData('/job/list'); // Estado para almacenar los datos de trabajos, loading y error
    const [clienteSeleccionado, setClienteSeleccionado] = useState(''); // Cliente seleccionado
    const [datosEmpresa, setDatosEmpresa] = useState(null); // Datos del cleinte seleccionada
    const [clienteId, setClienteId] = useState(null); // ID del cliente seleccionado
    const [clienteData, setClienteData] = useState({ trabajos: [] }); // Datos de trabajos del cliente
    const [mesSeleccionado, setMesSeleccionado] = useState(null); // Mes seleccionado
    const [showMesSelector, setShowMesSelector] = useState(false); //selector de mes
    const [vista, setVista] = useState('estadisticas'); // Vista actual
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const dataPorEmpresa = useDataPorEmpresa(data); // Procesa los datos por empresa
    const datosGenerales = procesarDatosGenerales(data);

    // Maneja el cambio de cliente en el selector
    const handleEmpresaChange = (event) => {
        const selectedEmpresa = event.target.value; // cleinte seleccionada
        setClienteSeleccionado(selectedEmpresa); // Actualiza el estado del cliente seleccionado
        const selectedCliente = data.find(job => job.customer && job.customer.name === selectedEmpresa); // Busca el cliente en los datos
        setClienteId(selectedCliente?.customer?.id || null); // Establece el ID del cliente

        setDatosEmpresa(dataPorEmpresa[selectedEmpresa] || null); // Obtiene los datos del cliente
        setShowMesSelector(true); // Muestra el selector de mes
        setVista('datosClientes'); // Cambia a la vista de datos del cliente
    };

    // Maneja el cambio de mes en el selector
    const handleMesChange = (event) => {
        const selectedMes = parseInt(event.target.value); // Mes seleccionado
        setMesSeleccionado(selectedMes);

        // Filtra los trabajos según el mes seleccionado y actualiza el estado de clienteData
        if (selectedMes !== null && data && data.length > 0) {
            const trabajosMes = data.filter(job => {
                const jobDate = new Date(job.dateCreated);
                return job.customer?.name === clienteSeleccionado && jobDate.getMonth() === selectedMes;
            }).map(job => {
                const actualStart = new Date(job.actualStart);
                const actualEnd = job.actualEnd ? new Date(job.actualEnd) : null;
                const tiempoTrabajado = job.actualEnd
                    ? calculateTimeDifference(actualStart, actualEnd)
                    : "N/A";

                return {
                    type: job.type?.name,
                    description: job.description,
                    addressCity: job.addressCity,
                    equipmentName: job.equipment?.name,
                    technicianName: job.technician?.name,
                    sitio: job.site?.name,
                    actualStart: actualStart.toLocaleDateString(),
                    actualEnd: job.actualEnd ? actualEnd.toLocaleDateString() : "N/A",
                    tiempoTrabajado,
                };
            });

            setClienteData({ trabajos: trabajosMes }); // Actualiza los datos del cliente
        } else {
            setClienteData({ trabajos: [] });
        }
    };

    // Obtiene trabajos para el mes seleccionado
    const getJobsForSelectedMonth = (month) => {
        return data.filter(job => {
            const jobDate = new Date(job.dateCreated);
            return jobDate.getMonth() === month; // Filtra trabajos por mes
        }).map(job => {
            const actualStart = new Date(job.actualStart);
            const actualEnd = job.actualEnd ? new Date(job.actualEnd) : null;
            const tiempoTrabajado = job.actualEnd
                ? calculateTimeDifference(actualStart, actualEnd)
                : "N/A";

            return {
                type: job.type?.name,
                description: job.description,
                addressCity: job.addressCity,
                equipmentName: job.equipment?.name,
                technicianName: job.technician?.name,
                sitio: job.site?.name,
                actualStart: actualStart.toLocaleDateString(),
                actualEnd: job.actualEnd ? actualEnd.toLocaleDateString() : "N/A",
                tiempoTrabajado,
            };
        });
    };

    // Calcula la diferencia de tiempo entre dos fechas
    const calculateTimeDifference = (start, end) => {
        const diff = end - start; // Diferencia en milisegundos
        const hours = Math.floor(diff / (1000 * 60 * 60)); // Horas
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Minutos
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`; // Formato de horas:minutos
    };

    // Maneja la confirmación de cierre de sesión
    const handleLogoutConfirm = () => {
        localStorage.removeItem('authToken'); // Elimina el token de autenticación
        navigate("/"); // Navega a la página de login
    };
    
    // Muestra una barra de progreso mientras se cargan los datos
    if (loading) return <BarProgress />;

    // Muestra un mensaje de error si ocurre un problema al cargar datos
    if (error) return <div className="error">Error: {error.message}</div>;

    // Obtiene una lista de clientes únicos de los datos
    const uniqueClientes = data ? [...new Set(data.filter(job => job.customer?.name).map(job => job.customer.name))] : [];

    return (
        <div>
            {/* Modal de confirmación para cerrar sesión */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>¿Estás seguro de que deseas cerrar sesión?</h3>
                        <div className="modal-buttons">
                            <button className="confirm-button" onClick={handleLogoutConfirm}>
                                Sí
                            </button>
                            <button className="cancel-button" onClick={() => setShowModal(false)}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Encabezado de la aplicación */}
            <header className='encabezado'>
                <div className='logoA'>
                    <img src={Logo} alt="LOGO AJAW" className="logo-img-ini" />
                </div>
                <nav className="nav-bar">
                    <ul className="nav-menu">
                        {/* Botón para mostrar estadísticas generales */}
                        <li>
                            <button onClick={() => setVista('estadisticas')}>
                                Estadísticas Generales
                            </button>
                        </li>
                        {/* Selector de cliente para elegir una empresa específica */}
                        <li>
                            <select
                                id="clienteSelect"
                                onChange={handleEmpresaChange}
                                value={clienteSeleccionado}
                                className="custom-select"
                            >
                                <option value="" disabled>Clientes</option>
                                {uniqueClientes.map(cliente => (
                                    <option key={cliente} value={cliente}>
                                        {cliente}
                                    </option>
                                ))}
                            </select>
                        </li>
                        {/* Botón para cerrar sesión */}
                        <li>
                            <button onClick={() => setShowModal(true)}>
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>
    
            {/* Renderiza diferentes vistas según la selección */}
            {vista === 'estadisticas' ? (
                <div>
                    <h2 className="empresat">Trabajos Realizados</h2>
                    <h3 className="text">Codigo Administrador: 982647035</h3>
    
                    {/* Renderiza gráficos basados en datos generales */}
                    {renderChartsForEmpresa(datosGenerales)}
    
                    <h2 className="detalles-trabajos">
                        Detalles de Trabajos para {new Date(0, mesSeleccionado).toLocaleString('es-ES', { month: 'long' })} 
                    </h2>
                    {/* Componente para seleccionar el mes */}
                    <MesSelector onChange={handleMesChange} />
    
                    {/* Muestra detalles de trabajos si se ha seleccionado un mes */}
                    {mesSeleccionado !== null && (
                        <>
                            <TrabajoDetalles trabajos={getJobsForSelectedMonth(mesSeleccionado)} />
                            <br/>
                            <br/>
                        </>
                    )}
                </div>
            ) : (
                <div>
                    <div className='nombre'>
                        <h2 className="empresa">{clienteSeleccionado}</h2>
                        {/* Muestra el código del cliente si está disponible */}
                        {clienteId && <h2 className="empresa-code">Codigo Cliente: {clienteId}</h2>}
                    </div>
    
                    {/* Renderiza gráficos para el cliente seleccionada */}
                    {datosEmpresa ? (
                        Object.keys(datosEmpresa).length > 0 ? (
                            renderChartsForEmpresa(datosEmpresa)
                        ) : (
                            <h2 className="anuncio1">No hay datos disponibles para graficar.</h2>
                        )
                    ) : (
                        <h2 className="anuncio1">Seleccione su empresa.</h2>
                    )}
    
                    {/* Muestra selector de mes si se ha seleccionado un cliente */}
                    {showMesSelector && (
                        <>
                            <center>
                                <h2 className="detalles-trabajos">
                                    DETALLES DE TRABAJOS
                                </h2>
                            </center>
                            <MesSelector onChange={handleMesChange} />
                        </>
                    )}
    
                    {/* Detalles de trabajos de la empresa seleccionada */}
                    <TrabajoDetalles trabajos={clienteData.trabajos} />
                    <br/>
                    <br/>
                </div>
            )}
        </div>
    );
    
}

export default DatosAdmin;
