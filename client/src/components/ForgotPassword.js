import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setSubmitted(true);
                setEmail('');
                
                // For development, show the reset link
                if (data.reset_link) {
                    setMessage(data.message + '\n\nDevelopment Reset Link:\n' + data.reset_link);
                }
            } else {
                setError(data.message || 'Failed to send reset link');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <Link to="/" className="home-link">← Back to Home</Link>
            </div>
            <div className="auth-box">
                <h2>Forgot Password</h2>
                <p className="subtitle">Enter your email to receive a password reset link</p>

                {message && (
                    <div className="success-message">
                        {message.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}

                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="submit-button">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="success-content">
                        <p>✓ Reset link has been sent!</p>
                        <p>Please check your email and follow the link to reset your password.</p>
                        <button 
                            onClick={() => setSubmitted(false)} 
                            className="secondary-button"
                        >
                            Send Another Link
                        </button>
                    </div>
                )}

                <p className="auth-link">
                    Remember your password? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}
