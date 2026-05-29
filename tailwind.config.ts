import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#111118',
          tertiary: '#1a1a24',
        },
        accent: {
          cyan: '#00d4ff',
        },
        text: {
          primary: '#e8e8ed',
          secondary: '#8a8a9a',
          muted: '#5a5a6a',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 212, 255, 0.3)',
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(circle at 15% 20%, rgba(0, 212, 255, 0.12), transparent 18%), radial-gradient(circle at 85% 15%, rgba(0, 212, 255, 0.08), transparent 22%), radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.06), transparent 24%)',
      },
      animation: {
        'mesh-float': 'mesh-float 20s linear infinite',
      },
      keyframes: {
        'mesh-float': {
          '0%, 100%': { transform: 'translate(0%, 0%)' },
          '50%': { transform: 'translate(4%, 3%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
