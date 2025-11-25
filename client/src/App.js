import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import APICall from './components/pages/archivedPages/apiExample';
import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';
import Dashboard from './components/pages/Dashboard';
import Tooling from './components/pages/Tooling';
//import Servicing from './components/pages/Servicing'; 
import Dies from './components/pages/Dies';
import Admin from './components/pages/Admin';
import Login from './components/pages/Login';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';

import { keepTheme } from './components/layout/themes';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
      keepTheme();
  })
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}/>
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path ="/Dashboard" element = {<Dashboard />} />
            <Route path ="/Tooling" element = {<Tooling />} />
            <Route path ="/Dies/:toolNumber" element = {<Dies />} />
            <Route path ="/Admin" element = {<Admin />} />
          </Route>
          </Routes>
      <Footer/>
    </Router>
    </AuthProvider>
  );
}

export default App;