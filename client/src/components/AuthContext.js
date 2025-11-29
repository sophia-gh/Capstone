import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const login = () => { setIsLoggedIn(true); }
    const logout = () => { setIsLoggedIn(false); }
    const [jobTitle, setJobTitle] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("/currentUser");
                const data = await response.json();

                if (data.user !== false) {
                    setIsLoggedIn(true);
                    setJobTitle(data.job_title);
                }
            } catch (e) {
                console.error("Session check failed", e);
            }
        setLoading(false);
        };
        checkSession();
    }, []);

    if (loading) return null;

    return (
        <AuthContext value={{ isLoggedIn, login, logout, jobTitle, setJobTitle }}>
           {children}
        </AuthContext>
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
}

