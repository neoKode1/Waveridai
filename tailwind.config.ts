import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary color scheme - Enhanced with more vibrant tones
        primary: {
          50: 'oklch(98% 0.005 261)',
          100: 'oklch(95% 0.01 261)',
          200: 'oklch(90% 0.015 261)',
          300: 'oklch(85% 0.02 261)',
          400: 'oklch(80% 0.025 261)',
          500: 'oklch(70.7% 0.022 261.325)',
          600: 'oklch(65% 0.03 261)',
          700: 'oklch(60% 0.04 261)',
          800: 'oklch(55% 0.05 261)',
          900: 'oklch(50% 0.06 261)',
          950: 'oklch(45% 0.07 261)',
        },
        // Secondary colors (cyan/teal for futuristic feel)
        secondary: {
          50: 'oklch(98% 0.005 180)',
          100: 'oklch(95% 0.01 180)',
          200: 'oklch(90% 0.02 180)',
          300: 'oklch(85% 0.04 180)',
          400: 'oklch(80% 0.06 180)',
          500: 'oklch(75% 0.08 180)',
          600: 'oklch(70% 0.1 180)',
          700: 'oklch(65% 0.12 180)',
          800: 'oklch(60% 0.14 180)',
          900: 'oklch(55% 0.16 180)',
          950: 'oklch(50% 0.18 180)',
        },
        // Neutral colors - Slightly tinted for depth
        neutral: {
          50: 'oklch(98% 0.002 261)',
          100: 'oklch(95% 0.003 261)',
          200: 'oklch(90% 0.005 261)',
          300: 'oklch(85% 0.007 261)',
          400: 'oklch(75% 0.01 261)',
          500: 'oklch(65% 0.012 261)',
          600: 'oklch(55% 0.015 261)',
          700: 'oklch(45% 0.017 261)',
          800: 'oklch(35% 0.02 261)',
          900: 'oklch(25% 0.022 261)',
          950: 'oklch(15% 0.025 261)',
        },
        // Accent colors - Vibrant and energetic
        accent: {
          purple: 'oklch(70% 0.2 300)',
          blue: 'oklch(70% 0.2 240)',
          cyan: 'oklch(75% 0.15 200)',
          green: 'oklch(70% 0.18 140)',
          orange: 'oklch(75% 0.18 50)',
          pink: 'oklch(75% 0.2 340)',
        },
        // Semantic colors
        success: 'oklch(70% 0.15 142)',
        warning: 'oklch(75% 0.18 85)',
        error: 'oklch(70% 0.2 25)',
        info: 'oklch(75% 0.15 220)',
        
        // Background and foreground
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, oklch(70.7% 0.1 261.325), oklch(60% 0.12 240))',
        'gradient-secondary': 'linear-gradient(135deg, oklch(75% 0.1 180), oklch(65% 0.12 160))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(135deg, oklch(70.7% 0.15 261.325 / 0.2) 0%, transparent 50%, oklch(75% 0.15 180 / 0.2) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-left': 'slideLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slideRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px oklch(70.7% 0.15 261.325 / 0.4), 0 0 40px oklch(70.7% 0.15 261.325 / 0.2)',
          },
          '50%': { 
            boxShadow: '0 0 30px oklch(70.7% 0.2 261.325 / 0.6), 0 0 60px oklch(70.7% 0.2 261.325 / 0.3)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        borderFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px oklch(70.7% 0.15 261.325 / 0.3)',
        'glow': '0 0 20px oklch(70.7% 0.15 261.325 / 0.4), 0 0 40px oklch(70.7% 0.15 261.325 / 0.2)',
        'glow-lg': '0 0 30px oklch(70.7% 0.2 261.325 / 0.5), 0 0 60px oklch(70.7% 0.2 261.325 / 0.3)',
        'glow-cyan': '0 0 20px oklch(75% 0.15 180 / 0.4), 0 0 40px oklch(75% 0.15 180 / 0.2)',
        'inner-glow': 'inset 0 0 20px oklch(70.7% 0.15 261.325 / 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
