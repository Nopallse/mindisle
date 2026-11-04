import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        eden: {
          bg: "#0d1117",
          panel: "#161b22",
          border: "#30363d",
          accent: "#2ea043",
          gold: "#d29922",
          water: "#388bfd",
        },
      },
      fontFamily: {
        pixel: ["monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

