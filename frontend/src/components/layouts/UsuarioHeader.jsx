import { Link, useLocation, useNavigate } from 'react-router-dom';

const UsuarioHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'HOME', path: '/usuario' },
    { name: 'BOOKS', path: '/usuario/books' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de logout (limpiar tokens, etc.)
    console.log('Cerrando sesión...');
    // Redirigir al login o página principal
    navigate('/login');
  };

  return (
    <header className="bg-gray-700 shadow-md">
      <nav className="w-full px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-2">
            <Link to="/usuario" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center shadow-lg">
                 <img
                src="/img/logo_biblioteca.png" 
                alt="Logo de la Biblioteca Digital"
                className="w-30 h-12 object-contain shadow-lg" // Clases para ajustar tamaño y estilo
              />
              </div>
              <div className="text-white">
                <div className="text-lg font-bold tracking-wide">BIBLIOTECA</div>
                <div className="text-sm font-light">DIGITAL</div>
              </div>
            </Link>
          </div>

          {/* Navigation Items y Logout */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-2 text-sm font-medium transition-colors duration-200 rounded ${
                  isActive(item.path)
                    ? 'text-white bg-gray-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Botón de Logout */}
            <button
              onClick={handleLogout}
              className="ml-4 px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors duration-200"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default UsuarioHeader;