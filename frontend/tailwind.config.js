/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',      // Corporate Blue
          darkBlue: '#1E40AF',  // Deep Slate Blue
          navy: '#0F172A',      // Dark Slate Headings
          red: '#EF4444',       // Logo Red Accent / Breached SLA
          green: '#84CC16',     // Logo Green Accent / Resolved
          mint: '#10B981',      // Success badge
          softBg: '#F8FAFC',    // Soft Off-White Background
          cardBorder: '#E2E8F0' // Subtle card border
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
