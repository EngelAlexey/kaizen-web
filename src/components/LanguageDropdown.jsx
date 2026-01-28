import { useState, useEffect } from 'react';

export default function LanguageDropdown({ currentLocale = 'es', transparent = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [activeLocale, setActiveLocale] = useState(currentLocale);

    // Detect current language from URL on mount and when URL changes
    useEffect(() => {
        const detectLanguage = () => {
            const path = window.location.pathname;
            // Check if path starts with /en
            const isEnglish = path.startsWith('/en');
            const detectedLocale = isEnglish ? 'en' : 'es';
            setActiveLocale(detectedLocale);
        };

        detectLanguage();

        // Listen for popstate events (browser back/forward)
        window.addEventListener('popstate', detectLanguage);
        return () => window.removeEventListener('popstate', detectLanguage);
    }, []);

    // Detect dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        // Watch for theme changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const handleLanguageChange = (language) => {
        setIsOpen(false);

        // Navigate to the new language
        const currentPath = window.location.pathname;
        const pathWithoutLang = currentPath.replace(/^\/(es|en)/, '');
        const newPath = language === 'es' ? pathWithoutLang || '/' : `/${language}${pathWithoutLang}`;
        window.location.href = newPath;
    };

    // Helper to get inactive color based on transparent and dark mode
    const getInactiveColor = () => {
        if (transparent) return 'rgba(255,255,255,0.7)'; // Always white/transparent when navbar is transparent
        return isDark ? '#d1d5db' : '#6b7280'; // Light gray in dark mode, darker gray in light mode
    };

    const getSeparatorColor = () => {
        if (transparent) return 'rgba(255,255,255,0.4)';
        return isDark ? '#4b5563' : '#d1d5db';
    };

    return (
        <div className="flex items-center gap-2 text-sm font-bold">
            <button
                onClick={() => handleLanguageChange('es')}
                style={{
                    color: activeLocale === 'es' ? '#E53935' : getInactiveColor()
                }}
                className="transition-colors hover:opacity-80"
            >
                ES
            </button>
            <span style={{ color: getSeparatorColor() }}>|</span>
            <button
                onClick={() => handleLanguageChange('en')}
                style={{
                    color: activeLocale === 'en' ? '#E53935' : getInactiveColor()
                }}
                className="transition-colors hover:opacity-80"
            >
                EN
            </button>
        </div>
    );
}
