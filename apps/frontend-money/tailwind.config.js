import { nextui } from '@nextui-org/react'

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './containers/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ['dark-blue']: '#171436',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: '#FF6600',
            },
            secondary: {
              DEFAULT: '#3C43D4',
            },
            background: {
              DEFAULT: '#161616',
            },
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: '#3C43D4',
            },
            secondary: {
              DEFAULT: '#FF6600',
            },
            background: {
              DEFAULT: '#FFFFFF',
            },
          },
        },
      },
    }),
  ],
}
export default config