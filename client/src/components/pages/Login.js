import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../layout/style.css';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

    const handleSubmit = async (e) => { 
      e.preventDefault(); 

    try {
      const response = await fetch("/login", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({employee_id: employeeId, password: password})
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.user === true){
        setError('');
        navigate('/app/Dashboard');
      } else {
        setError('Invalid userID or password. Contact admin if you need access.');
      }

    }
        
    catch (error) {
      console.error(error.message)
    }   
  } 
   
  return (
    <div className='main-container' style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className='container'>
            <h2>Tool and Die Management</h2>
            <p>Sign in to access your tool management system</p>
            <form onSubmit={handleSubmit}>
                <h5>Username</h5>
                <input
                type="number"
                placeholder="employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
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
