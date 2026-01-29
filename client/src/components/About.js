import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
    return (
        <div className="about-container">
            <nav className="navbar">
                <Link to="/" className="logo">HealthBook</Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about" className="active">About</Link></li>
                    <li><Link to="/login" className="cta-button">Login</Link></li>
                    <li><Link to="/signup" className="cta-button signup-button">Get Started</Link></li>
                </ul>
            </nav>

            <section className="about-hero">
                <h1>About HealthBook</h1>
                <p>Your trusted healthcare appointment companion</p>
            </section>

            <section className="about-content">
                <div className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        At HealthBook, we believe that scheduling healthcare appointments should be simple, fast, and accessible to everyone. 
                        Our mission is to eliminate the barriers between patients and quality healthcare by providing an intuitive platform 
                        for booking medical appointments online.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Why Choose HealthBook?</h2>
                    <div className="features-list">
                        <div className="feature">
                            <div className="feature-icon">⏱️</div>
                            <h3>Save Time</h3>
                            <p>Book appointments in seconds without waiting on hold</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure & Private</h3>
                            <p>Your health information is encrypted and protected</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">📱</div>
                            <h3>Mobile Friendly</h3>
                            <p>Book from anywhere, anytime on any device</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">🔔</div>
                            <h3>Smart Reminders</h3>
                            <p>Never miss an appointment with automatic reminders</p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Our Story</h2>
                    <p>
                        HealthBook was founded with a simple idea: healthcare should be accessible and convenient for everyone. 
                        We recognized that patients and doctors were spending precious time on administrative tasks that could be automated. 
                        Our team of healthcare professionals and technology experts came together to create a solution that benefits both 
                        patients and healthcare providers.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Our Values</h2>
                    <ul className="values-list">
                        <li><strong>Patient-Centered:</strong> Everything we do is focused on improving the patient experience</li>
                        <li><strong>Security First:</strong> We prioritize the security and privacy of your health data</li>
                        <li><strong>Innovation:</strong> We constantly improve our platform with cutting-edge technology</li>
                        <li><strong>Accessibility:</strong> Healthcare scheduling should be easy for everyone</li>
                        <li><strong>Reliability:</strong> Our platform is available 24/7 when you need it</li>
                    </ul>
                </div>

                <div className="about-section cta-section">
                    <h2>Ready to Get Started?</h2>
                    <p>Join thousands of patients who have simplified their healthcare scheduling</p>
                    <Link to="/signup" className="cta-button-large">Sign Up Now</Link>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2026 HealthBook. All rights reserved.</p>
            </footer>
        </div>
    );
}
