/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 300: '#EE4E4E', 500: '#B30907' },
        secondary: {
          100: '#65D666',
          300: '#42C26C',
          500: '#00B43C',
        },
      },
    },
  },
  plugins: [],
};
