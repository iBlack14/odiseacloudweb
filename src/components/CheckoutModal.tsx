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
  const [selectedPayment, setSelectedPayment] = useState<"card" | "yape" | "transfer">("card");

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

  // Theme Constants (matching globals.css)
  const accentColor = "var(--primary)";
  const cyanColor = "var(--accent-cyan)";
  const successColor = "#34d399";
  const mutedColor = "var(--text-muted)";
  const surfaceColor = "rgba(15, 15, 20, 0.95)";

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={overlayStyle}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={modalStyle}
          >
            {/* Header */}
            <header style={headerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '32px', width: 'auto' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.2rem' }}>
                  <ShieldCheck size={18} color={accentColor} />
                  <span style={{ fontWeight: 800, fontSize: '0.7rem', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {step === 4 ? "Activación en progreso" : "Secure Checkout"}
                  </span>
                </div>
              </div>
              <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
            </header>

            {/* Content */}
            <div style={contentStyle}>
              {step === 1 && (
                <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <h2 style={titleStyle}>Resumen del <span style={{ color: accentColor }}>Nodo</span></h2>
                  <div style={summaryBoxStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                      <span style={{ color: mutedColor, fontWeight: 500 }}>Configuración</span>
                      <span style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>{itemName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, color: 'white' }}>Total a Pagar</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 900, fontSize: '2.5rem', color: cyanColor, display: 'block' }}>{formatPrice(itemPrice, currency)}</span>
                        <span style={{ fontSize: '0.7rem', color: mutedColor }}>Incluye impuestos y tasas</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <h2 style={titleStyle}>Método de <span style={{ color: accentColor }}>Pago</span></h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <PaymentOption 
                      icon={
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <img src="/visa.svg" alt="Visa" style={{ height: '10px' }} />
                          <img src="/mastercard.svg" alt="MC" style={{ height: '16px' }} />
                        </div>
                      } 
                      label="Visa / Mastercard" 
                      selected={selectedPayment === "card"} 
                      onClick={() => setSelectedPayment("card")}
                    />
                    <PaymentOption 
                      icon={
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <img src="/yape.svg" alt="Yape" style={{ height: '18px', borderRadius: '3px' }} />
                          <img src="/plin.svg" alt="Plin" style={{ height: '18px', borderRadius: '3px' }} />
                        </div>
                      } 
                      label="Yape / Plin" 
                      selected={selectedPayment === "yape"} 
                      onClick={() => setSelectedPayment("yape")}
                    />
                    <PaymentOption 
                      icon={<CheckCircle2 size={18} />} 
                      label="Transferencia Bancaria" 
                      selected={selectedPayment === "transfer"} 
                      onClick={() => setSelectedPayment("transfer")}
                    />
                  </div>

                  {selectedPayment === "yape" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--glass-border)', textAlign: 'center' }}
                    >
                      <div style={{ width: '120px', height: '120px', background: 'white', margin: '0 auto 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ODISEA_PAYMENT" alt="QR Code" style={{ width: '100px' }} />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>Escanea para pagar con Yape o Plin</p>
                      <p style={{ fontSize: '0.7rem', color: mutedColor, marginTop: '0.4rem' }}>Adjunta tu captura en el siguiente paso</p>
                    </motion.div>
                  )}

                  {selectedPayment === "transfer" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}
                    >
                      <p style={{ fontSize: '0.8rem', color: 'white', fontWeight: 700, marginBottom: '0.8rem' }}>Cuentas Odisea Cloud:</p>
                      <div style={{ fontSize: '0.75rem', color: mutedColor, lineHeight: '1.8' }}>
                        <p>BCP: 191-XXXXXXXX-0-XX</p>
                        <p>Interbank: 200-XXXXXXXX-X</p>
                        <p>CCI: 002-XXXXXXXXXXXXXXXX</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '30px', 
                    background: 'rgba(52, 211, 153, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 2.5rem',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    boxShadow: '0 0 40px rgba(52, 211, 153, 0.1)'
                  }}>
                    <CheckCircle2 size={50} color={successColor} />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 900, color: 'white' }}>¡Nodo Asegurado!</h2>
                  <p style={{ color: mutedColor, marginBottom: '4rem', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 4rem' }}>
                    La transacción ha sido validada por la red. Tu espacio en la infraestructura está reservado.
                  </p>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 style={{ ...titleStyle, textAlign: 'center', marginBottom: '4rem' }}>Aprovisionando <span style={{ color: cyanColor }}>Servicio</span></h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {provisioningSteps.map((s) => (
                      <div key={s.id} style={{ opacity: s.status === 'pending' ? 0.3 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem', fontWeight: 700 }}>
                          <span style={{ color: 'white' }}>{s.label}</span>
                          <span style={{ color: s.status === 'completed' ? successColor : cyanColor, fontFamily: 'monospace' }}>
                            {s.status === 'loading' ? `${s.progress}%` : s.status.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${s.progress}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            style={{ 
                              height: '100%', 
                              background: s.status === 'completed' ? successColor : `linear-gradient(90deg, ${accentColor}, ${cyanColor})`,
                              boxShadow: s.status === 'loading' ? `0 0 15px ${accentColor}` : 'none'
                            }}
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
                      style={{ ...primaryBtnStyle, width: '100%', marginTop: '5rem', justifyContent: 'center', background: 'white', color: 'black' }}
                    >
                      Entrar al Panel de Control <ArrowRight size={18} />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {step < 3 && (
              <footer style={footerStyle}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: mutedColor, letterSpacing: '0.05em' }}>
                  STEP 0{step} <span style={{ opacity: 0.3 }}>/ 02</span>
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
                <button onClick={handleNext} style={{ ...primaryBtnStyle, width: '100%', justifyContent: 'center', background: accentColor, color: 'white' }}>
                  Desplegar Infraestructura <Zap size={18} />
                </button>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PaymentOption({ icon, label, selected = false, onClick }: { icon: any, label: string, selected?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.2rem', 
        padding: '1.6rem', 
        borderRadius: '20px', 
        border: `1px solid ${selected ? 'var(--primary)' : 'var(--glass-border)'}`,
        background: selected ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {selected && <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '4px', background: 'var(--primary)' }} />}
      <div style={{ color: selected ? 'var(--primary)' : 'var(--text-muted)' }}>{icon}</div>
      <span style={{ fontWeight: 700, fontSize: '1rem', color: selected ? 'white' : 'var(--text-muted)' }}>{label}</span>
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
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(20px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem'
};

const modalStyle: React.CSSProperties = {
  background: 'rgba(15, 15, 20, 0.95)',
  border: '1px solid var(--glass-border)',
  borderRadius: '40px',
  width: '100%',
  maxWidth: '560px',
  overflow: 'hidden',
  boxShadow: '0 50px 100px -20px rgba(0,0,0,1)',
  position: 'relative',
  backdropFilter: 'blur(40px)'
};

const headerStyle: React.CSSProperties = {
  padding: '2.5rem 3.5rem',
  borderBottom: '1px solid var(--glass-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(255,255,255,0.02)'
};

const closeBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: 'none',
  color: 'white',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const contentStyle: React.CSSProperties = {
  padding: '4.5rem 3.5rem'
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.2rem',
  marginBottom: '3rem',
  fontFamily: 'var(--font-display)',
  fontWeight: 900,
  color: 'white',
  letterSpacing: '-0.03em'
};

const summaryBoxStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  padding: '3rem',
  borderRadius: '28px',
  border: '1px solid var(--glass-border)'
};

const footerStyle: React.CSSProperties = {
  padding: '2.5rem 3.5rem',
  background: 'rgba(255,255,255,0.02)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid var(--glass-border)'
};

const primaryBtnStyle: React.CSSProperties = {
  background: 'var(--primary)',
  color: 'white',
  border: 'none',
  padding: '1.2rem 3.5rem',
  borderRadius: '20px',
  fontWeight: 800,
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  boxShadow: '0 15px 30px -10px rgba(99, 102, 241, 0.4)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
};
