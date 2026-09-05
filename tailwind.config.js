/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Black Han Sans"', 'sans-serif'],
      },
      colors: {
        sky: '#7EC8E3',
        sand: '#F2D9A8',
        sandLight: '#FBEEDA',
        sandDark: '#E7C083',
        coral: '#FF6B4A',
        coralDark: '#E85A3B',
        palm: '#2E7D5B',
        palmDark: '#235F45',
        navy: '#1B3A5C',
      },
    },
  },
  plugins: [],
};
