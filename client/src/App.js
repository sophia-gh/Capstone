import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import APICall from './components/pages/apiExample';
import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';
import Dashboard from './components/pages/Dashboard';
import Tooling from './components/pages/Tooling';
import Dies from './components/pages/Dies';
import Admin from './components/pages/Admin';
import Login from './components/pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/app" element={<MainLayout />}>
          <Route path ="/app/apiCallExample" element = {<APICall />} />
          <Route path ="/app/Dashboard" element = {<Dashboard />} />
          <Route path ="/app/Tooling" element = {<Tooling />} />
          <Route path ="/app/Tooling/Dies" element = {<Dies />} />
          <Route path ="/app/Admin" element = {<Admin />} />
        </Route>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;

// intial tutorial app function
/* 
function App() {

  const [data, setData] = useState([{}])

  useEffect(() => {
      fetch("/members").then (
        res => res.json()
      ).then (
          data => {
            setData(data)
            console.log(data)
          }
      )
  }, []) //only runs once

  return (
    <div>
      <h1>Die List</h1>
      <pre>
      <Button onClick={fetchData}></Button>
      {JSON.stringify(queryData, null, 2)}
      </pre>
    </div>
  )
}

export default App */