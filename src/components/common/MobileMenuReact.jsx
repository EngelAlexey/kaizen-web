import React, { useState, useEffect, useCallback } from 'react';
import kLogo from '../../assets/img/K.png';
import { Sun, Moon, Calendar } from 'lucide-react';

const MobileMenuReact = ({ lang, t, routeMapJson, currentPath }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const routeMap = JSON.parse(routeMapJson);

    // Initialize theme from document or localStorage
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');

        // Sync with global theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDarkNow = document.documentElement.classList.contains('dark');
                    setTheme(isDarkNow ? 'dark' : 'light');
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('kaizen.dark', '1');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('kaizen.dark', '0');
        }
    };

    const toggleSolutions = (e) => {
        e.preventDefault();
        setIsSolutionsOpen(!isSolutionsOpen);
    };

    const closeMenu = useCallback(() => {
        setIsOpen(false);
        document.body.classList.remove('menu-open');
        window.dispatchEvent(new CustomEvent('kaizen:menu-state', { detail: { isOpen: false } }));
    }, []);

    const openMenu = useCallback(() => {
        setIsOpen(true);
        document.body.classList.add('menu-open');
        window.dispatchEvent(new CustomEvent('kaizen:menu-state', { detail: { isOpen: true } }));
    }, []);

    useEffect(() => {
        const handleToggle = (e) => {
            const force = e.detail?.force;
            if (force === true) openMenu();
            else if (force === false) closeMenu();
            else {
                if (isOpen) closeMenu();
                else openMenu();
            }
        };

        window.addEventListener('kaizen:toggle-menu', handleToggle);
        const handleEsc = (e) => { if (e.key === 'Escape') closeMenu(); };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('kaizen:toggle-menu', handleToggle);
            window.removeEventListener('keydown', handleEsc);
            document.body.classList.remove('menu-open');
        };
    }, [isOpen, openMenu, closeMenu]);

    useEffect(() => {
        closeMenu();
    }, [currentPath, closeMenu]);

    const handleLangChange = (targetLang) => {
        const normalize = (p) => p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;
        const normalizedPath = normalize(window.location.pathname);
        let newPath = routeMap[normalizedPath];

        if (!newPath) {
            const pathParts = window.location.pathname.split("/").filter(Boolean);
            if (pathParts.length === 0 || (pathParts.length === 1 && (pathParts[0] === "es" || pathParts[0] === "en"))) {
                newPath = targetLang === "es" ? "/" : "/en";
            } else {
                const withoutLang = pathParts.filter(p => p !== "es" && p !== "en");
                newPath = targetLang === "es" ? `/es/${withoutLang.join("/")}` : `/en/${withoutLang.join("/")}`;
            }
        }
        window.location.href = newPath;
    };

    const solutionsItems = [
        { text: t["module.assistance.title"], path: lang === "es" ? "/soluciones/control-asistencias" : "/en/solutions/attendance-management" },
        { text: t["module.rrhh.title"], path: lang === "es" ? "/soluciones/recursos-humanos" : "/en/solutions/human-resources" },
        { text: t["module.projects.title"], path: lang === "es" ? "/soluciones/gestion-proyectos" : "/en/solutions/project-management" },
        { text: t["module.ssoma.title"], path: lang === "es" ? "/soluciones/salud-ocupacional" : "/en/solutions/occupational-health" },
        { text: t["module.payroll.title"], path: lang === "es" ? "/soluciones/gestion-nominas" : "/en/solutions/payroll-management" },
        { text: t["module.assets.title"], path: lang === "es" ? "/soluciones/control-activos" : "/en/solutions/assets-control" },
    ];

    return (
        <div
            id="mobile-menu"
            className={`fixed inset-0 lg:hidden z-[10000] transition-all duration-300 ease-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
        >
            {/* Heavy-duty opaque background */}
            <div
                className={`fixed inset-0 bg-glass z-[-1] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Ambient Glow */}
            <div className={`fixed inset-0 pointer-events-none z-0 bg-ambient-glow transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

            <div className={`min-h-full flex flex-col transition-all duration-300 ease-out p-6 pt-6 z-10 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>

                {/* Header inside menu */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <img src={kLogo.src} alt="Kaizen" className="w-8 h-8 object-contain" />
                        <span className="font-black text-2xl tracking-tighter">KAIZEN</span>
                    </div>
                    <button
                        onClick={closeMenu}
                        className="p-3 text-foreground/50 hover:text-primary transition-colors active:scale-90"
                        aria-label="Close menu"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1">
                    <ul className="space-y-1">
                        <li className={`transition-all duration-300 delay-75 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}>
                            <a
                                href={lang === "es" ? "/servicios" : "/en/services"}
                                className="text-lg font-bold text-foreground/90 hover:text-primary transition-all block py-3 px-4 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10"
                            >
                                {t["nav.services"]}
                            </a>
                        </li>

                        <li className={`transition-all duration-300 delay-100 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}>
                            <div>
                                <button
                                    onClick={toggleSolutions}
                                    className="text-lg font-bold text-foreground/90 hover:text-primary transition-all block py-3 px-4 rounded-xl hover:bg-primary/5 w-full flex justify-between items-center group border border-transparent hover:border-primary/10"
                                >
                                    {t["nav.solutions"]}
                                    <svg className={`transition-transform duration-300 w-5 h-5 opacity-40 group-hover:opacity-100 ${isSolutionsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isSolutionsOpen ? 'max-h-[500px] opacity-100 mt-1 mb-4' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <ul className="pl-6 space-y-1 border-l-2 border-primary/20 ml-6">
                                        {solutionsItems.map((item, idx) => (
                                            <li key={idx}>
                                                <a
                                                    href={item.path}
                                                    onClick={closeMenu}
                                                    className="block text-base font-medium text-muted-foreground hover:text-primary transition-all py-2 px-3 rounded-lg hover:bg-primary/5"
                                                >
                                                    {item.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </li>

                        <li className={`transition-all duration-300 delay-150 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}>
                            <a
                                href={lang === 'es' ? '/es/nosotros' : '/en/about'}
                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all group"
                                onClick={closeMenu}
                            >    {t["nav.about"]}
                            </a>
                        </li>
                    </ul>

                    {/* Theme & Language Section */}
                    <div className={`mt-10 pt-8 border-t border-border/40 transition-all duration-300 delay-200 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="flex items-center justify-between mb-6 px-4">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">PREFERENCIAS</p>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-muted/5 border border-border/40 text-[10px] font-bold hover:bg-primary/10 transition-colors"
                            >
                                {theme === 'light' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                                {theme === 'light' ? 'MODO OSCURO' : 'MODO CLARO'}
                            </button>
                        </div>

                        <div className="flex gap-3 px-4">
                            <button
                                onClick={() => handleLangChange('es')}
                                className={`flex-1 text-center py-2.5 rounded-xl font-bold text-xs transition-all border-2 ${lang === 'es' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-muted/5 text-foreground border-transparent hover:bg-muted/10'}`}
                            >
                                Español
                            </button>
                            <button
                                onClick={() => handleLangChange('en')}
                                className={`flex-1 text-center py-2.5 rounded-xl font-bold text-xs transition-all border-2 ${lang === 'en' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-muted/5 text-foreground border-transparent hover:bg-muted/10'}`}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </nav>

                {/* CTA Section */}
                <div className={`mt-auto pt-8 pb-4 transition-all duration-300 delay-250 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <a
                        href={lang === 'es' ? '/es/agendar' : '/en/booking'}
                        className="flex-1 btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                        onClick={closeMenu}
                    >
                        <Calendar size={18} />
                        {t('hero.quote')}
                    </a></div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .bg-glass {
          background-color: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(28px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .dark .bg-glass {
          background-color: rgba(9, 9, 11, 0.98) !important;
          backdrop-filter: blur(28px) saturate(150%) !important;
          -webkit-backdrop-filter: blur(28px) saturate(150%) !important;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .bg-ambient-glow {
            background: radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.05), transparent 70%);
        }
        body.menu-open {
          overflow: hidden !important;
          touch-action: none;
        }
        :root {
            --primary-rgb: 220, 38, 38; /* Approximate value, assuming red theme */
        }
      `}} />
        </div>
    );
};

export default MobileMenuReact;
