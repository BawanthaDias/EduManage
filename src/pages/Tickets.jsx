import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, X, Upload } from 'lucide-react';
import './Tickets.css';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Tickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticketData, setTicketData] = useState({
        category: '',
        description: '',
        priority: 'LOW'
    });
    const [images, setImages] = useState([]);
    const [submitMessage, setSubmitMessage] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, [user.id]);

    const fetchTickets = async () => {
        try {
            const response = await api.get(`/tickets/user/${user.id}`);
            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        setSubmitMessage(null);
        setTicketData({ category: '', description: '', priority: 'LOW' });
        setImages([]);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            if (e.target.files.length > 3) {
                alert("Maximum 3 images allowed");
                return;
            }
            setImages(Array.from(e.target.files));
        }
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('userId', user.id);
            formData.append('category', ticketData.category);
            formData.append('description', ticketData.description);
            formData.append('priority', ticketData.priority);
            
            images.forEach(img => {
                formData.append('images', img);
            });

            await api.post('/tickets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setSubmitMessage({ type: 'success', text: 'Ticket created successfully!' });
            fetchTickets(); // refresh list
            setTimeout(() => closeModal(), 2000);
        } catch (error) {
            setSubmitMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to create ticket' 
            });
        }
    };

    return (
        <div className="tickets-page animate-fade-in">
            <div className="page-header">
                <h2>Support Tickets</h2>
                <button className="btn btn-primary" onClick={openModal}>
                    <Plus size={16} /> New Ticket
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading tickets...</div>
            ) : tickets.length === 0 ? (
                <div className="empty-state glass-panel">No tickets found. You're all caught up!</div>
            ) : (
                <div className="tickets-list">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="ticket-item glass-panel">
                            <div className="ticket-main">
                                <div className="ticket-header">
                                    <span className="ticket-id">#{ticket.id}</span>
                                    <h3>{ticket.category}</h3>
                                </div>
                                <p className="ticket-desc">{ticket.description}</p>
                                <div className="ticket-meta">
                                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                                    <span className={`status-badge ${ticket.status.toLowerCase()}`}>{ticket.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="ticket-actions">
                                <button className="btn btn-secondary">
                                    <MessageSquare size={16} /> View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Ticket Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel animate-fade-in">
                        <button className="close-btn" onClick={closeModal}><X size={20} /></button>
                        <h3>Raise a Support Ticket</h3>
                        
                        {submitMessage && (
                            <div className={`alert ${submitMessage.type}`}>
                                {submitMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleTicketSubmit} className="ticket-form">
                            <div className="form-group">
                                <label>Category</label>
                                <select 
                                    className="input-field" 
                                    required
                                    value={ticketData.category}
                                    onChange={e => setTicketData({...ticketData, category: e.target.value})}
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="IT Support">IT Support</option>
                                    <option value="Housekeeping">Housekeeping</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    className="input-field" 
                                    rows="4"
                                    required
                                    placeholder="Describe the issue in detail..."
                                    value={ticketData.description}
                                    onChange={e => setTicketData({...ticketData, description: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select 
                                    className="input-field" 
                                    value={ticketData.priority}
                                    onChange={e => setTicketData({...ticketData, priority: e.target.value})}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Attach Images (Max 3)</label>
                                <div className="file-upload-wrapper">
                                    <input 
                                        type="file" 
                                        id="file-upload" 
                                        multiple 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file-upload" className="btn btn-secondary file-upload-btn">
                                        <Upload size={16} /> Choose Files
                                    </label>
                                    <span className="file-count">
                                        {images.length > 0 ? `${images.length} file(s) selected` : 'No files selected'}
                                    </span>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Submit Ticket
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tickets;
