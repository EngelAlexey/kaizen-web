export const TASKS = [
    {
        id: 'home',
        slug: {
            es: undefined, // Root
            en: undefined  // Root
        },
        seo: {
            es: {
                title: 'Kaizen | Gestión de Recursos y Operaciones',
                description: 'Optimiza tu empresa con Kaizen. Gestión de personal, inventarios y control de asistencia en una sola plataforma.'
            },
            en: {
                title: 'Kaizen | Resource and Operations Management',
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
                description: 'Descubre nuestras soluciones: Kaizen (RRHH), Seiri (Asistencia) y BayCo (Inventarios).'
            },
            en: {
                title: 'Our Solutions | Kaizen Apps',
                description: 'Discover our solutions: Kaizen (HR), Seiri (Attendance), and BayCo (Inventory).'
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
    }
] as const;

export type RouteId = typeof TASKS[number]['id'];

export function getRoute(id: RouteId, lang: 'es' | 'en') {
    const task = TASKS.find(t => t.id === id);
    if (!task) return '/';
    const slug = task.slug[lang];
    const prefix = lang === 'es' ? '/es' : '/en';
    return slug ? `${prefix}/${slug}` : `${prefix}/`;
}

export function getSeo(id: RouteId, lang: 'es' | 'en') {
    const task = TASKS.find(t => t.id === id);
    return task?.seo[lang] || { title: 'Kaizen', description: '' };
}
