/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#E6CAAB',
        surface: '#F3E7D9',
        'surface-hover': '#ebd8c2',
        primary: {
          light: '#926347',
          DEFAULT: '#5C321E',
          dark: '#452212',
        },
        secondary: {
          light: '#C9A07A',
          DEFAULT: '#926347',
          dark: '#754d33',
        },
        accent: '#C9A07A',
        'shade-5': '#F3E7D9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #5C321E, #926347, #C9A07A)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, #F3E7D9 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(92, 50, 30, 0.15)',
      }
    },
  },
  plugins: [],
}
