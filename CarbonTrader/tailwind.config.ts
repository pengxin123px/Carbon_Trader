import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/preline/preline.js',],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        slate: {
          850: 'hsl(222deg 47% 16%)'
        },
        primary: '#5fc3e7',
        bg: '#f9f9f9'
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Monaco', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
    },
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.925rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem'
    },
    container: {
      center: true,
      screens: {
        sm: '50rem'
      }
    }
  },
  plugins: [require('preline/plugin')]
};
export default config;
