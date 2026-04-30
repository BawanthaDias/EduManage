import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, CalendarCheck, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ bookings: 0, tickets: 0 });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Parallel requests for better performance
                const [bookingsRes, ticketsRes] = await Promise.all([
                    api.get(`/bookings/user/${user.id}`),
                    api.get(`/tickets/user/${user.id}`)
                ]);
                
                setStats({ 
                    bookings: bookingsRes.data.length, 
                    tickets: ticketsRes.data.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED').length 
                });

                // Combine and sort for recent activity
                const activities = [
                    ...bookingsRes.data.map(b => ({ type: 'Booking', date: b.date, id: b.id, status: b.status })),
                    ...ticketsRes.data.map(t => ({ type: 'Ticket', date: t.createdAt, id: t.id, status: t.status }))
                ];
                
                activities.sort((a, b) => new Date(b.date) - new Date(a.date));
                setRecentActivity(activities.slice(0, 5));

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };
        if (user) fetchDashboardData();
    }, [user]);

    return (
        <div className="dashboard animate-fade-in">
            <header className="dashboard-header">
                <h2>Welcome back, {user?.name}!</h2>
                <p>Here's what's happening on campus today.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
                        <CalendarCheck size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>My Bookings</h3>
                        <p className="stat-value">{stats.bookings}</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Active Tickets</h3>
                        <p className="stat-value">{stats.tickets}</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary)' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-details">
                        <h3>Role</h3>
                        <p className="stat-value" style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>{user?.role?.toLowerCase()}</p>
                    </div>
                </div>
            </div>
            
            <div className="dashboard-widgets">
                 <div className="widget glass-panel">
                     <h3>Recent Activity</h3>
                     {recentActivity.length === 0 ? (
                         <div className="empty-state">No recent activity found.</div>
                     ) : (
                         <ul className="activity-list">
                             {recentActivity.map((act, idx) => (
                                 <li key={idx} className="activity-item">
                                     <div className="activity-icon">
                                         {act.type === 'Booking' ? <CalendarCheck size={16}/> : <AlertTriangle size={16}/>}
                                     </div>
                                     <div className="activity-info">
                                         <p><strong>{act.type} #{act.id}</strong> - {act.status}</p>
                                         <span>{new Date(act.date).toLocaleString()}</span>
                                     </div>
                                 </li>
                             ))}
                         </ul>
                     )}
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
