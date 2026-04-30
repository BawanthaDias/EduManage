import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users as UsersIcon, X } from 'lucide-react';
import './Resources.css';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Resources = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [bookingData, setBookingData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1
    });
    const [bookingMessage, setBookingMessage] = useState(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await api.get('/resources');
            setResources(response.data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
        setBookingMessage(null);
        setBookingData({ date: '', startTime: '', endTime: '', purpose: '', attendees: 1 });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResource(null);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                userId: user.id,
                resourceId: selectedResource.id,
                ...bookingData
            };
            await api.post('/bookings', payload);
            setBookingMessage({ type: 'success', text: 'Booking request submitted successfully!' });
            setTimeout(() => closeModal(), 2000);
        } catch (error) {
            setBookingMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to submit booking'
            });
        }
    };

    return (
        <div className="resources-page animate-fade-in">
            <div className="page-header">
                <h2>Campus Resources</h2>
                {/* <button className="btn btn-primary">Book a Resource</button> */}
            </div>

            {loading ? (
                <div className="loading">Loading resources...</div>
            ) : (
                <div className="resources-grid">
                    {resources.map(resource => (
                        <div key={resource.id} className="resource-card glass-panel">
                            <div className="card-header">
                                <h3>{resource.name}</h3>
                                <span className={`status-badge ${resource.status.toLowerCase()}`}>
                                    {resource.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="info-row">
                                    <MapPin size={16} /> <span>{resource.location}</span>
                                </div>
                                {resource.capacity > 0 && (
                                    <div className="info-row">
                                        <UsersIcon size={16} /> <span>Capacity: {resource.capacity}</span>
                                    </div>
                                )}
                            </div>
                            <div className="card-actions">
                                <button
                                    className="btn btn-secondary"
                                    disabled={resource.status !== 'ACTIVE'}
                                    onClick={() => openModal(resource)}
                                >
                                    <Calendar size={16} /> Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel animate-fade-in">
                        <button className="close-btn" onClick={closeModal}><X size={20} /></button>
                        <h3>Book {selectedResource?.name}</h3>

                        {bookingMessage && (
                            <div className={`alert ${bookingMessage.type}`}>
                                {bookingMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleBookingSubmit} className="booking-form">
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    required
                                    value={bookingData.date}
                                    onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        className="input-field"
                                        required
                                        value={bookingData.startTime}
                                        onChange={e => setBookingData({ ...bookingData, startTime: e.target.value + ':00' })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        className="input-field"
                                        required
                                        value={bookingData.endTime}
                                        onChange={e => setBookingData({ ...bookingData, endTime: e.target.value + ':00' })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Purpose</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Club Meeting"
                                    required
                                    value={bookingData.purpose}
                                    onChange={e => setBookingData({ ...bookingData, purpose: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Number of Attendees</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    min="1"
                                    max={selectedResource?.capacity || 100}
                                    required
                                    value={bookingData.attendees}
                                    onChange={e => setBookingData({ ...bookingData, attendees: parseInt(e.target.value) })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resources;
