import { useState, useEffect } from 'react';

export default function LanguageDropdown({ currentLocale = 'es', routeMap = {} }) {
    const [activeLocale, setActiveLocale] = useState(currentLocale);

    useEffect(() => {
        const detect = () => {
            setActiveLocale(window.location.pathname.startsWith('/en') ? 'en' : 'es');
        };
        detect();
        window.addEventListener('popstate', detect);
        return () => window.removeEventListener('popstate', detect);
    }, []);

    const handleLanguageChange = (targetLang) => {
        const currentPath = window.location.pathname;
        const normalize = (p) => p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p;
        const normalizedPath = normalize(currentPath);
        let newPath = routeMap[normalizedPath];

        if (!newPath) {
            const pathWithoutLang = currentPath.replace(/^\/(es|en)/, '');
            newPath = targetLang === 'es'
                ? `/es${pathWithoutLang || '/'}`
                : `/en${pathWithoutLang || '/'}`;
        }

        window.location.href = newPath;
    };

    return (
        <div className="flex items-center gap-2 text-sm font-bold">
            <button
                onClick={() => handleLanguageChange('es')}
                style={{ color: activeLocale === 'es' ? 'var(--color-primary)' : 'currentColor' }}
                className="transition-colors hover:opacity-80"
            >
                ES
            </button>
            <span className="opacity-50">|</span>
            <button
                onClick={() => handleLanguageChange('en')}
                style={{ color: activeLocale === 'en' ? 'var(--color-primary)' : 'currentColor' }}
                className="transition-colors hover:opacity-80"
            >
                EN
            </button>
        </div>
    );
}
