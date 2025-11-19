// src/pages/Admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { UsuarioController } from '../../../../backend/src/libros/controller/UsuarioController'; 

// Instanciar el Controller fuera del componente para evitar recrearlo en cada render
const UsuarioControllerInstance = new UsuarioController();


// **************** CORRECCIÓN 2: COMPONENTE MOVIDO FUERA DEL RENDER ****************
const TablaUsuarios = ({ usuarios, isLoading }) => (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Lista de Usuarios Internos
        </h3>
        {isLoading ? (
            <div className="h-24 flex items-center justify-center text-indigo-500">
                Cargando usuarios...
            </div>
        ) : usuarios.length === 0 ? (
            <div className="h-24 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded">
                No hay usuarios internos registrados.
            </div>
        ) : (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.usuario}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.rol}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                <button className="text-red-600 hover:text-red-900">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);


const AdminUsers = () => {
    // Estados
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);

            // 1. AWAIT la llamada asíncrona al Controller (MVC)
            try {
                const listaUsuarios = await UsuarioControllerInstance.handleGetUsers(); 
                setUsuarios(listaUsuarios);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
                // Manejo de error si fuera necesario
            }
            
            setIsLoading(false);
        };
        
        fetchUsers();

        // No se necesita cleanup si solo hay un fetch, pero se puede dejar vacío si el error persiste.
    }, []);

    const handleNuevoUsuario = () => {
        // En un futuro, aquí se llamaría al handleRegisterUser del Controller.
        alert('Formulario de Nuevo Usuario (pendiente)');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">
                    Gestión de Usuarios
                </h2>
                <button 
                    onClick={handleNuevoUsuario}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 shadow-md">
                    + Nuevo Usuario
                </button>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4">
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o email..."
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select className="p-2 border border-gray-300 rounded">
                    <option>Todos los roles</option>
                    <option>Bibliotecario</option>
                    <option>Alumno</option>
                </select>
            </div>
            
            {/* Componente de Tabla (pasando el estado como prop) */}
            <TablaUsuarios usuarios={usuarios} isLoading={isLoading} />
        </div>
    );
};

export default AdminUsers;