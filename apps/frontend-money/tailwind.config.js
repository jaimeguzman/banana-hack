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
      keyframes: {
        beacon: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' }
        },
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '0.8'
          },
          '50%': {
            transform: 'scale(2)',
            opacity: '0.5'
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0'
          }
        },
        'wave-1': {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        'wave-2': {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        'wave-3': {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        ping: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        }
      },
      animation: {
        'ripple-1': 'ripple 3s linear infinite',
        'ripple-2': 'ripple 3s linear infinite 1s',
        'ripple-3': 'ripple 3s linear infinite 2s',
        'wave-1': 'wave-1 2s infinite',
        'wave-2': 'wave-2 2s infinite 0.6s',
        'wave-3': 'wave-3 2s infinite 1.2s',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
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
              DEFAULT: '#000000',
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