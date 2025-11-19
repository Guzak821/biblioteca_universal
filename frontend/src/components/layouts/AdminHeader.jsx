import { Link, useLocation } from 'react-router-dom';

const AdminHeader = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'HOME', path: '/admin' },
    { name: 'USERS', path: '/admin/users' },
    { name: 'BOOKS', path: '/admin/books' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-700 shadow-md">
      <nav className="w-full px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-2">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-[8px] text-center leading-tight">
                  BIBLIOTECA<br/>DIGITAL
                </span>
              </div>
              <div className="text-white">
                <div className="text-lg font-bold tracking-wide">BIBLIOTECA</div>
                <div className="text-sm font-light">DIGITAL</div>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;