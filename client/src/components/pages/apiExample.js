import React, { useState, useEffect } from 'react';
import Button from '../layout/button.js';

function APICall() {
  const [queryData, setQueryData] = useState()
 
  // const fetchDies = async () => {
  //   const response = await fetch("/getDies")
  //   const result = await response.json()
  //   setQueryData(result)
  //   console.log(result)
  // }

  
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

  return (
      <div>
      <h1>Die Components List </h1>
      <pre>
      <Button onClick={fetchDies}></Button>
      {JSON.stringify(queryData, null, 2)}
      </pre>
      </div> 
  )  
}

export default APICall
