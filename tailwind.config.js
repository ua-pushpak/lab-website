module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'drone': {
          blue: '#0ea5e9',
          dark: '#0f172a',
          gray: '#1e293b',
          light: '#f0f9ff',
          cyan: '#06b6d4',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'drone-hover': 'drone-hover 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'drone-hover': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-15px) rotate(2deg)' },
          '75%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}