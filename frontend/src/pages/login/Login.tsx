import React, { useState } from 'react';
import { AuthController } from '../../../../backend/src/controller/AuthController.js'; 

// Instancia del controlador de autenticación (MVC)
const authController = new AuthController();

const LoginScreen = ({ onLoginSuccess }) => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!usuario || !contrasena) {
            setError('Por favor, ingrese usuario y contraseña.');
            return;
        }

        setIsLoading(true);

        try {
            // Llama al AuthController para iniciar sesión
            // Flujo: Vista -> AuthController -> UsuarioController -> DAO
            const result = await authController.login(usuario, contrasena);

            if (result.success) {
                // Autenticación exitosa. Redirigir según el rol.
                
                let redirectPath = '';
                if (result.rol === 'Bibliotecario') {
                    redirectPath = '/admin'; // Redirige al CRUD de Usuarios
                } else if (result.rol === 'Alumno') {
                    redirectPath = '/search'; // Redirige al Buscador de Libros
                }

                console.log(`Login exitoso. Redirigiendo a: ${redirectPath}`);
                
                // En un entorno real, aquí usarías history.push(redirectPath) o navigate(redirectPath)
                if (onLoginSuccess) {
                    onLoginSuccess(result.rol);
                }

            } else {
                setError(result.message || 'Error de credenciales. Intente de nuevo.');
            }
        } catch (err) {
            console.error("Error de autenticación:", err);
            setError('Ocurrió un error en el servidor. Intente más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Biblioteca Universal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Inicie sesión para acceder al sistema.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Mensaje de Error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Campo de Usuario */}
                        <div>
                            <label htmlFor="usuario" className="sr-only">Usuario</label>
                            <input
                                id="usuario"
                                name="usuario"
                                type="text"
                                required
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Usuario (ej: admin o student1)"
                                disabled={isLoading}
                            />
                        </div>
                        {/* Campo de Contraseña */}
                        <div>
                            <label htmlFor="contrasena" className="sr-only">Contraseña</label>
                            <input
                                id="contrasena"
                                name="contrasena"
                                type="password"
                                required
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña (ej: 1234)"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
                
                {/* Visualización de roles de prueba */}
                <div className="text-center text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold mb-1">Cuentas de prueba:</p>
                    <p>Bibliotecario: <strong>admin / 1234</strong></p>
                    <p>Alumno: <strong>student1 / 1234</strong></p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;