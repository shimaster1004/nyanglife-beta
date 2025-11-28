/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#eb9947',
                'primary-dark': '#d68235',
                background: '#f8f7f6',
                surface: '#ffffff',
            },
            fontFamily: {
                sans: ['Noto Sans KR', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
