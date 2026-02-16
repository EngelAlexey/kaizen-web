import tailwindcssAnimated from 'tailwindcss-animated';


export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
                'primary-hover': 'rgb(var(--color-primary-hover-rgb) / <alpha-value>)',
                'primary-soft': 'rgb(var(--color-primary-rgb) / 0.15)',

                blue: 'rgb(var(--color-blue-rgb) / <alpha-value>)',
                purple: 'rgb(var(--color-purple-rgb) / <alpha-value>)',
                emerald: 'rgb(var(--color-emerald-rgb) / <alpha-value>)',
                orange: 'rgb(var(--color-orange-rgb) / <alpha-value>)',

                background: 'rgb(var(--color-background-rgb) / <alpha-value>)',
                foreground: 'rgb(var(--color-foreground-rgb) / <alpha-value>)',
                panel: 'rgb(var(--color-panel-rgb) / <alpha-value>)',
                muted: 'rgb(var(--color-muted-rgb) / <alpha-value>)',
                border: 'rgb(var(--color-border-rgb) / <alpha-value>)',
            },
            boxShadow: {
                soft: 'var(--shadow-soft)',
                strong: 'var(--shadow-strong)',
                glow: '0 0 20px rgba(178, 34, 34, 0.35)', // Keeping glow as a manual fallback or custom
            },
        },
    },
    plugins: [tailwindcssAnimated],
};
