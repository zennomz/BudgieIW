import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'budgie': {
                    bg: '#0b0f14',
                    card: '#101722',
                    muted: '#8892a6',
                    text: '#e6edf3',
                    accent: '#4aa8ff',
                    'accent-2': '#7c4dff',
                    success: '#2ecc71',
                    danger: '#ff6b6b',
                    warning: '#f1c40f',
                },
            },
            borderRadius: {
                'budgie': '16px',
            },
            boxShadow: {
                'budgie': '0 10px 30px rgba(0,0,0,.35)',
            },
        },
    },
    plugins: [],
};
