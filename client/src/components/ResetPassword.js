import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './Auth.css';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const verifyToken = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/verify-reset-token?token=${token}`);
            const data = await response.json();

            if (response.ok && data.valid) {
                setTokenValid(true);
            } else {
                setError(data.message || 'Invalid or expired reset token');
            }
        } catch (err) {
            setError('Failed to verify reset token');
        } finally {
            setValidating(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            setError('No reset token provided');
            setValidating(false);
            return;
        }

        verifyToken();
    }, [token, verifyToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successfully!');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="home-link">← Back to Home</Link>
                </div>
                <div className="auth-box">
                    <h2>Verifying Reset Link...</h2>
                    <p>Please wait while we verify your reset link.</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <h2>Invalid Reset Link</h2>
                    {error && <div className="error-message">{error}</div>}
                    <p>The reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="submit-button" style={{ textAlign: 'center' }}>
                        Request a New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-header">
                <Link to="/" className="home-link">← Back to Home</Link>
            </div>
            <div className="auth-box">
                <h2>Reset Password</h2>
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <p className="auth-link">
                    <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
}
