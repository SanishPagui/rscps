import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        discord: '#7289da',
        'dark-discord': '#4752c4',
        'dark-gray': '#dfe1e4',
        'medium-gray': '#f0f1f3',
        'light-gray': '#e8eaec',
        'hover-gray': '#cdcfd3',
        'composer-gray': 'hsl(210 calc( 1 * 11.1%) 92.9% / 1);',
        'gray-normal': '#313338',
      },
    },
  },
  plugins: [],
} satisfies Config;
