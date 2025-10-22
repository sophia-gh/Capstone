import React from 'react'
import { NavLink } from "react-router-dom";
import { FiBell, FiUser } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import './style.css';
import logo from '../../assets/Superb_logo.png'

const MainLayout = () => {
    return (
        <div className="main-container">
            <aside className="sidebar">
                <h1 className="sidebar-title">Navigation</h1>
                <nav>
{/*                    <NavLink to="/app" end className="sidebar-link">Home</NavLink> 
                    <NavLink to="/app/apiCallExample" className="sidebar-link">APICall</NavLink> */}
                    <NavLink to="/app/Dashboard" className="sidebar-link">Dashboard</NavLink>
                    <NavLink to="/app/Inventory" className="sidebar-link">Inventory</NavLink>
                    <NavLink to="/app/Components" className="sidebar-link">Components</NavLink>
                    <NavLink to="/app/Servicing" className="sidebar-link">Servicing</NavLink>
                    <NavLink to="/app/Admin" className="sidebar-link">Admin</NavLink>

                </nav>
            </aside>

            <div className="content-area">
                <header className="top-header">
                    <img src={logo} alt="superb-logo" className="logo"/>
                    <h1 className="system-title">Tool and Die Inventory</h1>
                    <div className="header-icons">
                        <FiBell className="icon" />
                        <FiUser className="icon" />
                    </div>
                </header>

                {/* Main Page Content */}
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;