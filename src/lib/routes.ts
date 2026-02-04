export const TASKS = [
    {
        id: 'home',
        slug: {
            es: undefined,
            en: undefined
        },
        seo: {
            es: {
                title: 'Gestión de Recursos y Operaciones',
                description: 'Optimiza tu empresa con Kaizen. Gestión de personal, inventarios y control de asistencia en una sola plataforma.'
            },
            en: {
                title: 'Resource and Operations Management',
                description: 'Optimize your business with Kaizen. Personnel management, inventory, and attendance control in a single platform.'
            }
        }
    },
    {
        id: 'solutions',
        slug: {
            es: 'soluciones',
            en: 'solutions'
        },
        seo: {
            es: {
                title: 'Nuestras Soluciones | Kaizen Apps',
                description: 'Descubre nuestras soluciones integrales: Kaizen (RRHH), Seiri (Asistencia) y BayCo (Inventarios).'
            },
            en: {
                title: 'Our Solutions | Kaizen Apps',
                description: 'Discover our comprehensive solutions: Kaizen (HR), Seiri (Attendance), and BayCo (Inventory).'
            }
        }
    },
    {
        id: 'booking',
        slug: {
            es: 'agendar',
            en: 'booking'
        },
        seo: {
            es: {
                title: 'Agendar Demostración | Kaizen',
                description: 'Agenda una cita con nosotros para conocer cómo Kaizen puede ayudar a tu empresa.'
            },
            en: {
                title: 'Book a Demo | Kaizen',
                description: 'Schedule a meeting with us to learn how Kaizen can help your business.'
            }
        }
    },

    {
        id: 'sol-assistance',
        slug: {
            es: 'soluciones/control-asistencias',
            en: 'solutions/attendance-management'
        },
        seo: {
            es: { title: 'Control de Asistencias', description: 'Gestión moderna de asistencia y puntualidad.' },
            en: { title: 'Attendance Management', description: 'Modern attendance and punctuality management.' }
        }
    },
    {
        id: 'sol-rrhh',
        slug: {
            es: 'soluciones/recursos-humanos',
            en: 'solutions/human-resources'
        },
        seo: {
            es: { title: 'Recursos Humanos', description: 'Centraliza la información de tus colaboradores.' },
            en: { title: 'Human Management', description: 'Centralize your employees information.' }
        }
    },
    {
        id: 'sol-projects',
        slug: {
            es: 'soluciones/gestion-proyectos',
            en: 'solutions/project-management'
        },
        seo: {
            es: { title: 'Gestión de Proyectos', description: 'Planificación y seguimiento de actividades.' },
            en: { title: 'Project Management', description: 'Planning and tracking of activities.' }
        }
    },
    {
        id: 'sol-ssoma',
        slug: {
            es: 'soluciones/salud-ocupacional',
            en: 'solutions/occupational-health'
        },
        seo: {
            es: { title: 'Salud y Seguridad Ocupacional', description: 'Seguridad, Salud Ocupacional y Medio Ambiente.' },
            en: { title: 'Occupational Health and Safety', description: 'Environment, Health, and Safety management.' }
        }
    },
    {
        id: 'sol-payroll',
        slug: {
            es: 'soluciones/gestion-nominas',
            en: 'solutions/payroll-management'
        },
        seo: {
            es: { title: 'Gestión de Planilla', description: 'Automatización y cálculo de planillas.' },
            en: { title: 'Payroll Management', description: 'Payroll automation and calculation.' }
        }
    },
    {
        id: 'sol-assets',
        slug: {
            es: 'soluciones/control-activos',
            en: 'solutions/assets-control'
        },
        seo: {
            es: { title: 'Control de Activos', description: 'Gestión inteligente de inventarios y activos.' },
            en: { title: 'Assets Control', description: 'Intelligent inventory and asset management.' }
        }
    },
    {
        id: 'privacy',
        slug: {
            es: 'politica-de-privacidad',
            en: 'privacy-policy'
        },
        seo: {
            es: { title: 'Política de Privacidad | Kaizen', description: 'Nuestra política de privacidad y protección de datos.' },
            en: { title: 'Privacy Policy | Kaizen', description: 'Our privacy policy and data protection.' }
        }
    },
    {
        id: 'terms',
        slug: {
            es: 'terminos-de-uso',
            en: 'terms-of-use'
        },
        seo: {
            es: { title: 'Términos de Uso | Kaizen', description: 'Términos y condiciones de uso de nuestra plataforma.' },
            en: { title: 'Terms of Use | Kaizen', description: 'Terms and conditions of use for our platform.' }
        }
    },
] as const;

export type RouteId = typeof TASKS[number]['id'];

export function getRoute(id: RouteId, lang: 'es' | 'en') {
    const task = TASKS.find(t => t.id === id);
    if (!task) return '/';
    const slug = task.slug[lang];
    const prefix = lang === 'es' ? '' : '/en';
    const urlPrefix = lang === 'es' ? '/es' : '/en';
    return slug ? `${urlPrefix}/${slug}` : `${urlPrefix}/`;
}

export function getSeo(id: RouteId, lang: 'es' | 'en') {
    const task = TASKS.find(t => t.id === id);
    return task?.seo[lang] || { title: 'Kaizen', description: '' };
}

export function getSlugById(id: RouteId, lang: 'es' | 'en') {
    const task = TASKS.find(t => t.id === id);
    return task?.slug[lang];
}

export function getHtmlIdFromRouteId(routeId: RouteId): string | undefined {
    const map: Partial<Record<RouteId, string>> = {
        'sol-assistance': 'asistencias',
        'sol-rrhh': 'rrhh',
        'sol-projects': 'actividades',
        'sol-ssoma': 'ssoma',
        'sol-payroll': 'finanzas',
        'sol-assets': 'activos'
    };
    return map[routeId];
}

export function isSolutionsChild(id: string) {
    return id.startsWith('sol-');
}