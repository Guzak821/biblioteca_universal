// src/pages/Admin/AdminUsers.jsx
// src/pages/Admin/AdminUsers.jsx
import React, { useState, useEffect, useMemo } from 'react';
// IMPORTANTE: Asegura la ruta correcta a tu controlador
import { UsuarioController } from '../../../../backend/src/controller/UsuarioController'; 

// --- 1. CONFIGURACIÓN E INSTANCIAS ---

const UsuarioControllerInstance = new UsuarioController();

const EMPTY_USER_DATA = {
    usuario: '',
    contrasena: '',
    rol: 'Alumno', 
};


// --- 2. MODAL ÚNICO: UserFormModal (Registro y Edición) ---

const UserFormModal = ({ show, onClose, user, onSave, isNew }) => {
    const [formData, setFormData] = useState(user || EMPTY_USER_DATA);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    
    const modalTitle = isNew ? 'Registrar Nuevo Usuario Interno' : `Editar Usuario: ${user?.usuario}`;
    const buttonText = isNew ? 'Registrar' : 'Guardar Cambios';

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.usuario || !formData.contrasena) {
            setError("Los campos Usuario y Contraseña son obligatorios.");
            return;
        }

        setIsSaving(true);
        try {
            // Llama a la función de guardado en el componente padre
            onSave(formData, isNew); 
            onClose();
        } catch (err) {
            console.error(`Error al ${isNew ? 'registrar' : 'editar'} usuario:`, err);
            setError(`Error al ${isNew ? 'registrar' : 'editar'}. Intente de nuevo.`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        // ... (Estructura visual del modal con estilos Tailwind CSS)
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
                
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                    {modalTitle}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    {/* Campo de Rol */}
                    <div>
                        <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                        <select
                            id="rol"
                            name="rol"
                            value={formData.rol}
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
                            value={formData.usuario}
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
                            value={formData.contrasena}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder={isNew ? "Ingrese contraseña" : "Deje en blanco para no cambiar"}
                            disabled={isSaving}
                        />
                        {!isNew && <p className="mt-1 text-xs text-gray-500">Deje en blanco para mantener la contraseña actual.</p>}
                    </div>

                    {/* Pie de página con botones */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Guardando...' : buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- 3. COMPONENTE DE TABLA ---

const TablaUsuarios = ({ usuarios, isLoading, onEdit, onDelete }) => (
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
                No hay usuarios internos registrados o no coinciden con la búsqueda.
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
                                <button 
                                    onClick={() => onEdit(user)} 
                                    className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    Editar
                                </button>
                                <button 
                                    onClick={() => onDelete(user.id, user.usuario)} 
                                    className="text-red-600 hover:text-red-900">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);


// --- 4. COMPONENTE PRINCIPAL: AdminUsers ---

const AdminUsers = () => {
    // Estados principales
    const [allUsuarios, setAllUsuarios] = useState([]); // Lista original sin filtrar
    const [isLoading, setIsLoading] = useState(true);
    
    // ESTADOS PARA BÚSQUEDA Y FILTRO
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Todos');

    // ESTADOS PARA MODALES
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // --- Carga Inicial de Usuarios (DAO) ---
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const listaUsuarios = await UsuarioControllerInstance.handleGetUsers(); 
            setAllUsuarios(listaUsuarios);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- LÓGICA DE FILTRADO INSTANTÁNEO (useMemo) ---
    const filteredUsuarios = useMemo(() => {
        let currentUsers = allUsuarios;

        // 1. Filtrar por rol
        if (filterRole !== 'Todos') {
            currentUsers = currentUsers.filter(user => user.rol === filterRole);
        }

        // 2. Filtrar por término de búsqueda (instantáneo)
        if (searchTerm.trim() !== '') {
            const lowerCaseSearch = searchTerm.toLowerCase().trim();
            currentUsers = currentUsers.filter(user => 
                user.usuario.toLowerCase().includes(lowerCaseSearch) ||
                user.rol.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return currentUsers;
    }, [allUsuarios, searchTerm, filterRole]); // Re-calcula solo cuando cambian las dependencias

    // --- LÓGICA CRUD (CQRS/DAO) ---

    // Función unificada que el Modal llama al hacer Submit (Registro o Edición)
    const handleSaveUser = (userData, isNew) => {
        if (isNew) {
            // Flujo: MVC -> CQRS.registerUser -> DAO
            const registeredUser = UsuarioControllerInstance.handleRegisterUser(userData);
            setAllUsuarios(prev => [...prev, registeredUser]); // Actualizar lista original
        } else {
             // Flujo: MVC -> CQRS.editUser -> DAO
            const updatedUser = UsuarioControllerInstance.handleEditUser(userData); 
            // Actualizar lista original en el estado de React
            setAllUsuarios(prev => prev.map(u => 
                u.id === updatedUser.id ? updatedUser : u
            ));
        }
        setShowRegisterModal(false);
        setShowEditModal(false);
        setUserToEdit(null);
    };

    // Abre el modal de edición
    const handleEditClick = (user) => {
        setUserToEdit(user);
        setShowEditModal(true);
    };

    // Lógica de eliminación (MVC -> CQRS -> DAO)
    const handleDeleteClick = (userId, userName) => {
        if (window.confirm(`¿Estás seguro de eliminar al usuario ${userName}? Esta acción es irreversible.`)) {
            try {
                // Flujo: MVC -> CQRS.deleteUser -> DAO
                UsuarioControllerInstance.handleDeleteUser(userId); 
                
                // Actualiza la lista original
                setAllUsuarios(prev => prev.filter(u => u.id !== userId));
            } catch (error) {
                alert("Error al eliminar el usuario.");
                console.error("Error al eliminar:", error);
            }
        }
    };
    
    // --- RENDERIZADO ---
    
    return (
        <div className="space-y-6">
            
            {/* BOTONES Y ENCABEZADO */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">
                    Gestión de Usuarios
                </h2>
                <button 
                    onClick={() => {
                        setUserToEdit(EMPTY_USER_DATA); // Limpiar datos de edición
                        setShowRegisterModal(true); // Abrir modal de registro
                    }} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 shadow-md">
                    + Nuevo Usuario
                </button>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4">
                <input 
                    type="text" 
                    placeholder="Buscar por usuario o rol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Captura el input en tiempo real
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select 
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)} // Captura el rol para filtrar
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="Todos">Todos los roles</option>
                    <option value="Bibliotecario">Bibliotecario</option>
                    <option value="Alumno">Alumno</option>
                </select>
            </div>
            
            {/* Tabla de Usuarios (Muestra la lista FILTRADA) */}
            <TablaUsuarios 
                usuarios={filteredUsuarios} // Pasa la lista filtrada
                isLoading={isLoading} 
                onEdit={handleEditClick} 
                onDelete={handleDeleteClick} 
            />

            {/* MODAL DE REGISTRO (Usa el formulario genérico) */}
            <UserFormModal
                show={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                user={EMPTY_USER_DATA} 
                onSave={handleSaveUser} 
                isNew={true}
            />

            {/* MODAL DE EDICIÓN (Usa el formulario genérico) */}
            {showEditModal && userToEdit && (
                 <UserFormModal 
                    show={showEditModal} 
                    user={userToEdit} // Pasa los datos del usuario a editar
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveUser} 
                    isNew={false}
                 />
            )}
        </div>
    );
};

export default AdminUsers;