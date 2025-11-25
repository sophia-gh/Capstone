 import React from 'react';
 import { useNavigate } from 'react-router-dom';
 import './style.css';

    function LogoutButton({text}) {

        const navigate = useNavigate();
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
            <button className='headerIconButton' onClick={logOut}>
                {text}
            </button>
        );
    }

    export { LogoutButton };