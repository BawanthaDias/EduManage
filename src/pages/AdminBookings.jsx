import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import './AdminBookings.css';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings');
            // Sort to show pending first, then by date
            const sorted = response.data.sort((a, b) => {
                if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
                return new Date(b.date) - new Date(a.date);
            });
            setBookings(sorted);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status?status=${status}`);
            fetchBookings(); // Refresh list after update
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update booking status.");
        }
    };

    return (
        <div className="admin-bookings animate-fade-in">
            <div className="page-header">
                <h2>Booking Approvals (Admin)</h2>
            </div>

            {loading ? (
                <div className="loading">Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="empty-state glass-panel">No bookings found.</div>
            ) : (
                <div className="table-container glass-panel">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Resource</th>
                                <th>Date & Time</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>#{booking.id}</td>
                                    <td>{booking.userName}</td>
                                    <td>{booking.resourceName}</td>
                                    <td>
                                        {booking.date} <br/>
                                        <span className="text-sm text-secondary">{booking.startTime} - {booking.endTime}</span>
                                    </td>
                                    <td>{booking.purpose} ({booking.attendees} pax)</td>
                                    <td>
                                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        {booking.status === 'PENDING' && (
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-icon text-success" 
                                                    title="Approve"
                                                    onClick={() => updateStatus(booking.id, 'APPROVED')}
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button 
                                                    className="btn-icon text-danger" 
                                                    title="Reject"
                                                    onClick={() => updateStatus(booking.id, 'REJECTED')}
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
