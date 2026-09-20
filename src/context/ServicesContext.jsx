import React, { createContext, useContext, useState, useEffect } from 'react';

const ServicesContext = createContext(null);

const STORAGE_KEY = 'servisync_services_v1';

const INITIAL_SERVICES = [
  {
    id: 'srv-1',
    title: 'Rubble Removal & Site Clearance',
    category: 'Waste & Construction',
    description: 'Rapid removal of masonry rubble, broken concrete, excavation debris, bricks, and construction waste with heavy-duty disposal trucks.',
    pricingType: 'Per Load',
    price: 185,
    status: 'Active',
    turnaround: 'Same Day / 24h',
    serviceArea: 'Metro & Suburbs (25-mile radius)',
    equipment: 'Dump Truck, Heavy Wheelbarrows, Skid Steer',
    createdAt: '2026-08-15'
  },
  {
    id: 'srv-2',
    title: 'Post-Renovation Deep Cleaning',
    category: 'Cleaning',
    description: 'Thorough fine-dust extraction, floor scrubbing, window cleaning, and sanitization following residential or commercial remodeling.',
    pricingType: 'Starting at',
    price: 240,
    status: 'Active',
    turnaround: '2-3 Business Days',
    serviceArea: 'Greater Metro Area',
    equipment: 'HEPA Vacuums, Rotary Floor Scrubbers',
    createdAt: '2026-08-20'
  },
  {
    id: 'srv-3',
    title: 'Emergency Plumbing & Pipe Repair',
    category: 'Plumbing',
    description: '24/7 emergency response for burst pipes, mainline blockages, water heater failures, and high-pressure leak detection.',
    pricingType: 'Hourly',
    price: 95,
    status: 'Active',
    turnaround: 'Under 2 Hours',
    serviceArea: 'City Center & West County',
    equipment: 'CCTV Pipe Inspection, Hydro Jetter',
    createdAt: '2026-08-25'
  },
  {
    id: 'srv-4',
    title: 'Landscaping & Tree Stump Grinding',
    category: 'Landscaping',
    description: 'Complete yard overhaul including deep tree root and stump grinding, hedge shaping, turf installation, and green waste haulage.',
    pricingType: 'Fixed Quote',
    price: 320,
    status: 'Active',
    turnaround: '3-5 Business Days',
    serviceArea: 'Suburban North & East',
    equipment: 'Hydraulic Stump Grinder, Chipper',
    createdAt: '2026-09-02'
  },
  {
    id: 'srv-5',
    title: 'Commercial HVAC Inspection & Servicing',
    category: 'HVAC',
    description: 'Comprehensive seasonal inspection, refrigerant check, filter replacement, and preventative maintenance for commercial rooftop units.',
    pricingType: 'Starting at',
    price: 280,
    status: 'In Review',
    turnaround: 'Next Business Day',
    serviceArea: 'Industrial & Tech Parks',
    equipment: 'Manifold Gauges, Thermal Cameras',
    createdAt: '2026-09-10'
  },
  {
    id: 'srv-6',
    title: 'Hazardous Material & Asbestos Abatement',
    category: 'Waste & Construction',
    description: 'Certified removal and certified containment disposal of legacy building materials, lead paint, and friable insulation.',
    pricingType: 'Custom Estimate',
    price: 650,
    status: 'Draft',
    turnaround: '5-7 Business Days',
    serviceArea: 'Statewide Certified Zones',
    equipment: 'Negative Air Machines, Sealed Pods',
    createdAt: '2026-09-14'
  }
];

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SERVICES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch {
      // ignore
    }
  }, [services]);

  const addService = (newServiceData) => {
    const createdService = {
      ...newServiceData,
      id: 'srv-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setServices((prev) => [createdService, ...prev]);
    return createdService;
  };

  const updateService = (id, updatedData) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleStatus = (id) => {
    setServices((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Active' ? 'Draft' : 'Active';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const resetToDefaults = () => {
    setServices(INITIAL_SERVICES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        toggleStatus,
        resetToDefaults
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};
