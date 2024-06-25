// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file for styles

const Login = ({ setRole, onNavigate, setUsername }) => {
  const [username, setUsernameLocal] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://127.0.0.1:8000/logins/');
      console.log('API response:', response.data);
      
      const user = response.data.logins.find(u => u.username === username && u.password === password);
      if (user) {
        setRole(user.role);
        setUsername(user.username);
        if (user.role === 'Admin') {
          onNavigate('employee');
        } else {
          onNavigate('assigned-projects');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error logging in');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsernameLocal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='loginscreen' type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
