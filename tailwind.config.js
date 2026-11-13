/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sheikah: {
          darkest: '#080d0b',
          dark: '#0f1715',
          card: '#14211e',
          border: '#1f332e',
          glow: '#00ffcc',
          blue: '#0284c7',
          gold: '#eab308',
          triforce: '#f59e0b',
          kokiri: '#10b981',
          goron: '#ef4444',
          zora: '#38bdf8',
          shadow: '#8b5cf6',
          spirit: '#f97316',
          light: '#fef08a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hylian: ['Cinzel', 'Trajan Pro', 'serif']
      },
      boxShadow: {
        'glow-green': '0 0 15px -3px rgba(16, 185, 129, 0.4)',
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.4)',
        'glow-blue': '0 0 15px -3px rgba(56, 189, 248, 0.4)',
      }
    },
  },
  plugins: [],
}
