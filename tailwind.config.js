/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#0c248b',
                'secondary': '#ea5231',
                'tertiary': '#020F45',
            },
            keyframes: {
                'fade-in-down': {
                    '0%': { opacity: '0', transform: 'translate3d(0,-100px,0)' },
                    '100%': { opacity: '1', transform: 'none' },
                },
                'fade-out-down': {
                    '0%': { opacity: '1', transform: 'none' },
                    '100%': { opacity: '0', transform: 'translate3d(0, 100px,0)' },
                }
            },
            animation: {
                'fade-in-down': 'fade-in-down 200ms linear',
                'fade-out-down': 'fade-out-down 200ms linear'
            },
        },
    },
    plugins: [
        function({ addComponents }) {
            addComponents({
                'li p': {
                    display: 'contents',
                },
                'p + p': {
                    marginTop: '0.6rem',
                }
            })
        },
    ],
}