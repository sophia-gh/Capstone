import React, { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import { FiBell, FiUser } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import {LogoutButton} from './logoutButton.js';
import './style.css';
import logo from '../../assets/Superb_logo.png'

const MainLayout = () => {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <div className="main-container">
            <aside className="sidebar">
                <h1 className="sidebar-title">Navigation</h1>
                <nav>
                    {/* ARCHIVED!!! <NavLink to="/app/apiCallExample" className="sidebar-link">APICall</NavLink> */}
                    <NavLink to="/app/Dashboard" className="sidebar-link">Dashboard</NavLink>
                    <NavLink to="/app/Tooling" className="sidebar-link">Tooling</NavLink>
                    <NavLink to="/app/Admin" className="sidebar-link">Admin</NavLink>

                </nav>
            </aside>

            <div className="content-area">
                <header className="top-header">
                    <img src={logo} alt="superb-logo" className="logo"/>
                    <h1 className="system-title">Tool and Die Inventory</h1>
                    <div className="header-icons">
                            <div className="user-container">
                            <button className='headerIconButton' onClick={() => setShowModal(showModal ? false : true)}>
                              <FiUser className="icon" />
                            </button>

                            {showModal && (
                            <div className="logout-popup">
                                <LogoutButton text="Log Out" />
                            </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Page Content */}
                <main className="main-content">
                    <div id="modal-root"></div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;