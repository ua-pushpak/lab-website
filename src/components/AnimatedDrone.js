import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AnimatedDrone = ({ size = 200, flying = true }) => {
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const droneRef = useRef(null);

  useEffect(() => {
    if (flying) {
      controls.start({
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    }
  }, [controls, flying]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = droneRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setMousePosition({
          x: (e.clientX - centerX) / 20,
          y: (e.clientY - centerY) / 20,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={droneRef}
      animate={controls}
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: `perspective(500px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="droneBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <radialGradient id="droneGlow">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Glow effect */}
        <circle cx="100" cy="100" r="80" fill="url(#droneGlow)" />

        {/* Drone arms */}
        {[
          { x1: 80, y1: 80, x2: 40, y2: 40, angle: 45 },
          { x1: 120, y1: 80, x2: 160, y2: 40, angle: -45 },
          { x1: 80, y1: 120, x2: 40, y2: 160, angle: 135 },
          { x1: 120, y1: 120, x2: 160, y2: 160, angle: -135 },
        ].map((arm, index) => (
          <g key={index}>
            {/* Arm */}
            <line
              x1={arm.x1}
              y1={arm.y1}
              x2={arm.x2}
              y2={arm.y2}
              stroke="#475569"
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Motor */}
            <circle cx={arm.x2} cy={arm.y2} r="12" fill="#334155" />
            <circle cx={arm.x2} cy={arm.y2} r="8" fill="#1e293b" />
            
            {/* Propeller */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2,
              }}
              style={{ transformOrigin: `${arm.x2}px ${arm.y2}px` }}
            >
              <ellipse
                cx={arm.x2}
                cy={arm.y2}
                rx="18"
                ry="4"
                fill="rgba(14, 165, 233, 0.3)"
                stroke="#0ea5e9"
                strokeWidth="1"
              />
            </motion.g>
          </g>
        ))}

        {/* Main body */}
        <ellipse cx="100" cy="100" rx="35" ry="25" fill="url(#droneBody)" filter="url(#glow)" />
        
        {/* Body details */}
        <ellipse cx="100" cy="100" rx="30" ry="20" fill="#1e293b" opacity="0.8" />
        <rect x="85" y="90" width="30" height="20" rx="5" fill="#0f172a" />
        
        {/* Camera */}
        <circle cx="100" cy="110" r="8" fill="#0ea5e9" />
        <circle cx="100" cy="110" r="4" fill="#e2e8f0" />
        
        {/* LED indicators */}
        <motion.circle
          cx="85"
          cy="95"
          r="2"
          fill="#ef4444"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="115"
          cy="95"
          r="2"
          fill="#10b981"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Landing gear */}
        {[[-20, 15], [20, 15]].map(([dx, dy], index) => (
          <line
            key={index}
            x1={100 + dx}
            y1={110}
            x2={100 + dx}
            y2={130}
            stroke="#64748b"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </motion.div>
  );
};

export default AnimatedDrone;