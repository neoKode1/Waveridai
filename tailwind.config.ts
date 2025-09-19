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
        // Primary color scheme based on oklch(70.7% 0.022 261.325)
        primary: {
          50: 'oklch(95% 0.005 261)',
          100: 'oklch(90% 0.01 261)',
          200: 'oklch(85% 0.015 261)',
          300: 'oklch(80% 0.02 261)',
          400: 'oklch(75% 0.025 261)',
          500: 'oklch(70.7% 0.022 261.325)', // Base color
          600: 'oklch(65% 0.025 261)',
          700: 'oklch(60% 0.03 261)',
          800: 'oklch(55% 0.035 261)',
          900: 'oklch(50% 0.04 261)',
          950: 'oklch(45% 0.045 261)',
        },
        // Secondary colors (complementary)
        secondary: {
          50: 'oklch(95% 0.005 81)',
          100: 'oklch(90% 0.01 81)',
          200: 'oklch(85% 0.015 81)',
          300: 'oklch(80% 0.02 81)',
          400: 'oklch(75% 0.025 81)',
          500: 'oklch(70% 0.03 81)',
          600: 'oklch(65% 0.035 81)',
          700: 'oklch(60% 0.04 81)',
          800: 'oklch(55% 0.045 81)',
          900: 'oklch(50% 0.05 81)',
          950: 'oklch(45% 0.055 81)',
        },
        // Neutral colors
        neutral: {
          50: 'oklch(98% 0 0)',
          100: 'oklch(95% 0 0)',
          200: 'oklch(90% 0 0)',
          300: 'oklch(85% 0 0)',
          400: 'oklch(75% 0 0)',
          500: 'oklch(65% 0 0)',
          600: 'oklch(55% 0 0)',
          700: 'oklch(45% 0 0)',
          800: 'oklch(35% 0 0)',
          900: 'oklch(25% 0 0)',
          950: 'oklch(15% 0 0)',
        },
        // Accent colors
        accent: {
          purple: 'oklch(65% 0.15 300)',
          blue: 'oklch(65% 0.15 240)',
          green: 'oklch(65% 0.15 120)',
          orange: 'oklch(65% 0.15 40)',
          red: 'oklch(65% 0.15 20)',
        },
        // Semantic colors
        success: 'oklch(65% 0.12 142)',
        warning: 'oklch(70% 0.15 85)',
        error: 'oklch(65% 0.15 25)',
        info: 'oklch(70% 0.12 200)',
        
        // Background and foreground
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, oklch(70.7% 0.022 261.325), oklch(60% 0.03 261))',
        'gradient-secondary': 'linear-gradient(135deg, oklch(70% 0.03 81), oklch(60% 0.04 81))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
