import { useState, useEffect } from 'react';
import { useTranslations } from '../../utils/i18n';
import Brand from './Brand';

export default function MobileMenu({ currentLocale = 'es', currentPath = '/' }) {
    const [isOpen, setIsOpen] = useState(false);

    // Determine if we are on the home page
    const homePath = currentLocale === 'es' ? '/' : '/en';
    const isHome = currentPath === homePath || (homePath !== '/' && currentPath === homePath + '/');

    const t = (key) => {
        const translations = {
            es: {
                'nav.services': 'Servicios',
                'nav.solutions': 'Soluciones',
                'nav.about': 'Nosotros',
                'nav.demo': 'Agendar Demo'
            },
            en: {
                'nav.services': 'Services',
                'nav.solutions': 'Solutions',
                'nav.about': 'About Us',
                'nav.demo': 'Book a Demo'
            }
        };
        return translations[currentLocale]?.[key] || key;
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navItems = [
        {
            text: 'nav.services',
            path: isHome
                ? (currentLocale === 'es' ? '#servicios' : '#services')
                : (currentLocale === 'es' ? '/#servicios' : '/en/#services')
        },
        { text: 'nav.solutions', path: '#soluciones' },
        {
            text: 'nav.about',
            path: isHome ? '#nosotros' : (currentLocale === 'es' ? '/#nosotros' : '/en/#nosotros')
        }
    ];

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-white z-50 transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <a href={currentLocale === 'es' ? '/' : '/en'} className="flex items-center">
                            <Brand />
                        </a>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-700 hover:text-primary transition-colors"
                            aria-label="Close menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        <nav className="space-y-4">
                            {navItems.map((item, i) => (
                                <a
                                    key={i}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-lg font-semibold text-gray-700 hover:text-primary py-3 border-l-4 border-transparent hover:border-primary pl-4 transition-all"
                                >
                                    {t(item.text)}
                                </a>
                            ))}
                        </nav>

                        {/* Language Selector */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="flex gap-4">
                                <a
                                    href="/"
                                    className={`flex-1 text-center px-4 py-3 rounded-md font-bold transition-colors ${currentLocale === 'es'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    ES
                                </a>
                                <a
                                    href="/en"
                                    className={`flex-1 text-center px-4 py-3 rounded-md font-bold transition-colors ${currentLocale === 'en'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    EN
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="p-6 border-t border-gray-200">
                        <a
                            href="#contacto"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-colors"
                        >
                            {t('nav.demo')}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
