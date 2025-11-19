// src/pages/Admin/AdminUsers.jsx
import React from 'react';

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Gestión de Usuarios
        </h2>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 shadow-md">
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
          <option>Admin</option>
          <option>Estándar</option>
        </select>
      </div>
      
      {/* Placeholder de la Tabla */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Tabla de Usuarios (Cargando...)
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded">
          Aquí irá tu componente de tabla de usuarios, paginación y acciones.
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;