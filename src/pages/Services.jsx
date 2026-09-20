import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useServices } from '../context/ServicesContext';
import { ServiceModal } from '../components/ServiceModal';
import { ConfirmModal } from '../components/ConfirmModal';

export const Services = () => {
  const { services, deleteService, toggleStatus, resetToDefaults } = useServices();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Derive unique categories
  const categories = useMemo(() => {
    return ['ALL', ...Array.from(new Set(services.map((s) => s.category)))];
  }, [services]);

  // Filtered and sorted services
  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesCategory =
          selectedCategory === 'ALL' || service.category === selectedCategory;
        const matchesStatus =
          selectedStatus === 'ALL' || service.status === selectedStatus;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          service.title.toLowerCase().includes(q) ||
          service.description.toLowerCase().includes(q) ||
          service.category.toLowerCase().includes(q) ||
          (service.serviceArea && service.serviceArea.toLowerCase().includes(q)) ||
          (service.equipment && service.equipment.toLowerCase().includes(q));

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        // newest default
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [services, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const handleEdit = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSortBy('newest');
  };

  return (
    <div className="services-page">
      {/* Top Banner */}
      <div className="view-header">
        <div>
          <h1 className="page-title">Service Catalog</h1>
          <p className="page-subtitle">
            Configure rates, service areas, and availability for all your published services.
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-outline"
            onClick={resetToDefaults}
            title="Reset to default sample services"
          >
            <RotateCcw size={16} />
            <span>Reset Defaults</span>
          </button>
          <button className="btn btn-primary" onClick={handleAddNew}>
            <PlusCircle size={16} />
            <span>List New Service</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="filters-card">
        <div className="filters-primary-row">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search services (e.g. Rubble Removal, cleaning, metro...)"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-select-group">
            <div className="select-with-label">
              <label htmlFor="cat-filter">Category:</label>
              <select
                id="cat-filter"
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-with-label">
              <label htmlFor="status-filter">Status:</label>
              <select
                id="status-filter"
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="In Review">In Review</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="select-with-label">
              <label htmlFor="sort-filter">Sort:</label>
              <select
                id="sort-filter"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Title: A-Z</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="view-toggle-btns">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
                aria-label="Table View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Pills if applied */}
        {(selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
          <div className="active-filters-row">
            <span className="active-filters-label">Active filters:</span>
            {searchQuery && (
              <span className="filter-pill">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>×</button>
              </span>
            )}
            {selectedCategory !== 'ALL' && (
              <span className="filter-pill">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('ALL')}>×</button>
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span className="filter-pill">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('ALL')}>×</button>
              </span>
            )}
            <button className="clear-all-link" onClick={handleClearFilters}>
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Content Rendering: Grid or Table */}
      {filteredServices.length === 0 ? (
        <div className="empty-state-panel">
          <div className="empty-icon-wrap">
            <AlertCircle size={40} />
          </div>
          <h3 className="empty-title">No services found</h3>
          <p className="empty-desc">
            No service listings matched your current filters. Try loosening your search criteria or add a new service.
          </p>
          <div className="empty-actions">
            <button className="btn btn-outline" onClick={handleClearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary" onClick={handleAddNew}>
              <PlusCircle size={16} />
              <span>List a New Service</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`service-card ${
                service.title.toLowerCase().includes('rubble') ? 'card-highlighted' : ''
              }`}
            >
              <div className="service-card-top">
                <span className="category-pill">{service.category}</span>
                <button
                  className={`status-pill clickable ${
                    service.status === 'Active'
                      ? 'status-active'
                      : service.status === 'In Review'
                      ? 'status-review'
                      : 'status-draft'
                  }`}
                  onClick={() => toggleStatus(service.id)}
                  title="Click to toggle listing status"
                >
                  {service.status}
                </button>
              </div>

              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.description}</p>

              <div className="service-card-meta">
                <div className="meta-item">
                  <Clock size={14} className="meta-icon" />
                  <span>{service.turnaround}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={14} className="meta-icon" />
                  <span>{service.serviceArea}</span>
                </div>
                {service.equipment && (
                  <div className="meta-item full-width-meta">
                    <Truck size={14} className="meta-icon" />
                    <span className="equipment-tag">{service.equipment}</span>
                  </div>
                )}
              </div>

              <div className="service-card-bottom">
                <div className="price-box">
                  <span className="price-figure">${service.price}</span>
                  <span className="price-interval">/ {service.pricingType}</span>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-card-action"
                    onClick={() => handleEdit(service)}
                    title="Edit Service Details"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-card-action btn-danger-action"
                    onClick={() => setDeleteTarget(service)}
                    title="Delete Service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-panel table-panel">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service Details</th>
                  <th>Category</th>
                  <th>Rate & Structure</th>
                  <th>Turnaround</th>
                  <th>Coverage Area</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="table-service-name">
                        <strong>{service.title}</strong>
                        <p className="table-service-subtext">{service.description.slice(0, 75)}...</p>
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
                      <span className="coverage-text">
                        <MapPin size={13} /> {service.serviceArea}
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
      )}

      {/* Service Modal (Add / Edit) */}
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
          message={`Are you sure you want to remove "${deleteTarget.title}" from your catalog?`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteService(deleteTarget.id)}
        />
      )}
    </div>
  );
};
