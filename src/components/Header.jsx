import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isSessionActive } = useWorkoutSession();
    const { user, signOut } = useAuth();

    const showBack = location.pathname !== '/';
    const isWorkoutActive = location.pathname === '/workout';
    const isAuthPage = location.pathname.startsWith('/auth');

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await signOut();
            navigate('/auth/login');
        }
    };

    // Don't show header on auth pages
    if (isAuthPage) return null;

    return (
        <header className="header">
            <div className="header-content">
                {showBack && !isWorkoutActive ? (
                    <button className="header-back" onClick={() => navigate(-1)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                ) : (
                    <div className="header-spacer" />
                )}

                <Link to="/dashboard" className="header-logo">
                    <span className="logo-icon">🏋️</span>
                    <span className="logo-text">WoTracker</span>
                </Link>

                <nav className="header-nav">
                    {isSessionActive && !isWorkoutActive && (
                        <Link to="/workout" className="nav-active-workout">
                            <span className="pulse-dot" />
                            Continue
                        </Link>
                    )}
                    {user && (
                        <button className="btn-logout" onClick={handleLogout} title="Logout">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
