import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';  
   
const ProtectedRoute = ({ children }) => {
  const authenticate = useAuth();
  const location = useLocation();
  console.log(authenticate)
  if (authenticate.isLoggedIn === false) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

