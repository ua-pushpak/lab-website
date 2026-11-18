import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { settings } = useSiteSettings();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Research', path: '/research' },
    { name: 'Team', path: '/team' },
    { name: 'Publications', path: '/publications' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className={`border-t-2 border-drone-blue/30 ${isDark ? 'bg-black' : 'bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-drone-blue to-drone-cyan rounded-lg flex items-center justify-center">
                <i className="fas fa-drone text-white text-xl"></i>
              </div>
              <span className="text-white font-bold text-xl">{settings?.labName || 'DroneLab'}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings?.aboutText || 'Advancing drone technology through innovative research.'}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-drone-blue transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <i className="fas fa-map-marker-alt text-drone-blue mt-1 text-xs"></i>
                <span className="text-gray-400">{settings?.contactAddress || 'Research Avenue'}</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-phone text-drone-blue text-xs"></i>
                <span className="text-gray-400">{settings?.contactPhone || '+1 (555) 123-4567'}</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-envelope text-drone-blue text-xs"></i>
                <span className="text-gray-400">{settings?.contactEmail || 'contact@dronelab.org'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Location</h3>
            <div className="rounded-lg overflow-hidden border border-gray-800" style={{ height: '150px' }}>
              <iframe
                title="Lab Location Map"
                src="https://maps.google.com/maps?q=Indian%20Institute%20of%20Technology&t=&z=11&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 {settings?.labName || 'DroneLab'}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-drone-blue transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-drone-blue transition-colors">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-drone-blue transition-colors">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;