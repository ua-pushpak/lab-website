import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  }
  return context;
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    labName: 'DroneLab',
    labTagline: 'Research Center',
    heroTagline: 'Advanced Drone Research',
    heroTitle: 'Shaping the Future of',
    heroSubtitle: 'Pioneering research in drone technology, autonomous systems, and aerial robotics.',
    aboutText: 'Advancing the future of autonomous flight through innovative research.',
    contactEmail: 'contact@dronelab.org',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '123 Research Avenue',
    stats: [
      { value: '50+', label: 'Projects' },
      { value: '200+', label: 'Publications' },
      { value: '30+', label: 'Active Drones' },
    ],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiService.getSiteSettings();
        if (response.data && response.data.data) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.log('Using default settings');
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const response = await apiService.updateSiteSettings(newSettings);
      setSettings(response.data.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error updating site settings:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, fetchSettings: () => {}, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};