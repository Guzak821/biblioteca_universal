// src/App.tsx

import React from 'react';
// La ruta es relativa a src/, asumiendo esta estructura:
// src/components/Header/Header.tsx
import Header from './header/Header'; 
// src/login/Login.tsx
import Login from './login/Login'; 


const App: React.FC = () => {
  return (
    // Usa un contenedor general para envolver toda la aplicación
    <div className="app-container">
      
      {/* 1. Renderiza el Header */}
      <Header 
        // En la pantalla de login, el header puede ir vacío o mostrar un enlace de registro
        // rightContent={<div><a href="/register">Registrarse</a></div>}
      /> 
      
      {/* 2. Renderiza la página de Login */}
      <Login />
      
    </div>
  );
};

export default App;