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
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');

  const fetchEmployees = async () => {  
      const response = await fetch("/getAllEmployees") 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      
     const result = await response.json() 
     setQueryData(result) 
  }
  useEffect(() => { fetchEmployees(); }, []);

  const handleNewEmployee = async (e) => { 
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
      if(result.message === 'Employee created successfully') {
        alert("Employee added!");
        setShowAddModal(false);
        fetchEmployees();
      }
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
        alert("Employee Disabled");
      } else if (result.message === true) {
        setError2('Employee Enabled')
        alert("Employee Enabled");
      } else if (result.message === 'Cannot lock/unlock your own account') {
        setError2('Cannot lock/unlock your own account')
        alert("Cannot lock/unlock your own account");
      } else {
        setError2('Employee not found')
        alert("Employee not found");
      }
      fetchEmployees();

    } 
    catch (error) {
      console.error(error.message)
    }    
  } 

  useEffect(() => {
    const clearOnClick = () => setError2('');
    window.addEventListener("click", clearOnClick);

    return () => window.removeEventListener("click", clearOnClick);
}, []);

const handleNewPassword = async (e) => { 
      e.preventDefault(); 
      if (newPassword === confirmNewPassword) {
    try {
      const response = await fetch("/newPassword", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({employee_id: selectedEmployee.employee_id, new_password: newPassword})
      })
   
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)
      setEmployeeId('');
      setNewPassword('');
      setConfirmNewPassword('');
      if(result.message === 'New password set successfully') {
        alert("Password set!");
      } else {
        alert("Error setting password.");
      }
    } 
    catch (error) {
      console.error(error.message)
    }   
    } else {
      setError('Passwords do not match');
      setEmployeeId('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  } 

  const handleEditProfile = async (e) => { 
      e.preventDefault(); 
    try {
      const response = await fetch("/updateEmployee", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({first_name: newFirstName, last_name: newLastName, job_title: newJobTitle, employee_id: selectedEmployee.employee_id})
      })
   
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)
      setEmployeeId('');
      setNewFirstName('');
      setNewLastName('');
      setNewJobTitle('');
      if(result.message === 'Employee profile edited successfully') {
        alert("Profile edited!");
      } else if (result.message === 'Cannot edit your own profile'){
        alert("Cannot edit your own profile");
      } else {
        alert("Error editing profile.");
      }
      fetchEmployees();
    } 
    catch (error) {
      console.error(error.message)
    }   
  } 

  return (
   <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem"
      }}>

        <h1 className="main-header">Employees</h1>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          + Add Employee
        </button>

      </div>
      <div className="main-content">
        <div className="table-card">
          {queryData.length > 0 ? (
            <table className="activity-table">
            <thead>
              <tr>
                {/*
                {Object.keys(queryData[0])
                  .filter((key) => key !== "password")
                  .map((key) => (
                    <th key={key}>{key}</th>
                ))}*/}
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Job Title</th>
                <th>Employed</th>
                <th>Actions</th>
              </tr>
            </thead>                
            <tbody>
              {queryData.map((employee, index) => (
                <tr key={index} className="card">
                  <td>{employee.employee_id}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.job_title}</td>
                  <td>{employee.employed ? "Active" : "Disabled"}</td>

                 <td>
                    <button className="actions-btn" onClick={() => {
                        setSelectedEmployee(employee);
                        setActiveTab("profile");
                        setShowActionsModal(true);
                      }}>
                      ⋮
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          ) : (
          <p>No employees loaded yet.</p>
          )}
        </div>
      </div>

    {showAddModal && (
    <div className= "modal-overlay">
        <div className="modal-card">
            <h2>New Employee</h2> 
            <form onSubmit={handleNewEmployee}>
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

                <div className="modal-actions">
                <button type="button" className="cancel" onClick={() => setShowAddModal(false)}>
                Cancel
                </button>

                <button type="submit" >Create New Employee</button>
              </div>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    </div>
    )}

    {showActionsModal && (
      <div className="modal-overlay">
        <div className="modal-card" style={{ width: "400px", display: "flex", flexDirection: "column", position: "relative" }}>
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h2>{selectedEmployee.first_name} {selectedEmployee.last_name}</h2>
            <button className="cancelX" onClick={() => setShowActionsModal(false)}>✕</button>
          </div>

          <div className="employee-tabs">
            <button className={activeTab === "profile" ? "active" : ""}
             onClick={() => setActiveTab("profile")}>
              Profile
            </button>
            <button className={activeTab === "edit" ? "active" : ""} onClick={() => setActiveTab("edit")}>
              Edit
            </button>
            <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
              Password
            </button>
            <button className={activeTab === "status" ? "active" : ""} onClick={() => setActiveTab("status")}>
              Status
            </button>
          </div>

          <div className="employee-tab-content" style={{ marginTop: "1rem" }}>
            {activeTab === "profile" && (
              <div>
                <p><strong>ID:</strong> {selectedEmployee.employee_id}</p>
                <p><strong>Name:</strong> {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                <p><strong>Job Title:</strong> {selectedEmployee.job_title}</p>
                <p><strong>Status:</strong> {selectedEmployee.employed ? "Active" : "Disabled"}</p>
              </div>
            )}

            {activeTab === "edit" && (
              <div>
                <h3>Edit Employee</h3>
                  <form onSubmit={handleEditProfile}>
                    {/* 
                  <h5>employee ID</h5>
                  <input
                  type="number"
                  placeholder=""
                  value={selectedEmployee.employee_id}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  maxLength={20}
                  required
                  />*/}

                  <h5>First Name</h5>
                  <input
                  type="text"
                  placeholder={selectedEmployee.first_name}
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  maxLength={20}
                  required
                  />

                  <h5>Last Name</h5>
                  <input
                  type="text"
                  placeholder={selectedEmployee.last_name}
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  maxLength={20}
                  required
                  />
                  
                  <h5>Job Title</h5>
                  <select className="filter"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  required
                  >
                    <option value="">Select new job title</option>
                    <option value="admin">Admin</option>
                    <option value="tool_manager">Tool Manager</option>
                    <option value="press_tech">Press Tech</option>
                    <option value="engineer">Engineer</option>
                    <option value="tool_maker">Tool Maker</option>
                  </select>

                  <div className="modal-actions">
                  <button type="submit" >Edit Profile</button>
                </div>
              </form>
              {error && <p className='error'>{error}</p>}
          </div>
            )}

            {activeTab === "password" && (
              <div>
                <h3>Reset Password</h3>
                <form onSubmit={handleNewPassword}>
                  <p><strong>ID:</strong> {selectedEmployee.employee_id}</p>
                  <h5>New Password</h5>
                  <input
                    type="password" 
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    maxLength={20}
                    required
                  />
                  <h5>Confirm New Password</h5>
                  <input
                    type="password"   
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}    
                    maxLength={20}
                    required
                  />
                  <div className="modal-actions" style={{ marginTop: "1rem" }}>
                    <button type="submit">Set New Password</button>
                  </div>
                  {error && <p className='error'>{error}</p>}
                </form>
              </div>
            )}

            {activeTab === "status" && (
              <div>
                <h3>Enable/Disable Employee</h3>
                <p>
                  This account is currently:{" "}
                  <strong>{selectedEmployee.employed ? "Active" : "Disabled"}</strong>
                </p>
                <button type="button" style={{ marginTop: "1rem" }} onClick={(e) => {
                    setEmployeeId2(selectedEmployee.employee_id);
                    handleSubmit(e); 
                }}>
                  {selectedEmployee.employed ? "Disable" : "Enable"} Employee
                  
                </button>

                {error2 && <p className="message">{error2}</p>}
              </div>
            )}

          </div>
        </div>
      </div>
    )}
    </div>  
  );
};  



export default Admin;