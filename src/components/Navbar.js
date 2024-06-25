// src/components/Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = ({ role, onNavigate }) => {
  const handleLogout = () => {
    onNavigate('logout');
  };

  return (
    <nav>
      <ul className='navbar'>
        {!role && (
          <>
            <li><button onClick={() => onNavigate('welcome')}>Tracker</button></li>
            <li><button onClick={() => onNavigate('contact')}>Contact</button></li>
            <li><button onClick={() => onNavigate('about')}>About</button></li>
            <li onClick={() => onNavigate('login')}>
              <button className='login-button'>Login</button>
            </li>
          </>
        )}
        {role === 'Admin' && (
          <>
            <li><button onClick={() => onNavigate('employee')}>Employee</button></li>
            <li><button onClick={() => onNavigate('projects')}>Project</button></li>
            <li><button onClick={() => onNavigate('statistics')}>Statistics</button></li>
          </>
        )}
        {role === 'Employee' && (
          <>
            <li><button onClick={() => onNavigate('assigned-projects')}>Assigned Projects</button></li>
          </>
        )}
        {role && (
          <li className="logout-button" onClick={handleLogout}>
            <button>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
