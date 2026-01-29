import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user: authUser, token, logout } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (authUser && authUser.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        setUser(authUser);
        fetchDashboardData(token);
        setLoading(false);
    }, [token, navigate, authUser]);

    const fetchDashboardData = async (token) => {
        try {
            const statsRes = await fetch('http://localhost:3000/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (statsRes.ok) {
                setStats(await statsRes.json());
            }

            const usersRes = await fetch('http://localhost:3000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (usersRes.ok) {
                setUsers(await usersRes.json());
            }

            const appointmentsRes = await fetch('http://localhost:3000/api/admin/appointments', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (appointmentsRes.ok) {
                setAppointments(await appointmentsRes.json());
            }
        } catch (err) {
            setError('Failed to load data');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure? This will delete the user and all their appointments.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setUsers(users.filter(u => u.id !== userId));
                setAppointments(appointments.filter(a => a.user_id !== userId));
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const handlePromoteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/promote`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(users.map(u => u.id === userId ? data.user : u));
            }
        } catch (err) {
            setError('Failed to promote user');
        }
    };

    const handleDemoteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/demote`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(users.map(u => u.id === userId ? data.user : u));
            }
        } catch (err) {
            setError('Failed to demote user');
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm('Delete this appointment?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setAppointments(appointments.filter(a => a.id !== appointmentId));
            }
        } catch (err) {
            setError('Failed to delete appointment');
        }
    };

    if (loading || !user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="admin-container">
            <nav className="admin-navbar">
                <div className="admin-logo">♥ HealthBook Admin</div>
                <div className="admin-user-menu">
                    <span className="admin-user-name">👤 {user.name}</span>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="admin-content">
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button 
                        className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users ({users.length})
                    </button>
                    <button 
                        className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        📅 Appointments ({appointments.length})
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {activeTab === 'overview' && (
                    <div className="tab-content">
                        <h2>Dashboard Overview</h2>
                        {stats && (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-info">
                                        <p className="stat-number">{stats.total_users}</p>
                                        <p className="stat-label">Total Users</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">👨‍💼</div>
                                    <div className="stat-info">
                                        <p className="stat-number">{stats.total_admins}</p>
                                        <p className="stat-label">Admins</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">👤</div>
                                    <div className="stat-info">
                                        <p className="stat-number">{stats.total_regular_users}</p>
                                        <p className="stat-label">Regular Users</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-info">
                                        <p className="stat-number">{stats.total_appointments}</p>
                                        <p className="stat-label">Total Appointments</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="tab-content">
                        <h2>User Management</h2>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`role-badge ${u.role}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                {u.id !== user.id && (
                                                    <>
                                                        {u.role === 'user' ? (
                                                            <button 
                                                                className="promote-btn"
                                                                onClick={() => handlePromoteUser(u.id)}
                                                            >
                                                                Promote
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                className="demote-btn"
                                                                onClick={() => handleDemoteUser(u.id)}
                                                            >
                                                                Demote
                                                            </button>
                                                        )}
                                                        <button 
                                                            className="delete-btn"
                                                            onClick={() => handleDeleteUser(u.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                {u.id === user.id && (
                                                    <span className="self-badge">You</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="tab-content">
                        <h2>Appointment Management</h2>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Reason</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(apt => (
                                        <tr key={apt.id}>
                                            <td>{apt.id}</td>
                                            <td>{apt.user_name}</td>
                                            <td>Dr. {apt.doctor_name}</td>
                                            <td>{new Date(apt.date).toLocaleDateString()}</td>
                                            <td>{apt.time}</td>
                                            <td>{apt.reason}</td>
                                            <td className="action-buttons">
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteAppointment(apt.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
