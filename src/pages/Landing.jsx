import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span>🏋️ Simple. Powerful. Free.</span>
                    </div>
                    <h1 className="hero-title">
                        Track Your Fitness Journey
                    </h1>
                    <p className="hero-subtitle">
                        Simple, powerful workout tracking for serious lifters.
                        Create custom routines, log your sets, and watch your progress grow.
                    </p>
                    <div className="hero-actions">
                        <Link to="/auth/register" className="btn btn-primary btn-lg">
                            Get Started Free
                        </Link>
                        <Link to="/auth/login" className="btn btn-secondary btn-lg">
                            Sign In
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-icon">💪</div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-heading">Everything You Need to Succeed</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📋</div>
                        <h3 className="feature-title">Smart Workout Plans</h3>
                        <p className="feature-description">
                            Create custom routines or use our pre-built templates.
                            Organize your training by days and exercises.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Progress Tracking</h3>
                        <p className="feature-description">
                            Visualize your strength gains over time. Track personal bests
                            and see your improvement with detailed stats.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⏱️</div>
                        <h3 className="feature-title">Live Workout Mode</h3>
                        <p className="feature-description">
                            Log sets in real-time with built-in rest timers.
                            Swap exercises on the fly and track every rep.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <h2 className="section-heading">How It Works</h2>
                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3 className="step-title">Create Your Plan</h3>
                        <p className="step-description">
                            Build a custom workout routine or choose from templates.
                            Add exercises, sets, and target reps.
                        </p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3 className="step-title">Start Tracking</h3>
                        <p className="step-description">
                            Begin your workout and log each set. Track weight, reps,
                            and rest between sets.
                        </p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3 className="step-title">Watch Progress</h3>
                        <p className="step-description">
                            Review your history, analyze trends, and celebrate
                            your personal records.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Start?</h2>
                    <p className="cta-subtitle">
                        Join lifters tracking their progress with WoTracker
                    </p>
                    <Link to="/auth/register" className="btn btn-primary btn-lg">
                        Create Free Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="footer-logo">🏋️ WoTracker</span>
                        <p className="footer-tagline">Track your gains, reach your goals</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/auth/login" className="footer-link">Sign In</Link>
                        <Link to="/auth/register" className="footer-link">Sign Up</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 WoTracker. Built for lifters, by lifters.</p>
                </div>
            </footer>
        </div>
    );
}
