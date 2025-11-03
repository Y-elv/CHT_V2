/* eslint-disable */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["poppins"],
        body: ['"poppins"'],
      },
      colors: {
        customBlack: "#262626",
      },
      borderRadius: {
        sm: "5px",
        md: "8px",
        lg: "10px",
        xl: "16px",
        "2xl": "24px",
      },

      screens: {
        phone: "450px",
        bigphone: "650px",
        tablet: "860px",
        laptop: "1200px",
        xs: "510px",
      },
      height: {
        "50vh": "50vh",
      },
      boxShadow: {
        "black-shadow":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      fontSize: {
        "custom-size": "0.60rem",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".outline-none": {
          outline: "0",
        },
      });
    },
  ],
};
