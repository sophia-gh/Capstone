import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../layout/style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === 'admin@example.com' && password === 'password') {
      setError('');
      navigate('/app');
    } else {
      setError('Invalid email or password. Contact admin if you need access.');
    }
  };

  return (
    <div className='main-container' style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className='container'>
            <h2>Tool and Die Management</h2>
            <p>Sign in to access your tool management system</p>
            <form onSubmit={handleSubmit}>
                <h5>Username</h5>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <h5>Password</h5>
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    </div>
  );
};

export default Login;
