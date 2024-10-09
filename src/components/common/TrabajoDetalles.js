import React from 'react';

const TrabajoDetalles = ({ trabajos }) => {
    return (
        <div className='trabajo-detalles'>
            {/* Mapea sobre el array de trabajos y crea una sección para cada trabajo */}
            {trabajos.map((trabajo, index) => (
                <div key={index} className='estilo-tablas'>
                    <div className='servicio'>
                        {/* Muestra el tipo de trabajo */}
                        <h3>{trabajo.type}</h3>
                    </div>
                    <div className='datos'>
                        {/* Muestra la descripción del trabajo */}
                        <p>Descripción:</p>
                        <input type="text" value={trabajo.description} disabled />
                        {/* Muestra el sitio donde se realizó el trabajo */}
                        <p>Sitio:</p>
                        <input type="text" value={trabajo.sitio} disabled />
                        {/* Muestra el nombre del equipo utilizado */}
                        <p>Equipo:</p>
                        <input type="text" value={trabajo.equipmentName} disabled />
                        {/* Muestra el nombre del técnico asignado */}
                        <p>Técnico:</p>
                        <input type="text" value={trabajo.technicianName} disabled />
                        {/* Muestra la ciudad donde se realizó el trabajo */}
                        <p>Ciudad:</p>
                        <input type="text" value={trabajo.addressCity} disabled />
                        {/* Muestra el tiempo trabajado */}
                        <p>Tiempo Trabajado:</p>
                        <input type="text" value={trabajo.tiempoTrabajado} disabled />
                        {/* Muestra la fecha de inicio del trabajo */}
                        <p>Fecha:</p>
                        <input type="text" value={trabajo.actualStart} disabled />
                        <br/>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrabajoDetalles;
