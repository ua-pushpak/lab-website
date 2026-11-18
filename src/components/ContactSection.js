import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useTheme } from '../context/ThemeContext';

const ContactSection = () => {
  const { settings } = useSiteSettings();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Research', path: '/research' },
    { name: 'Team', path: '/team' },
    { name: 'Publications', path: '/publications' },
    { name: 'News', path: '/news' },
  ];

  return (
    <section className={`py-20 pt-32 ${isDark ? 'bg-[#1e293b]' : 'bg-[#f5f5f7]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Us</h2>
          <div className="w-20 h-1 bg-drone-blue mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <i className="fas fa-map-marker-alt text-drone-blue mt-1"></i>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{settings?.contactAddress || 'Research Avenue'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-phone text-drone-blue"></i>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{settings?.contactPhone || '+1 (555) 123-4567'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fas fa-envelope text-drone-blue"></i>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{settings?.contactEmail || 'contact@dronelab.org'}</span>
                </li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className={isDark ? 'text-gray-400 hover:text-drone-blue' : 'text-gray-600 hover:text-drone-blue'}>
                      <i className="fas fa-chevron-right text-xs mr-2"></i>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className={`p-8 rounded-xl border ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Send Message</h3>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-[#1e293b] border-white/20 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`} />
                  <input type="email" placeholder="Your Email" className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-[#1e293b] border-white/20 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`} />
                </div>
                <input type="text" placeholder="Subject" className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-[#1e293b] border-white/20 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`} />
                <textarea placeholder="Your Message" rows="4" className={`w-full px-4 py-3 rounded-lg border resize-none ${isDark ? 'bg-[#1e293b] border-white/20 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}></textarea>
                <button className="px-8 py-3 bg-drone-blue text-white font-semibold rounded-lg hover:bg-drone-cyan transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Location</h3>
              <div className="rounded-lg overflow-hidden border" style={{ height: '300px' }}>
                <iframe
                  title="Lab Location"
                  src="https://maps.google.com/maps?q=Indian%20Institute%20of%20Technology&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;