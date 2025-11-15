// src/components/Header/Header.tsx

import React from 'react';
import './Header.css'; 

// Ajusta la ruta a tu logo. Si el logo está en src/img/, la ruta sería:
import Logo from '../img/logo_biblioteca.png'; 

// 1. DEFINICIÓN DE LA INTERFAZ 
// Esto le dice a TypeScript qué tipo de 'props' acepta el componente.
interface HeaderProps {
  // Una propiedad opcional para personalizar el contenido del lado derecho
  rightContent?: React.ReactNode; 
  // Una propiedad opcional para indicar si el usuario está logeado
  isLoggedIn?: boolean; 
}

// 2. USO DE LA INTERFAZ EN EL COMPONENTE
const Header: React.FC<HeaderProps> = ({ rightContent, isLoggedIn = false }) => {
  return (
    <header className={`header-bar ${isLoggedIn ? 'header-logged-in' : ''}`}>
      
      {/* 1. Sección del Logo (lado izquierdo) */}
      <div className="header-left">
        <img src={Logo} alt="Logo Biblioteca Universal" className="header-logo" />
        <span className="header-title">Biblioteca Universal</span>
      </div>
      
      {/* 2. Sección de Contenido Dinámico (lado derecho) */}
      <div className="header-right">
        {rightContent}
      </div>
    </header>
  );
};

export default Header;