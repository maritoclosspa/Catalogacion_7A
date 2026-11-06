import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        coral: "#ef6a5b",
        cream: "#f7f5ef",
      },
    },
  },
  plugins: [],
} satisfies Config;
