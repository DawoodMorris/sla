import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  LogOut,
  Building2,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ServiceModal } from './ServiceModal';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Service Catalog', path: '/services', icon: Briefcase }
  ];

  return (
    <div className="app-container">
      {/* Mobile Top bar */}
      <header className="mobile-header">
        <div className="brand-logo">
          <span className="logo-badge">⚡</span>
          <span className="brand-name">ServiSync</span>
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <span className="logo-badge">⚡</span>
            <div>
              <h1 className="brand-name">ServiSync</h1>
              <p className="brand-tagline">Provider Operations Hub</p>
            </div>
          </div>
        </div>

        <div className="quick-action-section">
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              setIsNewServiceModalOpen(true);
              setMobileMenuOpen(false);
            }}
          >
            <PlusCircle size={18} />
            <span>List New Service</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">MAIN WORKSPACE</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} className="nav-icon" />
                <span>{item.name}</span>
                <ChevronRight size={16} className="nav-arrow" />
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-promo">
          <div className="promo-badge">
            <Sparkles size={14} /> Recommended
          </div>
          <p className="promo-title">High Demand Alert</p>
          <p className="promo-text">
            Construction & Rubble Removal requests are up 42% this week.
          </p>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="user-avatar-wrap">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=Admin`}
                alt={user?.name || 'User'}
                className="user-avatar"
              />
              <span className="online-indicator"></span>
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Service Provider'}</span>
              <span className="user-role">{user?.company || 'Contractor Hub'}</span>
            </div>
          </div>

          <button
            className="btn btn-outline-danger btn-logout"
            onClick={handleLogout}
            title="Log out of system"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="app-main">
        <div className="main-viewport">
          <Outlet />
        </div>
      </main>

      {/* Quick Add Service Modal */}
      {isNewServiceModalOpen && (
        <ServiceModal
          isOpen={isNewServiceModalOpen}
          onClose={() => setIsNewServiceModalOpen(false)}
        />
      )}
    </div>
  );
};
