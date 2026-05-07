/**
 * Provisioning Service
 * Simulates real-time technical steps for domain and hosting activation.
 */

export interface ProvisioningStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  progress: number;
}

export const INITIAL_STEPS: ProvisioningStep[] = [
  { id: 'payment', label: 'Validando Transacción', status: 'completed', progress: 100 },
  { id: 'domain', label: 'Registrando Dominio en Spaceship', status: 'pending', progress: 0 },
  { id: 'dns', label: 'Configurando Nameservers', status: 'pending', progress: 0 },
  { id: 'whm', label: 'Creando cuenta en servidor Odisea', status: 'pending', progress: 0 },
  { id: 'email', label: 'Configurando buzón de bienvenida', status: 'pending', progress: 0 },
];

/**
 * Simulates a real-time update stream for the provisioning process.
 */
export async function simulateProvisioning(onUpdate: (steps: ProvisioningStep[]) => void) {
  let steps = [...INITIAL_STEPS];
  
  // Step by step simulation
  for (let i = 1; i < steps.length; i++) {
    steps[i].status = 'loading';
    onUpdate([...steps]);

    // Simulate technical work
    for (let p = 0; p <= 100; p += 10) {
      steps[i].progress = p;
      onUpdate([...steps]);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
    }

    steps[i].status = 'completed';
    onUpdate([...steps]);
  }
}
