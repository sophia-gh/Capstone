import React, { useState, useEffect } from 'react';
import Button from './button.js';
import { useNavigate } from 'react-router-dom';

function APICall() {
  const [queryData, setQueryData] = useState()
  const navigate = useNavigate();

  const fetchDies = async (e) => {
  // dieQuery is example information to be sent to flask route and used to query database
  const dieQuery = {
    company: "",
    tool_number: "607636044-5",
    in_production: "" 
  }
    try {
      const response = await fetch("/getComponentsForDie", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(dieQuery)
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setQueryData(result)
} 
    catch (error) {
      console.error(error.message)
    }   
  } 
  
  const logOut = async () => {
    try {
      const response = await fetch("/logout")
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result.message) 
      navigate('/')
    } 
    catch (error) {
      console.error(error.message)
    }
  }

return (
    <div>
    <h1>Die Components List </h1>
    <pre>
    <Button onClick={fetchDies}></Button>
    {JSON.stringify(queryData, null, 2)}
    </pre>
    <h2>Log Out</h2>
    <Button onClick={logOut}>Log Out</Button>
      </div> 
  )  
}

export default APICall
