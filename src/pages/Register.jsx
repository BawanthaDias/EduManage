import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Auth.css';

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/users/register', formData);
            // Automatically log them in after registration
            login(response.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel animate-fade-in">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join EduManage Campus System</p>

                {error && <div className="alert error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength="6"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
