import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  const { settings } = useSiteSettings();
  const { theme } = useTheme();
  const [galleryImages, setGalleryImages] = useState([]);
  const [floatingNews, setFloatingNews] = useState([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchGalleryAndNews();
  }, []);

  const fetchGalleryAndNews = async () => {
    try {
      const newsRes = await apiService.getNews();
      if (newsRes.data && newsRes.data.data) {
        const visibleNews = newsRes.data.data.filter(n => n.isVisible !== false);
        setFloatingNews(visibleNews.slice(0, 4));
      }
    } catch (error) {
      setFloatingNews([]);
    }

    setGalleryImages([
      'https://picsum.photos/800/600?random=601',
      'https://picsum.photos/800/600?random=602',
      'https://picsum.photos/800/600?random=603',
      'https://picsum.photos/800/600?random=604',
      'https://picsum.photos/800/600?random=605',
      'https://picsum.photos/800/600?random=606',
    ]);
  };

  return (
    <div className={isDark ? 'bg-[#0f172a]' : 'bg-[#f5f5f7]'}>
      <HeroSection isDark={isDark} settings={settings} />
      <VisionMissionSection isDark={isDark} />
      <WhatWeDoSection isDark={isDark} />
      <GallerySection isDark={isDark} images={galleryImages} />
      <FloatingNewsSection isDark={isDark} news={floatingNews} />
    </div>
  );
};

const HeroSection = ({ isDark, settings }) => {
  return (
    <section className={`relative min-h-screen flex items-center ${
      isDark ? 'bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-b from-[#f5f5f7] via-white to-[#f5f5f7]'
    }`}>
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-drone-blue/20 border border-drone-blue/40 rounded-full text-drone-blue font-semibold text-sm mb-6">
              <i className="fas fa-drone mr-2"></i>
              {settings?.heroTagline || 'Advanced Drone Research'}
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {settings?.labName || 'DroneLab'}
            </h1>
            
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {settings?.heroSubtitle || 'Pioneering research in drone technology and autonomous systems.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/research" className="px-8 py-4 bg-gradient-to-r from-drone-blue to-drone-cyan text-white font-semibold rounded-lg shadow-lg hover:shadow-drone-blue/50 transition-all">
                Explore Research
              </Link>
              <Link to="/contact" className={`px-8 py-4 font-semibold rounded-lg transition-all ${
                isDark ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const VisionMissionSection = ({ isDark }) => {
  return (
    <section className={`py-20 ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Purpose</h2>
          <div className="w-20 h-1 bg-drone-blue mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-2xl border ${isDark ? 'bg-[#1e293b] border-white/10' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="w-14 h-14 bg-drone-blue/20 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-eye text-drone-blue text-2xl"></i>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Vision</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              To be a global leader in drone research and innovation, shaping the future of autonomous aerial systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-2xl border ${isDark ? 'bg-[#1e293b] border-white/10' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="w-14 h-14 bg-drone-blue/20 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-bullseye text-drone-blue text-2xl"></i>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Mission</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              To conduct cutting-edge research and develop innovative drone technologies for the benefit of society.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WhatWeDoSection = ({ isDark }) => {
  const activities = [
    { icon: 'fa-flask', title: 'Research', desc: 'Conducting fundamental and applied research in drone technology.' },
    { icon: 'fa-cogs', title: 'Development', desc: 'Building prototypes and testing new autonomous systems.' },
    { icon: 'fa-graduation-cap', title: 'Education', desc: 'Training students and researchers in drone science.' },
    { icon: 'fa-handshake', title: 'Collaboration', desc: 'Partnering with industry and government agencies.' },
  ];

  return (
    <section className={`py-20 ${isDark ? 'bg-[#1e293b]' : 'bg-[#f5f5f7]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>What We Do</h2>
          <div className="w-20 h-1 bg-drone-blue mx-auto"></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-xl border text-center transition-all ${
                isDark ? 'bg-[#0f172a] border-white/10 hover:border-drone-blue/40' : 'bg-white border-gray-200 hover:border-drone-blue/40'
              }`}
            >
              <div className="w-14 h-14 bg-drone-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${activity.icon} text-drone-blue text-xl`}></i>
              </div>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{activity.title}</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{activity.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GallerySection = ({ isDark, images }) => {
  return (
    <section className={`py-20 ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Gallery</h2>
          <div className="w-20 h-1 bg-drone-blue mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative group overflow-hidden rounded-xl cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                loading="lazy"
                className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-drone-blue/0 group-hover:bg-drone-blue/20 transition-colors duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FloatingNewsSection = ({ isDark, news }) => {
  if (!news || news.length === 0) return null;

  return (
    <section className={`py-20 ${isDark ? 'bg-[#1e293b]' : 'bg-[#f5f5f7]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Latest Updates</h2>
          <div className="w-20 h-1 bg-drone-blue mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-5 rounded-xl border transition-all ${
                isDark ? 'bg-[#0f172a] border-white/10 hover:border-drone-blue/40' : 'bg-white border-gray-200 hover:border-drone-blue/40'
              }`}
            >
              <span className="inline-block px-2 py-1 bg-drone-blue/20 text-drone-blue text-xs font-medium rounded-full mb-3">
                {item.category || 'News'}
              </span>
              <h3 className={`font-semibold text-sm leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
              {item.date && (
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(item.date).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/news" className="text-drone-blue hover:text-drone-cyan transition-colors font-medium">
            View All News <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePage;