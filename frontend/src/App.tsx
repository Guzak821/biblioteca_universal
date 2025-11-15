// src/App.tsx

import React from 'react';
// src/components/Header/Header.tsx
import Header from './header/Header'; 
// src/login/Login.tsx
import Login from './login/Login'; 


const App: React.FC = () => {
  return (
    // Usa un contenedor general para envolver toda la aplicación
    <div className="app-container">
      
      {/* 2. Renderiza la página de Login */}
      <Login />
      
    </div>
  );
};

export default App;