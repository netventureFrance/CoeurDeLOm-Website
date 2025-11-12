import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system from WordPress
        primary: '#271340',
        secondary: '#37244E',
        magenta: '#271340',
        framboise: '#43315A',
        ecarlate: '#E9427A',
        rouge: '#E83C31',
        orange: '#F08441',
        'jaune-or': '#F7C14B',
        jaune: '#FBF85A',
        paume: '#C3F351',
        'vert-citron': '#86EF4C',
        vert: '#37EB48',
        'vert-turquoise': '#3BED89',
        'bleu-turquoise': '#3CEFC0',
        cyan: '#46F2F4',
        bleu: '#3BB9EE',
        indigo: '#2E7BE6',
        'bleu-roi': '#1F37E0',
        violet: '#713FE3',
        pourpre: '#B348E6',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Quattrocento Sans', 'serif'],
      },
      fontSize: {
        'display': ['68px', { lineHeight: '1.14' }],
        'display-mobile': ['45px', { lineHeight: '1.2' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-rainbow': 'linear-gradient(90deg, #FBF85A, #C3F351, #86EF4C, #37EB48, #3BED89, #3CEFC0, #46F2F4, #3BB9EE, #2E7BE6, #1F37E0, #713FE3, #B348E6, #E9427A)',
      },
    },
  },
  plugins: [],
};

export default config;
