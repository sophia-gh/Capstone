import React, { useEffect, useState } from 'react';
import { setTheme } from './themes';

function Toggle({ onModeChange }) {
    const [togClass, setTogClass] = useState('dark');
    let theme = localStorage.getItem('theme');

    const handleOnClick = () => {
        if (localStorage.getItem('theme') === 'theme-dark') {
            setTheme('theme-light');
            setTogClass('light')
            onModeChange?.("light");
        } else {
            setTheme('theme-dark');
            setTogClass('dark')
            onModeChange?.("dark");
        }
    }

    useEffect(() => {
        if (localStorage.getItem('theme') === 'theme-dark') {
            setTogClass('dark')
            onModeChange?.("dark");
        } else if (localStorage.getItem('theme') === 'theme-light') {
            setTogClass('light')
            onModeChange?.("light");
        }
    }, [theme, onModeChange])

    return (
        <div className="container-toggle">
            {
                togClass === "light" ?
                <input type="checkbox" id="toggle" className="toggle-checkbox" onClick={handleOnClick} checked />
                :
                <input type="checkbox" id="toggle" className="toggle-checkbox" onClick={handleOnClick} />
            }
            <label htmlFor="toggle" className="toggle-label">
                <span className="toggle-label-background"></span>
            </label>
        </div>
    )
}

export default Toggle;