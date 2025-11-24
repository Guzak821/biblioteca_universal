import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout';
import UsuarioLayout from '../components/layouts/UsuarioLayout';

// Páginas Admin
import AdminHome from '../pages/Admin/Home';
import AdminUsers from '../pages/Admin/Users';
import AdminBooks from '../pages/Admin/Books';

// Páginas Usuario
import UsuarioHome from '../pages/usuario/Home';
import UsuarioBooks from '../pages/usuario/Books';
import Login from '../../src/pages/login/Login'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login */ }
        <Route path="/login" element={<Login />}>
        </Route>

        {/* Rutas de Admin con layout compartido */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="books" element={<AdminBooks />} />
        </Route>

        {/* Rutas de Usuario con layout compartido */}
        <Route path="/usuario" element={<UsuarioLayout />}>
          <Route index element={<UsuarioHome />} />
          <Route path="books" element={<UsuarioBooks />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/usuario" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;