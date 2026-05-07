/**
 * Odisea Plan Service
 * Handles fetching plans from the main infrastructure API.
 */

export interface HostingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  type: 'shared' | 'reseller' | 'vps';
}

/**
 * Fetches plans from the Odisea API.
 * Uses the environment variables defined in .env.local
 */
export async function fetchOdiseaPlans(): Promise<HostingPlan[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_ODISEA_API_URL || 'http://localhost:3001/api';
    
    // In production, this would be a real fetch call:
    // const response = await fetch(`${apiUrl}/plans`, {
    //   headers: { 'Authorization': `Bearer ${process.env.ODISEA_API_KEY}` }
    // });
    // return response.json();

    // Mocking real-time data structure based on Odisea core
    return [
      {
        id: 'starter',
        name: 'Starter Plan',
        price: 4.99,
        type: 'shared',
        features: ['5GB NVMe SSD', '50GB Ancho de Banda', '1 Dominio']
      },
      {
        id: 'business',
        name: 'Business Plan',
        price: 14.99,
        type: 'shared',
        features: ['20GB NVMe SSD', 'Ancho de Banda Ilimitado', '10 Dominios']
      },
      {
        id: 'reseller-bronze',
        name: 'Reseller Bronze',
        price: 29.99,
        type: 'reseller',
        features: ['10 Cuentas cPanel', '100GB NVMe SSD', 'Marca Blanca Total']
      },
      {
        id: 'reseller-silver',
        name: 'Reseller Silver',
        price: 89.99,
        type: 'reseller',
        features: ['50 Cuentas cPanel', '500GB NVMe SSD', 'Overselling Permitido']
      },
      {
        id: 'reseller-gold',
        name: 'Reseller Gold',
        price: 199.99,
        type: 'reseller',
        features: ['Cuentas Ilimitadas', '2TB NVMe SSD', 'Acceso API Completo']
      }
    ];
  } catch (error) {
    console.error("Error fetching Odisea plans:", error);
    return [];
  }
}
