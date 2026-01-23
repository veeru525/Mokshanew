import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email');
            return;
        }

        try {
            setError('');
            setSuccess(false);
            setLoading(true);
            await resetPassword(email);
            setSuccess(true);
            setEmail('');
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <div className="auth-header">
                    <h1 className="auth-title gradient-text">Reset Password</h1>
                    <p className="auth-subtitle">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        Password reset email sent! Check your inbox.
                        <br />
                        <small>Note: Email delivery requires Firebase configuration.</small>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            <FaEnvelope /> Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <Link to="/login" className="back-link">
                    <FaArrowLeft /> Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
