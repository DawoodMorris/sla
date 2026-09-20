import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, ShieldCheck, AlertCircle, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('contractor@servisync.com');
  const [password, setPassword] = useState('service123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-backdrop-decorations">
        <div className="decor-circle decor-1"></div>
        <div className="decor-circle decor-2"></div>
      </div>

      <div className="login-container">
        {/* Left side brand intro */}
        <div className="login-intro">
          <div className="brand-logo-large">
            <span className="logo-badge-lg">⚡</span>
            <div>
              <h1 className="brand-title">ServiSync</h1>
              <p className="brand-sub">Service Operations & Listing Platform</p>
            </div>
          </div>

          <div className="login-feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <strong>List On-Demand Services</strong>
                <p>Publish Rubble Removal, site clearing, plumbing, and contractor packages.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <strong>Flexible Rate & Turnaround Controls</strong>
                <p>Set per-load, hourly, or fixed pricing with transparent coverage areas.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <strong>Client Booking Management</strong>
                <p>Centralize your service portfolio, toggle visibility, and drive business.</p>
              </div>
            </div>
          </div>

          <div className="login-quote-box">
            <p className="quote-text">
              "Listing our Rubble Removal and post-construction services on this dashboard boosted our weekly dispatched loads by 65%."
            </p>
            <span className="quote-author">— Alex Vance, Urban Cleanout & Demolition</span>
          </div>
        </div>

        {/* Right side form */}
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-heading">Welcome Back</h2>
            <p className="login-subtext">Sign in to manage and list your company services</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Business Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="contractor@servisync.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="login-password" className="form-label">
                  Password
                </label>
                <span className="hint-text">Minimum 4 characters</span>
              </div>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="demo-credentials-box">
            <div className="demo-header">
              <Sparkles size={14} className="text-amber" />
              <span>Quick Demo Accounts</span>
            </div>
            <div className="demo-actions">
              <button
                type="button"
                className="demo-btn"
                onClick={() =>
                  handleFillDemo('contractor@servisync.com', 'service123')
                }
              >
                <span>🛠️ Contractor Admin</span>
                <code>contractor@servisync.com</code>
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() =>
                  handleFillDemo('rubble.specialist@cleanout.com', 'demo2026')
                }
              >
                <span>🚜 Rubble Removal Pro</span>
                <code>rubble.specialist@cleanout.com</code>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
