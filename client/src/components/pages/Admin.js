import React, { useState, useEffect } from 'react';
import '../layout/style.css';

const Admin = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeId2, setEmployeeId2] = useState('');
  const [queryData, setQueryData] = useState([]);

  const fetchEmployees = async () => {  
      const response = await fetch("/getAllEmployees") 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      
     const result = await response.json() 
     setQueryData(result) 
  }
  useEffect(() => { fetchEmployees(); }, []);

  const handledNewEmployee = async (e) => { 
      e.preventDefault(); 
      if (password === confirmPassword) {
    try {
      const response = await fetch("/createEmployee", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({employee_id: employeeId, first_name: firstName, last_name: lastName, password: password, job_title: jobTitle})
      })
   
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)
      setEmployeeId('');
      setFirstName('');
      setLastName('');
      setJobTitle('');
      setPassword('');
      setConfirmPassword('');
    } 
    catch (error) {
      console.error(error.message)
    }   
    } else {
      setError('Passwords do not match');
      setPassword('');
      setConfirmPassword('');
    }
  } 

  const handleSubmit= async (e) => { 
      e.preventDefault(); 
  
    try {
      const response = await fetch("/lockUnlockEmployee", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({employee_id: employeeId2})
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)
      setEmployeeId2('');
      if (result.message === false) {
        setError2('Employee Disabled')
      } else if (result.message === true) {
        setError2('Employee Enabled')
      } else {
        setError2('Employee not found')
      }

    } 
    catch (error) {
      console.error(error.message)
    }    
  } 
  return (
   <div>
      <h1 className="main-header">Tooling</h1>
      <div className="main-content">
        <div className="table-card">
          {queryData.length > 0 ? (
            <table className="activity-table">
            <thead>
              <tr>
                {Object.keys(queryData[0]).map((key) => (
                  <th key={key}>
                    {key}
                  </th>

                ))}
              </tr>
            </thead>                
            <tbody>
              {queryData.map((die, index) => (
                <tr key={index} className="card">
                  {Object.values(die).map((value, id) => (
                    <td key={id}>
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
          <p>No dies loaded yet.</p>
          )}
        </div>
      </div>

    <div className='main-container' style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className='container'>
            <h2>New Employee</h2> 
            <form onSubmit={handledNewEmployee}>
                <h5>employee ID</h5>
                <input
                type="number"
                placeholder="employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                maxLength={20}
                required
                />

                <h5>First Name</h5>
                <input
                type="text"
                placeholder=""
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={20}
                required
                />

                <h5>Last Name</h5>
                <input
                type="text"
                placeholder=""
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={20}
                required
                />
                
                <h5>Job Title</h5>
                <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)} 
                maxLength={20}
                required
                />

                <h5>Password</h5>
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
                required
                />

                <h5>Confirm Password</h5>
                <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={20}
                required
               /> 

                <button type="submit">Create New Employee</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>

    <div className='second-container' style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className='container'>
            <h2>Disable Employee</h2> 
            <form onSubmit={handleSubmit}>
                <h5>employee ID</h5>
                <input
                type="number"
                placeholder="employee ID"
                value={employeeId2}
                onChange={(e) => setEmployeeId2(e.target.value)}
                maxLength={20}
                required
                />
                <button type="submit">Submit</button>
            </form>
            {error2 && <p className='error'>{error2}</p>}
        </div>
    </div>
    </div>
</div> 
  );
}


export default Admin;