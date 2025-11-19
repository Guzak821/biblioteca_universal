import React, { useState } from 'react';
import './login.css'; 

import Logo from '../../img/logo_biblioteca.png'; 

const Login: React.FC = () => {
  // Estado para manejar los valores de los campos
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Usuario:', username);
    console.log('Contraseña:', password);
    
    alert('Intentando iniciar sesión con Usuario: ' + username);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        
        {/* Logo */}
        <div className="logo-section">
          <img src={Logo} alt="Logo Biblioteca Universal" className="logo" />
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          
          {/* Campo de Usuario */}
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: user1"
              required
            />
          </div>
          
          {/* Campo de Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ej: 123456"
              required
            />
          </div>
          
          {/* Botón de Iniciar Sesión */}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;