import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Map, Thermometer, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <Cloud size={24} />
          <span>TempInfo</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>
              <Cloud size={18} />
              <span>Painel</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/locations" className={`nav-link ${isActive('/locations')}`} onClick={closeMenu}>
              <Map size={18} />
              <span>Locais</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/temperatures" className={`nav-link ${isActive('/temperatures')}`} onClick={closeMenu}>
              <Thermometer size={18} />
              <span>Temperaturas</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;