import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#03466e",
        secondary: "#ed631d",
        hover: "#303f47"
      },
      textColor: {
        primary: "#03466e",
        secondary: "#ed631d",
        hover: "#303f47",
        serviceTitle: "#f7bb5d"
      },
      borderColor: {
        primary: "#03466e",
        secondary: "#ed631d",
        hover: "#303f47"
      },
      backgroundImage: {
        'bg-degil': "url('../assets/bg-degil.png')",
      }
    },
    screens: {
      'xs': '544px',
      // => @media (min-width: 544px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      '2md': '860px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [],
}
export default config
