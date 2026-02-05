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

    const navItems = [
        { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
        { path: '/plans', icon: '📋', label: 'Plans' },
        { path: '/history', icon: '📊', label: 'History' },
        { path: '/progress', icon: '📈', label: 'Progress' },
        { path: '/diet', icon: '🍎', label: 'Diet' },
    ];

    return (
        <header className="header glass">
            <div className="header-container">
                {/* Left - Logo & Back */}
                <div className="header-left">
                    {showBack && !isWorkoutActive ? (
                        <button className="header-back" onClick={() => navigate(-1)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                    ) : null}
                    <Link to="/dashboard" className="header-logo">
                        <span className="logo-icon">🏋️</span>
                        <span className="logo-text">WoTracker</span>
                    </Link>
                </div>

                {/* Center - Navigation */}
                <nav className="header-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Right - Actions */}
                <div className="header-right">
                    {isSessionActive && !isWorkoutActive && (
                        <Link to="/workout" className="workout-active-btn">
                            <span className="pulse-dot" />
                            <span>Continue Workout</span>
                        </Link>
                    )}

                    {user && (
                        <div className="user-menu">
                            <div className="user-avatar">
                                {user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <button
                                className="btn-logout"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
