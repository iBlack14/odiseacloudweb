"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Loader2, Zap } from "lucide-react";
import { formatPrice, Currency } from "@/lib/pricing";
import { ProvisioningStep, INITIAL_STEPS, simulateProvisioning } from "@/lib/provisioning";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: number;
  currency: Currency;
}

export default function CheckoutModal({ isOpen, onClose, itemName, itemPrice, currency }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [provisioningSteps, setProvisioningSteps] = useState<ProvisioningStep[]>(INITIAL_STEPS);

  const startProvisioning = async () => {
    setStep(4);
    await simulateProvisioning((updatedSteps) => {
      setProvisioningSteps(updatedSteps);
    });
  };

  const handleNext = () => {
    if (step === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
      }, 2000);
    } else if (step === 3) {
      startProvisioning();
    } else {
      setStep(step + 1);
    }
  };

  const accentColor = "oklch(0.6 0.18 260)"; // Brand Blue
  const successColor = "oklch(0.6 0.18 150)"; // Success Green
  const mutedColor = "oklch(0.4 0.05 260)"; // Muted Text
  const surfaceColor = "oklch(0.98 0.01 260)"; // Light Background

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={overlayStyle}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={modalStyle}
          >
            {/* Header */}
            <header style={headerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={20} color={accentColor} />
                <span style={{ fontWeight: 800, fontSize: '0.8rem', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {step === 4 ? "Activación en tiempo real" : "Checkout Seguro"}
                </span>
              </div>
              <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
            </header>

            {/* Content */}
            <div style={contentStyle}>
              {step === 1 && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <h2 style={titleStyle}>Resumen de Orden</h2>
                  <div style={summaryBoxStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <span style={{ color: mutedColor, fontWeight: 500 }}>Producto</span>
                      <span style={{ fontWeight: 800 }}>{itemName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid oklch(0.9 0.02 260)', paddingTop: '1.5rem' }}>
                      <span style={{ fontWeight: 700 }}>Total</span>
                      <span style={{ fontWeight: 900, fontSize: '1.6rem', color: accentColor }}>{formatPrice(itemPrice, currency)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <h2 style={titleStyle}>Método de Pago</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <PaymentOption icon={<CreditCard />} label="Tarjeta de Crédito / Débito" selected />
                    <PaymentOption icon={<CheckCircle2 size={18} />} label="Transferencia Bancaria" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'oklch(0.6 0.18 150 / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem' }}>
                    <CheckCircle2 size={48} color={successColor} />
                  </div>
                  <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: 900, color: 'oklch(0.1 0.05 260)' }}>¡Pago Confirmado!</h2>
                  <p style={{ color: mutedColor, marginBottom: '3rem', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '350px', margin: '0 auto 3rem' }}>
                    Estamos listos para activar tu infraestructura. Pulsa el botón para iniciar.
                  </p>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 style={{ ...titleStyle, textAlign: 'center', marginBottom: '3rem' }}>Configurando Servicio</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    {provisioningSteps.map((s) => (
                      <div key={s.id} style={{ opacity: s.status === 'pending' ? 0.3 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: 800 }}>
                          <span>{s.label}</span>
                          <span style={{ color: s.status === 'completed' ? successColor : accentColor }}>
                            {s.status === 'loading' ? `${s.progress}%` : s.status.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ height: '8px', background: 'oklch(0.9 0.02 260)', borderRadius: '10px', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${s.progress}%` }}
                            transition={{ duration: 0.3 }}
                            style={{ height: '100%', background: s.status === 'completed' ? successColor : accentColor }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {provisioningSteps.every(s => s.status === 'completed') && (
                    <motion.button 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      onClick={() => window.location.href = '/dashboard'}
                      style={{ ...primaryBtnStyle, width: '100%', marginTop: '4rem', justifyContent: 'center' }}
                    >
                      Ir al Dashboard <ArrowRight size={18} />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {step < 3 && (
              <footer style={footerStyle}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'oklch(0.5 0.05 260)' }}>
                  PASO {step} DE 2
                </div>
                <button 
                  onClick={handleNext} 
                  disabled={isProcessing}
                  style={primaryBtnStyle}
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : (
                    <>
                      {step === 2 ? "Finalizar Compra" : "Continuar"} <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </footer>
            )}

            {step === 3 && (
              <footer style={{ ...footerStyle, justifyContent: 'center' }}>
                <button onClick={handleNext} style={{ ...primaryBtnStyle, width: '100%', justifyContent: 'center' }}>
                  Iniciar Aprovisionamiento <Zap size={18} />
                </button>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PaymentOption({ icon, label, selected = false }: { icon: any, label: string, selected?: boolean }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1.2rem', 
      padding: '1.4rem', 
      borderRadius: '16px', 
      border: `2px solid ${selected ? 'oklch(0.6 0.18 260)' : 'oklch(0.9 0.02 260)'}`,
      background: selected ? 'oklch(0.6 0.18 260 / 0.05)' : 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ color: selected ? 'oklch(0.6 0.18 260)' : 'oklch(0.5 0.05 260)' }}>{icon}</div>
      <span style={{ fontWeight: 700, fontSize: '1rem', color: selected ? 'oklch(0.1 0.05 260)' : 'oklch(0.4 0.05 260)' }}>{label}</span>
    </div>
  );
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'oklch(0.1 0.05 260 / 0.4)',
  backdropFilter: 'blur(12px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem'
};

const modalStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid oklch(0.9 0.02 260)',
  borderRadius: '32px',
  width: '100%',
  maxWidth: '520px',
  overflow: 'hidden',
  boxShadow: '0 40px 100px -20px rgba(0,0,0,0.15)',
  position: 'relative'
};

const headerStyle: React.CSSProperties = {
  padding: '2rem 3rem',
  borderBottom: '1px solid oklch(0.95 0.01 260)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'oklch(0.98 0.01 260)'
};

const closeBtnStyle: React.CSSProperties = {
  background: 'oklch(0.9 0.02 260 / 0.3)',
  border: 'none',
  color: 'oklch(0.4 0.05 260)',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const contentStyle: React.CSSProperties = {
  padding: '4rem 3rem'
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  marginBottom: '2.5rem',
  fontFamily: 'var(--font-display)',
  fontWeight: 900,
  color: 'oklch(0.1 0.05 260)',
  letterSpacing: '-0.02em'
};

const summaryBoxStyle: React.CSSProperties = {
  background: 'oklch(0.98 0.01 260)',
  padding: '2.5rem',
  borderRadius: '24px',
  border: '1px solid oklch(0.9 0.02 260)'
};

const footerStyle: React.CSSProperties = {
  padding: '2rem 3rem',
  background: 'oklch(0.98 0.01 260)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid oklch(0.95 0.01 260)'
};

const primaryBtnStyle: React.CSSProperties = {
  background: 'oklch(0.6 0.18 260)',
  color: 'white',
  border: 'none',
  padding: '1.2rem 3rem',
  borderRadius: '16px',
  fontWeight: 800,
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  boxShadow: '0 10px 25px -5px oklch(0.6 0.18 260 / 0.4)',
  transition: 'all 0.2s ease'
};
