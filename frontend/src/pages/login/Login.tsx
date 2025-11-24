import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// Configuración de la URL del backend
const API_BASE_URL = 'http://localhost:3000/api'; // puerto del backend

const LoginScreen = ({ onLoginSuccess }) => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!usuario || !contrasena) {
            setError('Por favor, ingrese usuario y contraseña.');
            return;
        }

        setIsLoading(true);

        try {
            // Llamada a la API del backend (patrón MVC)
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario,
                    contrasena,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Guardar información de sesión en localStorage
                localStorage.setItem('biblioteca_auth_session', JSON.stringify({
                    userId: result.userId,
                    rol: result.rol,
                    isAuthenticated: true,
                }));

                console.log(`Login exitoso. Usuario: ${result.rol}`);
                
               // Redirigir según el rol
                if (result.rol === 'Bibliotecario') {
                    navigate('/admin');
                } else if (result.rol === 'Alumno') {
                    navigate('/usuario');
                }
            } else {
                setError(result.message || 'Error de credenciales. Intente de nuevo.');
            }
        } catch (err) {
            console.error("Error de autenticación:", err);
            setError('No se pudo conectar con el servidor. Verifique que el backend esté corriendo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Biblioteca Universal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Inicie sesión para acceder al sistema
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario
                            </label>
                            <input
                                id="usuario"
                                name="usuario"
                                type="text"
                                required
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                                placeholder="Ingrese su usuario"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                id="contrasena"
                                name="contrasena"
                                type="password"
                                required
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                                placeholder="Ingrese su contraseña"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="text-center text-xs text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold mb-2 text-gray-700">🔑 Cuentas de prueba:</p>
                    <div className="space-y-1">
                        <p><span className="font-medium">Bibliotecario:</span> <code className="bg-gray-200 px-2 py-1 rounded">admin / 1234</code></p>
                        <p><span className="font-medium">Alumno:</span> <code className="bg-gray-200 px-2 py-1 rounded">student1 / 1234</code></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;