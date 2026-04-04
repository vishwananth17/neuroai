import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Backgrounds - Anti-gravity dark cosmos aesthetic
        void: '#030306',
        space: '#07070F',
        surface: '#0D0D1C',
        elevated: '#12122A',
        glass: 'rgba(255, 255, 255, 0.035)',
        'glass-hover': 'rgba(255, 255, 255, 0.06)',

        // Brand Colors
        indigo: '#6C63FF',
        cyan: '#00F5FF',
        violet: '#A855F7',
        emerald: '#00FFB2',
        rose: '#FF3D7F',
        amber: '#FFB700',

        // Text
        star: '#FFFFFF',
        primary: '#E8E8FF',
        secondary: '#9898C0',
        muted: '#5A5A80',
        ghost: '#2A2A45',

        // Semantic
        success: '#00FFB2',
        error: '#FF3D7F',
        warning: '#FFB700',
        info: '#00F5FF',
      },

      backgroundColor: {
        base: 'rgb(var(--color-void))',
      },

      backgroundImage: {
        'grad-brand':
          'linear-gradient(135deg, #6C63FF, #00F5FF)',
        'grad-hero':
          'linear-gradient(160deg, #6C63FF 0%, #A855F7 50%, #00F5FF 100%)',
        'grad-card':
          'linear-gradient(180deg, rgba(108,99,255,0.06) 0%, transparent 60%)',
        'grad-shine':
          'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
      },

      boxShadow: {
        'glow-indigo-sm': '0 0 16px rgba(108, 99, 255, 0.25)',
        'glow-indigo-md': '0 0 32px rgba(108, 99, 255, 0.35)',
        'glow-indigo-lg': '0 0 64px rgba(108, 99, 255, 0.2)',
        'glow-cyan-sm': '0 0 16px rgba(0, 245, 255, 0.2)',
        'glow-cyan-md': '0 0 32px rgba(0, 245, 255, 0.3)',
      },

      borderColor: {
        glass: 'rgba(255, 255, 255, 0.06)',
        'glow-indigo': 'rgba(108, 99, 255, 0.35)',
        'glow-cyan': 'rgba(0, 245, 255, 0.25)',
      },

      fontFamily: {
        display: ['Syne', ...defaultTheme.fontFamily.sans],
        mono: ['DM Mono', ...defaultTheme.fontFamily.mono],
      },

      fontSize: {
        xs: ['11px', { fontWeight: '500', letterSpacing: '0.18em' }],
        sm: ['13px', { lineHeight: '1.6' }],
        base: ['15px', { lineHeight: '1.75' }],
        lg: ['18px', { fontWeight: '600', lineHeight: '1.5' }],
        xl: ['24px', { fontWeight: '600', lineHeight: '1.4' }],
        '2xl': ['32px', { fontWeight: '700', lineHeight: '1.3' }],
        '3xl': ['48px', { fontWeight: '700', letterSpacing: '-0.01em' }],
        hero: ['72px', { fontWeight: '800', letterSpacing: '-0.02em' }],
      },

      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'text-shimmer': 'text-shimmer 0.75s ease-in-out infinite',
      },

      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      spacing: {
        'glass-padding': '28px 32px',
      },

      borderRadius: {
        xl: '20px',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};

export default config;
