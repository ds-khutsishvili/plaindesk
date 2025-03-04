import React from 'react';
import './Header.css';

const Header = ({ onAddWidget }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <div className="app-logo">
          <span>Plaindesk</span>
          <button className="theme-toggle">
            <i className="theme-icon">☀</i>
          </button>
        </div>
      </div>
      
      <div className="header-center">
        <div className="navigation">
          <button className="nav-button"><i className="nav-icon">←</i></button>
          <button className="nav-button"><i className="nav-icon">→</i></button>
          <button className="nav-button"><i className="nav-icon">↻</i></button>
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">Иван Иванов</span>
          <div className="user-avatar"></div>
          <button className="settings-button">
            <i className="settings-icon">⚙</i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 