import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import APICall from './components/pages/archivedPages/apiExample';
import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';
import Dashboard from './components/pages/Dashboard';
import Tooling from './components/pages/Tooling';
//import Servicing from './components/pages/Servicing'; 
import Dies from './components/pages/Dies';
import Admin from './components/pages/Admin';
import Login from './components/pages/Login';

import { keepTheme } from './components/layout/themes';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
      keepTheme();
  })
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/app" element={<MainLayout />}>
          {/*<Route path ="/app/apiCallExample" element = {<APICall />} />*/}
          <Route path ="/app/Dashboard" element = {<Dashboard />} />
          <Route path ="/app/Tooling" element = {<Tooling />} />
          <Route path ="/app/Dies/:toolNumber" element = {<Dies />} />
          <Route path ="/app/Admin" element = {<Admin />} />
        </Route>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;