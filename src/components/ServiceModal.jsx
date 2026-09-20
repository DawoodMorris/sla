import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { useServices } from '../context/ServicesContext';

const CATEGORIES = [
  'Waste & Construction',
  'Cleaning',
  'Plumbing',
  'Landscaping',
  'HVAC',
  'Electrical',
  'General Maintenance'
];

const PRICING_TYPES = [
  'Per Load',
  'Hourly',
  'Starting at',
  'Fixed Quote',
  'Custom Estimate'
];

const TURNAROUND_OPTIONS = [
  'Under 2 Hours',
  'Same Day / 24h',
  '2-3 Business Days',
  '3-5 Business Days',
  'Within 1 Week'
];

export const ServiceModal = ({ isOpen, onClose, initialData = null }) => {
  const { addService, updateService } = useServices();
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Waste & Construction',
    pricingType: 'Per Load',
    price: '',
    status: 'Active',
    turnaround: 'Same Day / 24h',
    serviceArea: 'Metro Area (20-mile radius)',
    equipment: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Waste & Construction',
        pricingType: initialData.pricingType || 'Per Load',
        price: initialData.price || '',
        status: initialData.status || 'Active',
        turnaround: initialData.turnaround || 'Same Day / 24h',
        serviceArea: initialData.serviceArea || 'Metro Area',
        equipment: initialData.equipment || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        category: 'Waste & Construction',
        pricingType: 'Per Load',
        price: '',
        status: 'Active',
        turnaround: 'Same Day / 24h',
        serviceArea: 'Metro Area (20-mile radius)',
        equipment: '',
        description: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Service title is required (e.g. Rubble Removal).';
    } else if (formData.title.length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      errs.price = 'Please specify a positive price / rate amount.';
    }

    if (!formData.description.trim()) {
      errs.description = 'Please provide a clear service scope and description.';
    } else if (formData.description.length < 15) {
      errs.description = 'Description must be at least 15 characters.';
    }

    if (!formData.serviceArea.trim()) {
      errs.serviceArea = 'Service coverage area is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const payload = {
      ...formData,
      price: Number(formData.price)
    };

    if (isEditing) {
      updateService(initialData.id, payload);
    } else {
      addService(payload);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <span className="modal-icon-badge">
              <Wrench size={20} />
            </span>
            <div>
              <h2 id="modal-title" className="modal-title">
                {isEditing ? 'Update Service Listing' : 'List a New Service'}
              </h2>
              <p className="modal-subtitle">
                {isEditing
                  ? 'Refine rates, equipment, coverage area, and status'
                  : 'Publish your service to receive direct customer bookings'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="service-title" className="form-label">
                Service Title <span className="required">*</span>
              </label>
              <input
                id="service-title"
                type="text"
                placeholder="e.g. Rubble Removal & Debris Carting"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              {errors.title && (
                <span className="field-error-msg">
                  <AlertCircle size={14} /> {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="service-category" className="form-label">
                Category
              </label>
              <select
                id="service-category"
                className="form-select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="service-status" className="form-label">
                Listing Status
              </label>
              <select
                id="service-status"
                className="form-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active (Visible to Clients)</option>
                <option value="In Review">In Review</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pricing-type" className="form-label">
                Pricing Structure
              </label>
              <select
                id="pricing-type"
                className="form-select"
                value={formData.pricingType}
                onChange={(e) =>
                  setFormData({ ...formData, pricingType: e.target.value })
                }
              >
                {PRICING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="service-price" className="form-label">
                Price / Rate ($ USD) <span className="required">*</span>
              </label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">$</span>
                <input
                  id="service-price"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="150"
                  className={`form-input currency-input ${errors.price ? 'input-error' : ''}`}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              {errors.price && (
                <span className="field-error-msg">
                  <AlertCircle size={14} /> {errors.price}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="turnaround-time" className="form-label">
                Expected Turnaround
              </label>
              <select
                id="turnaround-time"
                className="form-select"
                value={formData.turnaround}
                onChange={(e) =>
                  setFormData({ ...formData, turnaround: e.target.value })
                }
              >
                {TURNAROUND_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="service-area" className="form-label">
                Service Area / Coverage <span className="required">*</span>
              </label>
              <input
                id="service-area"
                type="text"
                placeholder="e.g. Downtown & Outer Boroughs"
                className={`form-input ${errors.serviceArea ? 'input-error' : ''}`}
                value={formData.serviceArea}
                onChange={(e) =>
                  setFormData({ ...formData, serviceArea: e.target.value })
                }
              />
              {errors.serviceArea && (
                <span className="field-error-msg">
                  <AlertCircle size={14} /> {errors.serviceArea}
                </span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="service-equipment" className="form-label">
                Tools, Vehicles & Equipment (Optional)
              </label>
              <input
                id="service-equipment"
                type="text"
                placeholder="e.g. Tipper Truck, Skid Loader, Shovels, PPE"
                className="form-input"
                value={formData.equipment}
                onChange={(e) =>
                  setFormData({ ...formData, equipment: e.target.value })
                }
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="service-description" className="form-label">
                Detailed Service Description <span className="required">*</span>
              </label>
              <textarea
                id="service-description"
                rows={3}
                placeholder="Describe scope, disposal methods, waste types accepted, and client expectations..."
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
              {errors.description && (
                <span className="field-error-msg">
                  <AlertCircle size={14} /> {errors.description}
                </span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <CheckCircle size={17} />
              <span>{isEditing ? 'Save Changes' : 'Publish Service Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
