/**
 * Odisea Plan & Service Definitions
 */

export interface HostingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  type: 'shared' | 'reseller' | 'web-design' | 'web-system' | 'addon' | 'combo';
  description?: string;
  note?: string;
  popular?: boolean;
}

export async function fetchOdiseaPlans(): Promise<HostingPlan[]> {
  return [
    // ── Hosting Compartido
    {
      id: 'unlimited',
      name: 'Unlimited Hosting Plan',
      price: 49.99,
      type: 'shared',
      popular: true,
      description: 'Poder absoluto sin restricciones para tu negocio.',
      features: [
        'Espacio en Disco Ilimitado',
        'Transferencia (Bandwidth) Ilimitada',
        'Cuentas de Correo Ilimitadas',
        'Dominios y Sitios Ilimitados',
        'Backups premium cada 12h',
        'SSL Wildcard gratis incluido',
        'Soporte Prioritario 24/7'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 4.99,
      type: 'shared',
      description: 'Para blogs, portafolios y proyectos personales.',
      features: ['5 GB NVMe SSD', '50 GB de Transferencia', 'Alojamiento para 1 Sitio', 'cPanel incluido', 'SSL Gratis', 'Correos Ilimitados']
    },
    {
      id: 'business',
      name: 'Business',
      price: 14.99,
      type: 'shared',
      description: 'Para empresas y tiendas en crecimiento.',
      popular: true,
      features: ['20 GB NVMe SSD', 'Transferencia Ilimitada', 'Alojamiento para 10 Sitios', 'Backups diarios', 'SSL Gratis', 'WordPress preinstalado']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29.99,
      type: 'shared',
      description: 'Para proyectos de alto tráfico o e-commerce.',
      features: ['60 GB NVMe SSD', 'Transferencia Ilimitada', 'Sitios Web Ilimitados', 'Backups diarios', 'Staging environment', 'IP dedicada']
    },

    // ── Reseller WHM
    {
      id: 'reseller-bronze',
      name: 'Reseller Bronze',
      price: 29.99,
      type: 'reseller',
      description: 'Empieza tu propio negocio de hosting.',
      features: ['10 cuentas cPanel', '100 GB NVMe SSD', 'Marca blanca total', 'WHM incluido', 'Compatible con WHMCS', 'SSL gratis por cuenta']
    },
    {
      id: 'reseller-silver',
      name: 'Reseller Silver',
      price: 89.99,
      type: 'reseller',
      popular: true,
      description: 'Para revendedores con cartera de clientes activa.',
      features: ['50 cuentas cPanel', '500 GB NVMe SSD', 'Marca blanca total', 'Overselling permitido', 'API de gestión', 'Soporte prioritario']
    },
    {
      id: 'reseller-gold',
      name: 'Reseller Gold',
      price: 199.99,
      type: 'reseller',
      description: 'Sin límites para agencias y revendedores establecidos.',
      features: ['Cuentas ilimitadas', '2 TB NVMe SSD', 'Marca blanca total', 'IP dedicada por cuenta', 'SLA premium 99.99%', 'Manager de cuenta']
    },

    // ── Webs Corporativas
    {
      id: 'web-basic',
      name: 'Web Básica',
      price: 349.00,
      type: 'web-design',
      description: 'Presencia digital profesional lista en 7 días.',
      note: 'Pago único — sin mensualidades',
      features: ['Hasta 5 páginas', 'Diseño a medida responsive', 'Formulario de contacto', 'SEO básico', 'SSL y hosting por 1 año', 'Entrega en 7 días hábiles']
    },
    {
      id: 'web-corporate',
      name: 'Web Corporativa',
      price: 799.00,
      type: 'web-design',
      popular: true,
      description: 'Sitio completo con identidad de marca y CMS.',
      note: 'Pago único — sin mensualidades',
      features: ['Páginas ilimitadas', 'Panel de administración (CMS)', 'Blog integrado', 'SEO avanzado + Google Analytics', 'SSL y hosting por 1 año', 'Soporte post-entrega 60 días']
    },
    {
      id: 'web-ecommerce',
      name: 'E-commerce',
      price: 1499.00,
      type: 'web-design',
      description: 'Tienda online lista para vender en Perú y el mundo.',
      note: 'Pago único — sin mensualidades',
      features: ['Catálogo de productos ilimitado', 'Pagos: Yape, POS, Stripe, PayPal', 'Gestión de inventario', 'Panel de pedidos', 'SEO para productos', 'Soporte post-entrega 90 días']
    },

    // ── Sistemas Web
    {
      id: 'sys-cotizacion',
      name: 'Sistema Cotización',
      price: 599.00,
      type: 'web-system',
      description: 'Automatiza tus presupuestos y propuestas comerciales.',
      note: 'Cotización base — precio final según alcance',
      features: ['Generación de PDF profesional', 'Base de productos y precios', 'Historial de cotizaciones', 'Envío por correo automático', 'Panel administrativo', 'Acceso multiusuario']
    },
    {
      id: 'sys-gestion',
      name: 'Sistema de Gestión',
      price: 1299.00,
      type: 'web-system',
      popular: true,
      description: 'ERP ligero para PYMEs: ventas, inventario y clientes.',
      note: 'Cotización base — precio final según alcance',
      features: ['Módulo de ventas y facturación', 'Control de inventario', 'Gestión de clientes (CRM)', 'Reportes y estadísticas', 'Exportación a Excel/PDF', 'Soporte y mantenimiento 6 meses']
    },
    {
      id: 'sys-custom',
      name: 'Sistema a Medida',
      price: 2499.00,
      type: 'web-system',
      description: 'Solución personalizada según tu proceso de negocio.',
      note: 'Cotización base — precio final según alcance',
      features: ['Análisis de requerimientos', 'Arquitectura a medida', 'Integraciones con APIs externas', 'Roles y permisos avanzados', 'Despliegue en servidor propio', 'Garantía y soporte 12 meses']
    },

    // ── Complementos Compatibles
    {
      id: 'addon-ssl-wildcard',
      name: 'SSL Wildcard',
      price: 89.00,
      type: 'addon',
      description: 'Seguridad total para tu dominio y todos sus subdominios.',
      note: 'Precio anual',
      features: ['Validación de dominio', 'Subdominios ilimitados', 'Encriptación 256-bit', 'Sello de sitio seguro']
    },
    {
      id: 'addon-dedicated-ip',
      name: 'IP Dedicada',
      price: 5.00,
      type: 'addon',
      description: 'Mejora tu reputación de correo y SEO con una IP propia.',
      note: 'Precio mensual',
      features: ['IP exclusiva para tu cuenta', 'Evita listas negras compartidas', 'Mejor entrega de emails', 'Acceso directo por IP']
    },
    {
      id: 'addon-backup-extra',
      name: 'Backup Pro Cloud',
      price: 12.00,
      type: 'addon',
      popular: true,
      description: 'Respaldo externo diario con retención de 30 días.',
      note: 'Precio mensual',
      features: ['Backups automáticos diarios', 'Retención de 30 días', 'Restauración en un clic', 'Almacenamiento off-site']
    },

    // ── Combos Dominio + Hosting
    {
      id: 'combo-starter-com',
      name: 'Combo Emprendedor',
      price: 12.99,
      type: 'combo',
      description: 'Todo lo que necesitas para lanzar tu primera web.',
      note: 'Hosting Mensual + Dominio Anual',
      features: ['Dominio .COM gratis 1er año', 'Plan Starter (5GB SSD)', 'SSL Gratis para siempre', '10 Cuentas de correo']
    },
    {
      id: 'combo-business-pe',
      name: 'Combo Local Perú',
      price: 24.99,
      type: 'combo',
      popular: true,
      description: 'Ideal para empresas peruanas buscando posicionamiento local.',
      note: 'Hosting Mensual + Dominio Anual',
      features: ['Dominio .PE gratis 1er año', 'Plan Business (20GB SSD)', 'Certificado SSL Premium', 'Backup Diario incluido']
    },
  ];
}
