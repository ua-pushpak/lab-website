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
  const [settings, setSettings] = useState(null);
  const [settingsHistory, setSettingsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiService.getSiteSettings();
      setSettings(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await apiService.updateSiteSettings(newSettings);
      setSettings(response.data.data);
      setSettingsHistory(prev => [...prev, response.data.data]);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error updating site settings:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, settingsHistory, loading, fetchSettings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};