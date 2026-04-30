import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Ticket, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();

    return (
        <aside className="sidebar glass-panel">
            <nav className="nav-menu">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/resources" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <CalendarDays size={20} />
                    <span>Resources & Bookings</span>
                </NavLink>
                <NavLink to="/tickets" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Ticket size={20} />
                    <span>Support Tickets</span>
                </NavLink>
                {user?.role === 'ADMIN' && (
                    <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <ShieldCheck size={20} />
                        <span>Admin Approvals</span>
                    </NavLink>
                )}
            </nav>
            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
