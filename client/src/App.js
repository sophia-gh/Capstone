import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import APICall from './components/pages/apiExample';
import MainLayout from './components/layout/MainLayout';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './components/pages/Dashboard';
import Components from './components/pages/Components';
import Login from './components/pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path ="/app/apiCallExample" element = {<APICall />} />
          <Route path ="/app/Dashboard" element = {<Dashboard />} />
          <Route path ="/app/Components" element = {<Components />} />
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

      {(typeof data.members === 'undefined') ? (
        <p>Loading...</p>
      ) : ( 
        data.members.map((member, i) => (
          <p key ={i}> {member}</p>
        ))
        
      )}
      
    </div>
  )
}

export default App */