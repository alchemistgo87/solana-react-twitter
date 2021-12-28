module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          base: "#2f19bf",
          light: "#4c37db",
          extralight: "#9a8eed",
          dark: "#1905a1",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
