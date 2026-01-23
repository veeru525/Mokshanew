import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await signInWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Failed to sign in with Google.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <div className="auth-header">
                    <h1 className="auth-title gradient-text">Welcome Back</h1>
                    <p className="auth-subtitle">Login to continue shopping</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            <FaEnvelope /> Email
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

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <FaLock /> Password
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="form-footer">
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button
                    type="button"
                    className="btn btn-google"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    <FaGoogle /> Sign in with Google
                </button>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/signup" className="auth-link">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
