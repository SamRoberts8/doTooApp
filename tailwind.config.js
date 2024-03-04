module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  theme: {},
  variants: {},
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.draggable': {
          '-webkit-app-region': 'drag',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
