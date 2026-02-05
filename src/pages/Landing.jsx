import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Landing.css';

export default function Landing() {
    const [stats, setStats] = useState({ workouts: 0, users: 0, exercises: 0 });

    // Animated counter effect
    useEffect(() => {
        const targets = { workouts: 10000, users: 2500, exercises: 50000 };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setStats({
                workouts: Math.floor(targets.workouts * progress),
                users: Math.floor(targets.users * progress),
                exercises: Math.floor(targets.exercises * progress)
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setStats(targets);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="floating-icon icon-1">🏋️</div>
                    <div className="floating-icon icon-2">💪</div>
                    <div className="floating-icon icon-3">⚡</div>
                    <div className="floating-icon icon-4">🎯</div>
                </div>

                <div className="hero-container">
                    <div className="hero-badge animate-fadeIn">
                        <span className="badge-icon">✨</span>
                        <span>Simple. Powerful. Free.</span>
                    </div>

                    <h1 className="hero-title animate-slideUp">
                        Track Your <span className="gradient-text">Fitness Journey</span>
                    </h1>

                    <p className="hero-subtitle animate-slideUp stagger-1">
                        The ultimate workout tracker for serious lifters. Create custom routines,
                        log your sets in real-time, and watch your progress soar.
                    </p>

                    <div className="hero-actions animate-slideUp stagger-2">
                        <Link to="/auth/register" className="btn btn-primary btn-hero">
                            <span>Get Started Free</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/auth/login" className="btn btn-secondary btn-hero">
                            <span>Sign In</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Showcase */}
            <section className="stats-showcase">
                <div className="stats-container">
                    <div className="stat-item animate-fadeIn">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)' }}>
                            🏋️
                        </div>
                        <div className="stat-value">{stats.workouts.toLocaleString()}+</div>
                        <div className="stat-label">Workouts Tracked</div>
                    </div>
                    <div className="stat-item animate-fadeIn stagger-1">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00c853 0%, #00e676 100%)' }}>
                            👥
                        </div>
                        <div className="stat-value">{stats.users.toLocaleString()}+</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                    <div className="stat-item animate-fadeIn stagger-2">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)' }}>
                            💪
                        </div>
                        <div className="stat-value">{stats.exercises.toLocaleString()}+</div>
                        <div className="stat-label">Exercises Logged</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Features</span>
                        <h2 className="section-title">Everything You Need to Succeed</h2>
                        <p className="section-subtitle">
                            Powerful tools designed to help you reach your fitness goals
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card glass-card animate-fadeIn">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📋</div>
                            </div>
                            <h3 className="feature-title">Smart Workout Plans</h3>
                            <p className="feature-description">
                                Create custom routines or use pre-built templates. Organize your
                                training by days and exercises with flexible scheduling.
                            </p>
                            <div className="feature-tags">
                                <span className="feature-tag">Custom Plans</span>
                                <span className="feature-tag">Templates</span>
                            </div>
                        </div>

                        <div className="feature-card glass-card animate-fadeIn stagger-1">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📊</div>
                            </div>
                            <h3 className="feature-title">Progress Tracking</h3>
                            <p className="feature-description">
                                Visualize your strength gains over time. Track personal bests
                                and see your improvement with detailed analytics.
                            </p>
                            <div className="feature-tags">
                                <span className="feature-tag">Analytics</span>
                                <span className="feature-tag">PRs</span>
                            </div>
                        </div>

                        <div className="feature-card glass-card animate-fadeIn stagger-2">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">⏱️</div>
                            </div>
                            <h3 className="feature-title">Live Workout Mode</h3>
                            <p className="feature-description">
                                Log sets in real-time with built-in rest timers. Swap exercises
                                on the fly and track every single rep.
                            </p>
                            <div className="feature-tags">
                                <span className="feature-tag">Real-time</span>
                                <span className="feature-tag">Timers</span>
                            </div>
                        </div>

                        <div className="feature-card glass-card animate-fadeIn stagger-3">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">📈</div>
                            </div>
                            <h3 className="feature-title">Exercise History</h3>
                            <p className="feature-description">
                                Review your complete workout history. Filter by date, exercise,
                                or plan to analyze your training patterns.
                            </p>
                            <div className="feature-tags">
                                <span className="feature-tag">History</span>
                                <span className="feature-tag">Filters</span>
                            </div>
                        </div>

                        <div className="feature-card glass-card animate-fadeIn stagger-4">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🍎</div>
                            </div>
                            <h3 className="feature-title">Diet Tracking</h3>
                            <p className="feature-description">
                                Track your nutrition alongside your workouts. Log meals,
                                monitor calories, and hit your macro targets.
                            </p>
                            <div className="feature-tags">
                                <span className="feature-tag">Nutrition</span>
                                <span className="feature-tag">Macros</span>
                            </div>
                        </div>

                        <div className="feature-card glass-card animate-fadeIn stagger-5">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">🔥</div>
                            </div>
                            <h3 className="feature-title">Streak Tracking</h3>
                            <p className="feature-description">
                                Build consistency with daily streak tracking. Stay motivated
                                with achievements and milestone badges.
                            </p>
                            <div className="feature-tags">
                                <span className="feature-tag">Streaks</span>
                                <span className="feature-tag">Badges</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">How It Works</span>
                        <h2 className="section-title">Get Started in 3 Simple Steps</h2>
                    </div>

                    <div className="steps-timeline">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3 className="step-title">Create Your Plan</h3>
                                <p className="step-description">
                                    Build a custom workout routine tailored to your goals.
                                    Add exercises, sets, reps, and organize by training days.
                                </p>
                            </div>
                            <div className="step-connector"></div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3 className="step-title">Start Tracking</h3>
                                <p className="step-description">
                                    Begin your workout and log each set in real-time.
                                    Track weight, reps, and rest between sets effortlessly.
                                </p>
                            </div>
                            <div className="step-connector"></div>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3 className="step-title">Watch Progress</h3>
                                <p className="step-description">
                                    Review your history, analyze trends, and celebrate
                                    your personal records as you get stronger.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Testimonials</span>
                        <h2 className="section-title">Loved by Lifters Worldwide</h2>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card glass-card">
                            <div className="testimonial-rating">
                                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                            </div>
                            <p className="testimonial-text">
                                "Best workout tracker I've used. Simple, fast, and exactly what I need.
                                No bloat, just pure functionality."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">M</div>
                                <div className="author-info">
                                    <div className="author-name">Mike Chen</div>
                                    <div className="author-title">Powerlifter</div>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card glass-card">
                            <div className="testimonial-rating">
                                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                            </div>
                            <p className="testimonial-text">
                                "The progress tracking is incredible. Seeing my lifts go up week after
                                week keeps me motivated to push harder."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">S</div>
                                <div className="author-info">
                                    <div className="author-name">Sarah Johnson</div>
                                    <div className="author-title">Bodybuilder</div>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card glass-card">
                            <div className="testimonial-rating">
                                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                            </div>
                            <p className="testimonial-text">
                                "Finally, a tracker that doesn't overcomplicate things. Clean interface,
                                fast logging, perfect for the gym."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">A</div>
                                <div className="author-info">
                                    <div className="author-name">Alex Rodriguez</div>
                                    <div className="author-title">CrossFit Athlete</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Transform Your Training?</h2>
                        <p className="cta-subtitle">
                            Join thousands of lifters tracking their progress with WoTracker
                        </p>
                        <Link to="/auth/register" className="btn btn-primary btn-hero btn-cta">
                            <span>Create Free Account</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <p className="cta-note">No credit card required • Free forever</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <span className="logo-icon">🏋️</span>
                                <span className="logo-text">WoTracker</span>
                            </div>
                            <p className="footer-tagline">Track your gains, reach your goals</p>
                        </div>

                        <div className="footer-links-group">
                            <div className="footer-section">
                                <h4 className="footer-section-title">Product</h4>
                                <Link to="/auth/register" className="footer-link">Get Started</Link>
                                <Link to="/auth/login" className="footer-link">Sign In</Link>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2026 WoTracker. Built for lifters, by lifters.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
