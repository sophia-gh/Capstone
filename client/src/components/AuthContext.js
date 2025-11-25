import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const login = () => { setIsLoggedIn(true); }
    const logout = () => { setIsLoggedIn(false); }
    const [jobTitle, setJobTitle] = useState('');
    
    return (
        <AuthContext value={{ isLoggedIn, login, logout, jobTitle, setJobTitle }}>
           {children}
        </AuthContext>
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
}

