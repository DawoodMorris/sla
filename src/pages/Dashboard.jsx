import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  PlusCircle,
  Truck,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import { ServiceModal } from '../components/ServiceModal';
import { ConfirmModal } from '../components/ConfirmModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const { services, toggleStatus, deleteService } = useServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Calculated metrics
  const totalCount = services.length;
  const activeCount = services.filter((s) => s.status === 'Active').length;
  const draftCount = services.filter((s) => s.status === 'Draft' || s.status === 'In Review').length;
  const rubbleCount = services.filter(
    (s) =>
      s.title.toLowerCase().includes('rubble') ||
      s.category.toLowerCase().includes('waste')
  ).length;

  const avgPrice = totalCount
    ? Math.round(
        services.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) /
          totalCount
      )
    : 0;

  // Find the rubble removal service if present
  const rubbleService = services.find((s) =>
    s.title.toLowerCase().includes('rubble')
  );

  const handleEdit = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  return (
    <div className="dashboard-view">
      {/* Top Welcome Header */}
      <div className="view-header">
        <div>
          <h1 className="page-title">Service Operations Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name || 'Partner'}</strong>. Manage your service catalog and live bookings.
          </p>
        </div>
        <div className="header-actions">
          <Link to="/services" className="btn btn-outline">
            <Briefcase size={16} />
            <span>All Services</span>
          </Link>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <PlusCircle size={16} />
            <span>List New Service</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap icon-blue">
            <Briefcase size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Services</span>
            <span className="metric-value">{totalCount}</span>
            <span className="metric-trend text-positive">
              <TrendingUp size={12} /> Active catalog
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap icon-emerald">
            <CheckCircle size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Active & Bookable</span>
            <span className="metric-value">{activeCount}</span>
            <span className="metric-sub">{draftCount} in review / draft</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap icon-amber">
            <Truck size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Rubble & Waste Load</span>
            <span className="metric-value">{rubbleCount}</span>
            <span className="metric-sub">High seasonal demand</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap icon-indigo">
            <DollarSign size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Avg. Service Rate</span>
            <span className="metric-value">${avgPrice}</span>
            <span className="metric-sub">Across all categories</span>
          </div>
        </div>
      </div>

      {/* Featured Service Spotlight: Rubble Removal */}
      {rubbleService && (
        <div className="featured-banner">
          <div className="featured-header">
            <div className="badge-featured">
              <Truck size={14} /> HIGHLIGHTED CORE SERVICE
            </div>
            <span
              className={`status-pill ${
                rubbleService.status === 'Active' ? 'status-active' : 'status-draft'
              }`}
            >
              {rubbleService.status}
            </span>
          </div>

          <div className="featured-body">
            <div className="featured-info">
              <h2 className="featured-title">{rubbleService.title}</h2>
              <p className="featured-desc">{rubbleService.description}</p>
              <div className="featured-tags">
                <span className="tag-chip">
                  <strong>Pricing:</strong> ${rubbleService.price} ({rubbleService.pricingType})
                </span>
                <span className="tag-chip">
                  <strong>Turnaround:</strong> {rubbleService.turnaround}
                </span>
                <span className="tag-chip">
                  <strong>Coverage:</strong> {rubbleService.serviceArea}
                </span>
              </div>
            </div>

            <div className="featured-actions">
              <button
                className="btn btn-secondary"
                onClick={() => handleEdit(rubbleService)}
              >
                <Edit2 size={16} />
                <span>Edit Service Details</span>
              </button>
              <button
                className="btn btn-outline"
                onClick={() => toggleStatus(rubbleService.id)}
              >
                {rubbleService.status === 'Active' ? 'Set as Draft' : 'Publish Active'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Services List and Activity */}
      <div className="dashboard-grid">
        <div className="card-panel table-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Listed Services Overview</h2>
              <p className="panel-subtitle">
                Quick glance at your listed offerings and their client visibility
              </p>
            </div>
            <Link to="/services" className="link-action">
              <span>View full catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service Details</th>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Turnaround</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.slice(0, 5).map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="table-service-name">
                        <strong>{service.title}</strong>
                        <span className="table-service-area">{service.serviceArea}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{service.category}</span>
                    </td>
                    <td>
                      <div className="price-tag">
                        <strong>${service.price}</strong>
                        <span className="price-type">/ {service.pricingType}</span>
                      </div>
                    </td>
                    <td>
                      <span className="turnaround-text">
                        <Clock size={13} /> {service.turnaround}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-btn-toggle ${
                          service.status === 'Active'
                            ? 'status-active'
                            : service.status === 'In Review'
                            ? 'status-review'
                            : 'status-draft'
                        }`}
                        onClick={() => toggleStatus(service.id)}
                        title="Click to toggle status"
                      >
                        {service.status}
                      </button>
                    </td>
                    <td className="text-right">
                      <div className="action-button-group">
                        <button
                          className="action-icon-btn"
                          title="Edit Service"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="action-icon-btn btn-trash"
                          title="Delete Service"
                          onClick={() => setDeleteTarget(service)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown & Operations Tips */}
        <div className="card-panel side-panel">
          <h2 className="panel-title">Category Distribution</h2>
          <div className="category-stats-list">
            {Array.from(new Set(services.map((s) => s.category))).map((cat) => {
              const count = services.filter((s) => s.category === cat).length;
              const percent = Math.round((count / totalCount) * 100) || 0;
              return (
                <div key={cat} className="category-stat-row">
                  <div className="cat-header">
                    <span className="cat-name">{cat}</span>
                    <span className="cat-count">
                      {count} service{count > 1 ? 's' : ''} ({percent}%)
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="provider-tip-card">
            <div className="tip-header">
              <CheckCircle2 size={16} className="text-emerald" />
              <strong>Listing Optimization Tip</strong>
            </div>
            <p className="tip-text">
              Services with explicitly listed vehicles & equipment (like <em>Dump Trucks</em> for <strong>Rubble Removal</strong>) receive 35% higher direct booking conversions.
            </p>
          </div>
        </div>
      </div>

      {/* Service Modal */}
      {modalOpen && (
        <ServiceModal
          isOpen={modalOpen}
          initialData={editingService}
          onClose={() => {
            setModalOpen(false);
            setEditingService(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          title="Delete Service Listing"
          message={`Are you sure you want to delete "${deleteTarget.title}"? Clients will no longer be able to request or book this service.`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteService(deleteTarget.id)}
        />
      )}
    </div>
  );
};
