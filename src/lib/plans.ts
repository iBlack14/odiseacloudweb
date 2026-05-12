/**
 * Odisea Plan & Service Definitions
 */

export interface HostingPlan {
  id: string;
  name: string;
  price: number;
  price_pen?: number;
  features: string[];
  type: 'shared' | 'reseller' | 'web-design' | 'web-system' | 'addon' | 'combo';
  description?: string;
  note?: string;
  popular?: boolean;
  disk_quota_mb?: number;
  bandwidth_mb?: number;
}

const STATIC_FALLBACK: HostingPlan[] = [
  // ── Hosting Compartido
  {
    id: 'unlimited',
    name: 'Unlimited Hosting Plan',
    price: 49.99,
    type: 'shared',
    popular: true,
    description: 'Poder absoluto sin restricciones para tu negocio.',
    features: ['Espacio NVMe Ilimitado', 'Transferencia Ilimitada', 'Cuentas Email Ilimitadas', 'SSL Wildcard gratis', 'Soporte VIP 24/7']
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 4.99,
    type: 'shared',
    description: 'Para blogs y proyectos personales.',
    features: ['5 GB NVMe SSD', '50 GB Transferencia', '1 Sitio Web', 'SSL Gratis', 'Correos Ilimitados']
  },
  {
    id: 'business',
    name: 'Business',
    price: 14.99,
    type: 'shared',
    description: 'Para empresas en crecimiento.',
    popular: true,
    features: ['20 GB NVMe SSD', 'Transferencia Ilimitada', '10 Sitios Web', 'Backups diarios', 'WordPress preinstalado']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    type: 'shared',
    description: 'Para proyectos de alto tráfico.',
    features: ['60 GB NVMe SSD', 'Transferencia Ilimitada', 'Sitios Ilimitados', 'Staging environment', 'IP dedicada']
  },

  // ── Reseller WHM
  {
    id: 'reseller-bronze',
    name: 'Reseller Bronze',
    price: 29.99,
    type: 'reseller',
    description: 'Empieza tu propio negocio de hosting.',
    features: ['10 cuentas cPanel', '100 GB NVMe SSD', 'Marca blanca total', 'WHM incluido', 'SSL gratis por cuenta']
  },
  {
    id: 'reseller-silver',
    name: 'Reseller Silver',
    price: 89.99,
    type: 'reseller',
    popular: true,
    description: 'Para revendedores con cartera activa.',
    features: ['50 cuentas cPanel', '500 GB NVMe SSD', 'Marca blanca total', 'Overselling permitido', 'Soporte prioritario']
  },
  {
    id: 'reseller-gold',
    name: 'Reseller Gold',
    price: 199.99,
    type: 'reseller',
    description: 'Agencias de gran escala.',
    features: ['Cuentas ilimitadas', '2 TB NVMe SSD', 'Marca blanca total', 'IP dedicada', 'SLA premium 99.99%']
  },

  // ── Webs Corporativas
  {
    id: 'web-basic',
    name: 'Web Básica',
    price: 349.00,
    type: 'web-design',
    description: 'Presencia digital profesional en 7 días.',
    note: 'Pago único',
    features: ['Hasta 5 páginas', 'Diseño Responsive', 'Formulario contacto', 'SEO básico', 'Hosting 1 año gratis']
  },
  {
    id: 'web-corporate',
    name: 'Web Corporativa',
    price: 799.00,
    type: 'web-design',
    popular: true,
    description: 'Sitio completo con CMS y Blog.',
    note: 'Pago único',
    features: ['Páginas ilimitadas', 'Panel Admin (CMS)', 'Blog integrado', 'Google Analytics', 'Hosting 1 año gratis']
  },

  // ── Sistemas Web
  {
    id: 'sys-gestion',
    name: 'Sistema de Gestión',
    price: 1299.00,
    type: 'web-system',
    popular: true,
    description: 'ERP ligero: ventas e inventario.',
    note: 'Desde',
    features: ['Módulo de ventas', 'Control inventario', 'Gestión clientes', 'Reportes PDF', 'Soporte 6 meses']
  },
  {
    id: 'sys-custom',
    name: 'Sistema a Medida',
    price: 2499.00,
    type: 'web-system',
    description: 'Solución personalizada para tu negocio.',
    note: 'Desde',
    features: ['Análisis requerimientos', 'Arquitectura a medida', 'Integraciones API', 'Roles avanzados', 'Garantía 12 meses']
  },

  // ── Complementos
  {
    id: 'addon-ssl-wildcard',
    name: 'SSL Wildcard',
    price: 89.00,
    type: 'addon',
    description: 'Seguridad total subdominios.',
    note: 'Anual',
    features: ['Validación dominio', 'Subdominios ilimitados', 'Encriptación 256-bit', 'Sello sitio seguro']
  },
  {
    id: 'addon-dedicated-ip',
    name: 'IP Dedicada',
    price: 5.00,
    type: 'addon',
    description: 'Mejora tu reputación de correo.',
    note: 'Mensual',
    features: ['IP exclusiva', 'Mejor entrega email', 'Evita listas negras', 'Acceso directo IP']
  },

  // ── Combos
  {
    id: 'combo-starter-com',
    name: 'Combo Emprendedor',
    price: 12.99,
    type: 'combo',
    description: 'Lanza tu web con todo incluido.',
    note: 'Mensual',
    features: ['Dominio .COM gratis', 'Hosting 5GB SSD', 'SSL Gratis', '10 Emails']
  },
  {
    id: 'combo-business-pe',
    name: 'Combo Local Perú',
    price: 24.99,
    type: 'combo',
    popular: true,
    description: 'Ideal para posicionamiento local.',
    note: 'Mensual',
    features: ['Dominio .PE gratis', 'Hosting 20GB SSD', 'SSL Premium', 'Backup Diario']
  }
];

export async function fetchOdiseaPlans(): Promise<HostingPlan[]> {
  const API_URL = process.env.NEXT_PUBLIC_ODISEA_API_URL || 'http://localhost:3001/api/v1';

  try {
    const response = await fetch(`${API_URL}/public/plans`, { cache: 'no-store' });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const apiPlans = result.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price_usd) || 5.00,
          price_pen: parseFloat(p.price_pen) || 19.00,
          features: Array.isArray(p.features) ? p.features : [],
          type: (p.type?.toLowerCase() || 'shared') as any,
          description: p.description || '',
          popular: p.is_popular
        }));

        const finalPlans = [...apiPlans];
        const categories: HostingPlan['type'][] = ['shared', 'reseller', 'web-design', 'web-system', 'addon', 'combo'];
        
        categories.forEach(cat => {
          if (!finalPlans.some(p => p.type === cat)) {
            const fallbackForCat = STATIC_FALLBACK.filter(p => p.type === cat);
            finalPlans.push(...fallbackForCat);
          }
        });
        return finalPlans;
      }
    }
  } catch (error) {
    console.warn("[plans:fetch:error] Fallback total");
  }
  return STATIC_FALLBACK;
}
