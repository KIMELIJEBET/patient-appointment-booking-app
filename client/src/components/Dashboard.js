import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [showBookModal, setShowBookModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [formData, setFormData] = useState({
        doctorName: '',
        date: '',
        time: '',
        reason: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user: authUser, token, logout } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (authUser) {
            setUser(authUser);
            fetchAppointments(token);
        }
        setLoading(false);
    }, [token, navigate, authUser]);

    const fetchAppointments = async (token) => {
        try {
            const response = await fetch('http://localhost:3000/api/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (err) {
            console.log('Could not fetch appointments');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/appointments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appointment: formData }),
            });

            if (response.ok) {
                const newAppointment = await response.json();
                setAppointments([...appointments, newAppointment]);
                setShowBookModal(false);
                setFormData({ doctorName: '', date: '', time: '', reason: '' });
            } else {
                setError('Failed to book appointment');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleEditAppointment = (appointment) => {
        setEditingAppointment(appointment);
        setFormData({
            doctorName: appointment.doctor_name,
            date: appointment.date.split(' ')[0],
            time: appointment.time,
            reason: appointment.reason,
        });
        setShowEditModal(true);
    };

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/api/appointments/${editingAppointment.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appointment: formData }),
            });

            if (response.ok) {
                const updatedAppointment = await response.json();
                setAppointments(appointments.map(apt => apt.id === editingAppointment.id ? updatedAppointment : apt));
                setShowEditModal(false);
                setEditingAppointment(null);
                setFormData({ doctorName: '', date: '', time: '', reason: '' });
            } else {
                setError('Failed to update appointment');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setAppointments(appointments.filter(apt => apt.id !== appointmentId));
            }
        } catch (err) {
            setError('Failed to delete appointment');
        }
    };

    const scrollToAppointments = () => {
        const element = document.querySelector('.appointments-list');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const upcomingAppointments = appointments.filter(apt => new Date(apt.date) >= new Date());
    const pastAppointments = appointments.filter(apt => new Date(apt.date) < new Date());

    return (
        <div className="dashboard-container">
            <nav className="dashboard-navbar">
                <div className="dashboard-logo">♥ HealthBook</div>
                <div className="user-menu">
                    <button className="profile-button" onClick={() => setShowProfile(!showProfile)}>
                        👤 {user.name}
                    </button>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {showProfile && (
                <div className="profile-popup">
                    <div className="profile-content">
                        <h3>User Profile</h3>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <button className="close-btn" onClick={() => setShowProfile(false)}>Close</button>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Welcome back, {user.name}! 👋</h1>
                    <p>Manage your healthcare appointments efficiently</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                            <p className="stat-number">{upcomingAppointments.length}</p>
                            <p className="stat-label">Upcoming</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <p className="stat-number">{pastAppointments.length}</p>
                            <p className="stat-label">Completed</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <p className="stat-number">{appointments.length}</p>
                            <p className="stat-label">Total</p>
                        </div>
                    </div>
                </div>

                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="action-buttons">
                        <button className="action-button primary" onClick={() => setShowBookModal(true)}>
                            + Book New Appointment
                        </button>
                        <button className="action-button secondary" onClick={scrollToAppointments}>
                            📋 View All Appointments
                        </button>
                    </div>
                </section>

                {upcomingAppointments.length > 0 && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Upcoming Appointments</h2>
                            <span className="badge">{upcomingAppointments.length}</span>
                        </div>
                        <div className="appointments-list">
                            {upcomingAppointments.map(apt => (
                                <div key={apt.id} className="appointment-card upcoming">
                                    <div className="appointment-header">
                                        <h3>Dr. {apt.doctor_name}</h3>
                                        <span className="appointment-date">{formatDate(apt.date)}</span>
                                    </div>
                                    <div className="appointment-details">
                                        <p><strong>Time:</strong> {apt.time}</p>
                                        <p><strong>Reason:</strong> {apt.reason}</p>
                                    </div>
                                    <div className="appointment-actions">
                                        <button className="edit-btn" onClick={() => handleEditAppointment(apt)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteAppointment(apt.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {pastAppointments.length > 0 && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Past Appointments</h2>
                            <span className="badge secondary">{pastAppointments.length}</span>
                        </div>
                        <div className="appointments-list">
                            {pastAppointments.map(apt => (
                                <div key={apt.id} className="appointment-card past">
                                    <div className="appointment-header">
                                        <h3>Dr. {apt.doctor_name}</h3>
                                        <span className="appointment-date">{formatDate(apt.date)}</span>
                                    </div>
                                    <div className="appointment-details">
                                        <p><strong>Time:</strong> {apt.time}</p>
                                        <p><strong>Reason:</strong> {apt.reason}</p>
                                    </div>
                                    <div className="appointment-actions">
                                        <button className="edit-btn" onClick={() => handleEditAppointment(apt)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteAppointment(apt.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {appointments.length === 0 && (
                    <section className="dashboard-section empty-state">
                        <div className="empty-content">
                            <div className="empty-icon">📭</div>
                            <h2>No Appointments Yet</h2>
                            <p>Book your first appointment to get started</p>
                            <button className="action-button primary" onClick={() => setShowBookModal(true)}>
                                Book an Appointment
                            </button>
                        </div>
                    </section>
                )}
            </div>

            {showBookModal && (
                <div className="modal-overlay" onClick={() => setShowBookModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Book an Appointment</h2>
                            <button className="close-modal" onClick={() => setShowBookModal(false)}>×</button>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleBookAppointment}>
                            <div className="form-group">
                                <label htmlFor="doctorName">Doctor Name</label>
                                <input
                                    type="text"
                                    id="doctorName"
                                    name="doctorName"
                                    value={formData.doctorName}
                                    onChange={handleFormChange}
                                    placeholder="e.g., John Smith"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Appointment Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time">Time</label>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason">Reason for Visit</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleFormChange}
                                    placeholder="Describe the reason for your appointment"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">Book Appointment</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowBookModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Appointment</h2>
                            <button className="close-modal" onClick={() => setShowEditModal(false)}>×</button>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleUpdateAppointment}>
                            <div className="form-group">
                                <label htmlFor="doctorName">Doctor Name</label>
                                <input
                                    type="text"
                                    id="doctorName"
                                    name="doctorName"
                                    value={formData.doctorName}
                                    onChange={handleFormChange}
                                    placeholder="e.g., John Smith"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Appointment Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time">Time</label>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason">Reason for Visit</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleFormChange}
                                    placeholder="Describe the reason for your appointment"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">Update Appointment</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}