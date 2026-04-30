import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="main-container">
                <Sidebar />
                <main className="content-area glass-panel">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
