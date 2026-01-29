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
    // Rule: "El idioma que no esta seleccionado se debe coloreear del opuesto. Si es negro, el texto debe ser blanco, y si es blanco debe ser negro."
    const getInactiveColor = () => {
        // If transparent:
        //   - Light Mode (html:not(.dark)): Background is White/70 -> Text should be Black
        //   - Dark Mode (.dark): Background is Gray/80 -> Text should be White

        // However, this component runs in React and might not react to class changes instantly without the hook.
        // We use the 'isDark' state which is updated by the observer.

        if (transparent) {
            return isDark ? 'white' : 'black';
        }

        // If solid (scrolled):
        //   - Light Mode: Background White -> Text Black
        //   - Dark Mode: Background Dark -> Text White
        return isDark ? 'white' : 'black';
    };

    const getSeparatorColor = () => {
        if (transparent) {
            return isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
        }
        return isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
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
