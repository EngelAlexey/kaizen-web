import { useState, useEffect } from 'react';

export default function LanguageDropdown({
    currentLocale = 'es',
    transparent = false,
    routeMap = {}
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [activeLocale, setActiveLocale] = useState(currentLocale);

    useEffect(() => {
        const detectLanguage = () => {
            const path = window.location.pathname;
            const isEnglish = path.startsWith('/en');
            setActiveLocale(isEnglish ? 'en' : 'es');
        };

        detectLanguage();
        window.addEventListener('popstate', detectLanguage);
        return () => window.removeEventListener('popstate', detectLanguage);
    }, []);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleLanguageChange = (targetLang) => {
        setIsOpen(false);
        const currentPath = window.location.pathname;
        const normalize = (p) => p.endsWith('/') && p.length > 1 ? p.slice(0, -1) : p;
        const normalizedPath = normalize(currentPath);
        let newPath = routeMap[normalizedPath];

        if (!newPath) {
            console.warn(`No translation found for ${currentPath}, falling back to replacement.`);
            const pathWithoutLang = currentPath.replace(/^\/(es|en)/, '');
            newPath = targetLang === 'es'
                ? `/es${pathWithoutLang || '/'}`
                : `/en${pathWithoutLang || '/'}`;
        }

        window.location.href = newPath;
    };

    const getInactiveColor = () => {
        if (transparent) return isDark ? 'white' : 'black';
        return isDark ? 'white' : 'black';
    };

    const getSeparatorColor = () => {
        return isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    };

    return (
        <div className="flex items-center gap-2 text-sm font-bold">
            <button
                onClick={() => handleLanguageChange('es')}
                style={{ color: activeLocale === 'es' ? '#E53935' : getInactiveColor() }}
                className="transition-colors hover:opacity-80"
            >
                ES
            </button>
            <span style={{ color: getSeparatorColor() }}>|</span>
            <button
                onClick={() => handleLanguageChange('en')}
                style={{ color: activeLocale === 'en' ? '#E53935' : getInactiveColor() }}
                className="transition-colors hover:opacity-80"
            >
                EN
            </button>
        </div>
    );
}