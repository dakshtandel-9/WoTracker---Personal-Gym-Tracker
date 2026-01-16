// src/pages/Auth.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Auth.css';

export default function Auth() {
    const { mode } = useParams(); // Get mode from URL params
    const { signUp, signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === 'login') {
                await signIn(email, password);
            } else {
                await signUp(email, password);
                // After signup, automatically sign in
                await signIn(email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon">🏋️</span>
                    <h2>WoTracker</h2>
                </div>
                <h3>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <div className="auth-switch">
                    {mode === 'login' ? (
                        <p>
                            Don't have an account? <Link to="/auth/register">Sign up</Link>
                        </p>
                    ) : (
                        <p>
                            Already have an account? <Link to="/auth/login">Login</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
