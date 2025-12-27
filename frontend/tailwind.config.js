/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                brand: {
                    bg: '#F8F9FB',
                    blue: '#60A5FA',
                    dark: '#323232',
                    gray: '#b6b6b6',
                }
            }
        },
    },
    plugins: [],
}