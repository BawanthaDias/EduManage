import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="navbar glass-panel">
            <div className="navbar-brand">
                <h1>EduManage</h1>
                <span className="badge">Beta</span>
            </div>
            <div className="navbar-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                </button>
                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
