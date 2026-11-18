import React from 'react';
import { motion } from 'framer-motion';
import AnimatedDrone from './AnimatedDrone';
import { useSiteSettings } from '../context/SiteSettingsContext';

const HeroSection = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-drone-dark via-drone-gray to-drone-dark overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-drone-blue rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-drone-blue/20 border border-drone-blue/40 rounded-full text-drone-blue font-semibold text-sm mb-6">
              <i className="fas fa-drone mr-2"></i>
              {settings?.heroTagline || 'Advanced Drone Research'}
            </div>
            
            <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {settings?.heroTitle || 'Shaping the Future of'} 
              <span className="text-gradient"> Autonomous Flight</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {settings?.heroSubtitle || 'Pioneering research in drone technology, autonomous systems, and aerial robotics.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-drone-blue to-drone-cyan text-white font-semibold rounded-lg shadow-lg shadow-drone-blue/50 hover:shadow-drone-blue/70 transition-all"
              >
                Explore Research
                <i className="fas fa-arrow-right ml-2"></i>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                <i className="fas fa-play mr-2"></i>
                Watch Demo
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-12">
              {(settings?.stats || [
                { value: '50+', label: 'Projects' },
                { value: '200+', label: 'Publications' },
                { value: '30+', label: 'Active Drones' },
              ]).map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-orbitron text-3xl font-bold text-drone-blue">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <AnimatedDrone size={400} />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-drone-blue rounded-full flex justify-center">
          <div className="w-1 h-2 bg-drone-blue rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;