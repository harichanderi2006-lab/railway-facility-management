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
        // Authentic Chennai Central Heritage Palette from uploaded images
        chennai: {
          red: '#991b1b',        // Terracotta Heritage Brick Red (Image 1 & 2)
          crimson: '#c5222f',    // Clock Tower Crimson Red
          darkRed: '#7f1d1d',    // Deep Victorian Red
          brick: '#881337',      // Colonial Brick Shadow
          yellow: '#facc15',     // Iconic Platform Signboard Yellow (Image 4)
          yellowDark: '#ca8a04', // Signboard Border Ochre
          cream: '#fffbeb',      // Arched Window Cream White
          sand: '#fef3c7',       // Warm Heritage Tint
          night: '#0a0f1d',      // Midnight Station Dashboard
          nightCard: '#111827',  // Elevated Card Slate
        },
        // Transit Network Corridor Colors from Image 3
        corridor: {
          west: '#dc2626',       // Red Line: Chennai Central ↔ Arakkonam
          north: '#2563eb',      // Blue Line: Chennai Central ↔ Gummidipundi / Sullurpeta
          south: '#16a34a',      // Green Line: Chennai Beach / Egmore ↔ Tambaram / Chengalpattu
          mrts: '#ea580c',       // Orange Line: Chennai Beach ↔ Velachery (MRTS)
          interchange: '#7c3aed',// Violet: Metro & Junction Interchange
        },
        railBlue: {
          light: '#3b82f6',
          DEFAULT: '#1d4ed8',
          dark: '#1e3a8a',
          900: '#0f172a',
          50: '#eff6ff',
        },
        railGreen: {
          light: '#22c55e',
          DEFAULT: '#16a34a',
          dark: '#15803d',
          50: '#f0fdf4',
        },
        railRed: {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#991b1b',
          50: '#fef2f2',
        },
        railYellow: {
          light: '#fde047',
          DEFAULT: '#facc15',
          dark: '#ca8a04',
          50: '#fefce8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
        'beacon': 'beacon 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        beacon: {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '70%': { transform: 'scale(1.9)', opacity: '0' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
