/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      extend: {
        colors: {
          primary: "var(--primary)",
          'primary-hover': "var(--primary-hover)",
          secondary: "#10b981",
          dark: "var(--dark)",
        },
        fontFamily: {
          sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
          mono: ['var(--font-geist-mono)', 'monospace'],
        },
        backgroundColor: {
          primary: "var(--primary)",
        },
        textColor: {
          primary: "var(--primary)",
        },
        borderColor: {
          primary: "var(--primary)",
        },
        ringColor: {
          primary: "var(--primary)",
        }
      },
    },
    plugins: [],
  }