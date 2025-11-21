import { Outlet } from 'react-router-dom';
import UsuarioHeader from './UsuarioHeader';

const UsuarioLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header fijo que permanece en todas las páginas */}
      <UsuarioHeader />
      
      {/* Contenido dinámico que cambia según la ruta */}
      <main className="w-full px-80 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UsuarioLayout;