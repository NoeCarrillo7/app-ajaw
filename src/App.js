import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import DatosUser from './components/DatosUser';
import DatosAdmin from './components/DatosAdmin';
import PrivateRoute from './components/common/PrivateRoute';


function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta para la página de inicio de sesión*/}
                <Route path="/" element={<Login />} />
                
                {/* Ruta protegida para ver los datos de un usuario específico, usando un parámetro dinámico :codigo */}
                <Route path="/datosuser/:codigo" element={
                    // PrivateRoute asegura que solo los usuarios autenticados puedan acceder a esta ruta
                    <PrivateRoute>
                        <DatosUser />
                    </PrivateRoute>
                } />
                
                {/* Ruta protegida para la página de administrador, accesible solo para usuarios autenticados */}
                <Route path="/datosadmin" element={
                    // PrivateRoute asegura que solo los usuarios autenticados puedan acceder a esta ruta
                    <PrivateRoute>
                        <DatosAdmin />
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
