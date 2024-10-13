import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/LOGO AJAW.png"; // Importa el logo desde los archivos de imágenes
import '@fortawesome/fontawesome-free/css/all.min.css'; //FontAwesome para los iconos
import axios from 'axios';
import "../styles/Login.css"; // estilos CSS para la página de login

function Login() {
    // Estados para manejar si el usuario está en el modo de registro o de inicio de sesión
    const [isRegistering, setIsRegistering] = useState(false);
    
    // Estados para almacenar los datos ingresados en los inputs
    const [email, setEmail] = useState(""); // Para el email del usuario
    const [pass, setContraseña] = useState(""); // Para la contraseña
    const [codigo, setCodigo] = useState(""); // Para el código en caso de registro
    
    const navigate = useNavigate(); // Hook para redirigir a otras rutas

    // Función que maneja el proceso de login
    const handleLogin = async () => {
        try {
            // Realiza una petición POST al servidor para iniciar sesión
            const response = await axios.post('https://clientes.ajaw.com.mx/api/login.php', {
                email,
                pass,
            });
            
            // Extrae el código y token de la respuesta
            const { code, token } = response.data;

            // Almacena el token en el localStorage para mantener la sesión del usuario
            localStorage.setItem('authToken', token);

            // Si el código es el del administrador, redirige a la página de administración
            if (parseInt(code) === 982647035) {
                navigate(`/datosadmin`);
            } else {
                // Si no, redirige a la página de datos del usuario con su código
                navigate(`/datosuser/${code}`);
            }
        } catch (error) {
            console.error('Error en el login:', error);
            alert('Error al iniciar sesión, verifica tus credenciales.');
        }
    };

    // Función que maneja el proceso de registro
    const handleRegister = async () => {
        try {
            // Realiza una petición POST al servidor para registrar un nuevo usuario
            const response = await axios.post('https://clientes.ajaw.com.mx/api/register.php', {
                email,
                pass,
                codigo, // Se incluye el código en el registro
            });

            console.log(response.data);
            
            // Redirige dependiendo del código, igual que en el login
            if (parseInt(codigo) === 982647035) {
                navigate(`/datosadmin`);
            } else {
                navigate(`/datosuser/${codigo}`);
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Error al registrarse, verifica los datos proporcionados.');
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                {/* Botones para alternar entre Iniciar Sesión y Crear Cuenta */}
                <div className="toggle-container">
                    <button
                        className={`toggle-button ${!isRegistering ? "active" : ""}`} // Si no está registrando, activa el botón de iniciar sesión
                        onClick={() => setIsRegistering(false)}>
                        Iniciar Sesión
                    </button>
                    <button
                        className={`toggle-button ${isRegistering ? "active" : ""}`} // Si está registrando, activa el botón de registro
                        onClick={() => setIsRegistering(true)}>
                        Crear Cuenta
                    </button>
                </div>

                {/* Título que cambia según si está registrando o iniciando sesión */}
                <h1>{isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}</h1>

                {/* Campo para el email */}
                <div className="input-wrapper">
                    <i className="fas fa-envelope icon"></i>
                    <input
                        className="input-field"
                        type="email"
                        placeholder="Ingresa tu correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
                    />
                </div>

                {/* Campo para la contraseña */}
                <div className="input-wrapper">
                    <i className="fas fa-lock icon"></i>
                    <input
                        className="input-field"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={pass}
                        onChange={(e) => setContraseña(e.target.value)} // Actualiza el estado de la contraseña
                    />
                </div>

                {/* Campo adicional solo visible si se está registrando */}
                {isRegistering && (
                <>
                    {/* Campo para el código */}
                    <div className="input-wrapper">
                        <i className="fas fa-key icon"></i>
                        <input
                            className="input-field"
                            type="number"
                            placeholder="Ingresa tu código"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)} // Actualiza el estado del código
                        />
                    </div>
                    <p className="help-text">Consulta tu código con la empresa</p> {/* Mensaje de ayuda */}
                </>
                )}

                {/* Botón que cambia su función dependiendo si está registrando o iniciando sesión */}
                <button
                    className="submit-button"
                    onClick={isRegistering ? handleRegister : handleLogin}>
                    {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
                </button>

                {/* Logo de la empresa */}
                <img src={Logo} alt="LOGO AJAW" className="logo-img-login" />
            </div>
        </div>
    );
}

export default Login;
