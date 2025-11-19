// src/pages/Admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { UsuarioController } from '../../../../backend/src/controller/UsuarioController'; 

// Instanciar el Controller fuera del componente para evitar recrearlo en cada render
const UsuarioControllerInstance = new UsuarioController();

const UserRegistrationModal = ({ show, onClose, onRegisterSuccess }) => {
    // 1. Estado para los datos del nuevo usuario
    const [newUserData, setNewUserData] = useState({
        usuario: '',
        contrasena: '',
        rol: 'Alumno', // Valor inicial por defecto
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    if (!show) return null;

    // Maneja los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prev => ({ ...prev, [name]: value }));
    };

    // 2. Lógica de Registro (Llama al CQRS a través del Controller)
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        // Validación simple de campos
        if (!newUserData.usuario || !newUserData.contrasena) {
            setError("Los campos Usuario y Contraseña son obligatorios.");
            return;
        }

        setIsSaving(true);
        try {
            // El flujo MVC -> CQRS -> DAO se ejecuta aquí:
            // El Controller llama a handleRegisterUser, que a su vez usa el CQRS.
            const registeredUser = UsuarioControllerInstance.handleRegisterUser(newUserData);
            
            // Si el registro fue exitoso, notificar al componente padre
            onRegisterSuccess(registeredUser); 
            
            // Limpiar formulario y cerrar modal
            setNewUserData({ usuario: '', contrasena: '', rol: 'Alumno' });
            onClose();

        } catch (err) {
            console.error("Error al registrar usuario:", err);
            setError("Error al registrar. Intente de nuevo.");
        } finally {
            setIsSaving(false);
        }
    };
    return (
        // Fondo Oscuro
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            {/* Contenedor del Diálogo */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
                
                {/* Encabezado */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                    Registrar Nuevo Usuario Interno
                </h3>

                {/* Formulario */}
                <form onSubmit={handleRegister} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    {/* Campo de Rol */}
                    <div>
                        <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                        <select
                            id="rol"
                            name="rol"
                            value={newUserData.rol}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            disabled={isSaving}
                        >
                            <option value="Bibliotecario">Bibliotecario</option>
                            <option value="Alumno">Alumno</option>
                        </select>
                    </div>

                    {/* Campo de Usuario */}
                    <div>
                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            type="text"
                            id="usuario"
                            name="usuario"
                            value={newUserData.usuario}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Ingrese nombre de usuario"
                            disabled={isSaving}
                        />
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            value={newUserData.contrasena}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Ingrese contraseña"
                            disabled={isSaving}
                        />
                    </div>

                    {/* Pie de página con botones */}
                    <div className="pt-4 flex justify-end space-x-3">
                        {/* Botón Blanco de Cancelar */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        
                        {/* Botón Azul de Registrar */}
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Registrando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
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
    // Estados existentes
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // NUEVO ESTADO: Controla la visibilidad del modal
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // Llama al Controller (ahora retorna Promesa)
            const listaUsuarios = await UsuarioControllerInstance.handleGetUsers(); 
            setUsuarios(listaUsuarios);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Función para manejar el registro exitoso (actualiza la lista)
    const handleRegisterSuccess = (newUser) => {
        // Añade el nuevo usuario a la lista sin recargar todos los datos
        setUsuarios(prev => [...prev, newUser]);
        // Podrías mostrar un mensaje de éxito aquí
        console.log("Usuario registrado con éxito:", newUser);
    };

    return (
        <div className="space-y-6">
            
            {/* BOTONES Y ENCABEZADO */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">
                    Gestión de Usuarios
                </h2>
                <button 
                    // CAMBIO: Abre el modal
                    onClick={() => setShowRegisterModal(true)} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 shadow-md">
                    + Nuevo Usuario
                </button>
            </div>

            {/* Barra de Búsqueda y Filtros (sin cambios) */}
            <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4">
                {/* ... inputs y selects ... */}
            </div>
            
            {/* Tabla de Usuarios (sin cambios) */}
            <TablaUsuarios usuarios={usuarios} isLoading={isLoading} />

            {/* INTEGRACIÓN DEL MODAL */}
            <UserRegistrationModal
                show={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onRegisterSuccess={handleRegisterSuccess}
            />
        </div>
    );
};

export default AdminUsers;