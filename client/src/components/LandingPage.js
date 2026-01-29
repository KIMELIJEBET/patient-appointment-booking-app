import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="landing-container">
            <nav className="navbar">
                <Link to="/" className="logo">HealthBook</Link>
                <ul className="nav-links">
                    <li><a href="#features">Features</a></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/login" className="cta-button">Login</Link></li>
                    <li><Link to="/signup" className="cta-button signup-button">Get Started</Link></li>
                </ul>
            </nav>

            <section className="hero">
                <div className="hero-content">
                    <h1>Schedule Your Health Appointments with Ease</h1>
                    <p>Book doctor appointments in seconds. No waiting, no hassle.</p>
                    <Link to="/signup" className="primary-button">Book an Appointment</Link>
                </div>
            </section>

            <section id="features" className="features">
                <h2>Why Choose Us</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="icon">📅</div>
                        <h3>Easy Scheduling</h3>
                        <p>Book appointments in just a few clicks</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">⏰</div>
                        <h3>Instant Confirmation</h3>
                        <p>Get immediate booking confirmation</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">🔔</div>
                        <h3>Reminders</h3>
                        <p>Never miss an appointment again</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2026 HealthBook. All rights reserved.</p>
            </footer>
        </div>
    );
}