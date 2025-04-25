import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">Sistema de Gerenciamento de Dados Climáticos TempInfo &copy; {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;