import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header fijo que permanece en todas las páginas */}
      <AdminHeader />
      
      {/* Contenido dinámico que cambia según la ruta */}
      <main className="w-full px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;