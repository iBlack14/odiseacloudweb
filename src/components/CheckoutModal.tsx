"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Currency, formatPrice } from "../lib/pricing";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  itemName: string;
  itemPrice: number;
  currency: Currency;
  domain?: string;
  planType?: string;
}

type StepStatus = "pending" | "loading" | "done" | "error";
interface ProvStep { label: string; status: StepStatus; }

function slugifyName(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").slice(0, 16) || "cliente";
}

function generatePassword(len = 16): string {
  // Eliminamos caracteres que podrían causar problemas de escape en la API del Core
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!#*";
  const rand = () => crypto.getRandomValues(new Uint32Array(1))[0];
  return Array.from({ length: len }, () => chars[rand() % chars.length]).join("");
}

export default function CheckoutModal({ isOpen, onClose, planId, itemName, itemPrice, currency, domain: initialDomain, planType = "shared" }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState<string>("card");
  const [form, setForm] = useState({ name: "", email: "", domain: initialDomain || "", eppCode: "" });
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formToken, setFormToken] = useState("");
  const [apiPublicKey, setApiPublicKey] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [validationError, setValidationError] = useState("");
  
  const provLabel = planType === 'reseller' ? "Aprovisionando Reseller WHM" : "Creando cuenta de Hosting";

  const [prov, setProv] = useState<ProvStep[]>([
    { label: "Validando transacción", status: "pending" },
    { label: provLabel, status: "pending" },
    { label: "Configurando zona DNS", status: "pending" },
    { label: "Enviando accesos al email", status: "pending" },
  ]);

  const prefetchToken = useCallback(async (name: string, email: string) => {
    if (currency !== "PEN") return;
    setTokenLoading(true);
    try {
      const resp = await fetch('/api/izipay/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: itemPrice, currency: "PEN", email, name }),
      });
      const data = await resp.json();
      if (data.formToken) {
        setFormToken(data.formToken);
        setApiPublicKey(data.publicKey.trim());
      }
    } catch (e) { console.error("Token sync error", e); }
    finally { setTokenLoading(false); }
  }, [itemPrice, currency]);

  useEffect(() => {
    if (isOpen && currency === "PEN" && step === 4 && payMethod === "card" && formToken && apiPublicKey) {
      const initIzipay = () => {
        // @ts-ignore
        const KR = window.KR;
        if (!KR) return;

        KR.setFormConfig({ 
          formToken, 
          "kr-theme": "neon", 
          "kr-language": "es-PE", 
          "kr-public-key": apiPublicKey 
        });

        // SOLUCIÓN CLIENT_709: Atachamos al contenedor PADRE, no al que tiene la clase kr-embedded
        KR.attachForm('#izipay-container')
          .then((res: any) => KR.showForm(res.formId))
          .catch((err: any) => console.error("Izipay error", err));

        KR.onSubmit((res: any) => {
          if (res.clientAnswer?.orderStatus === "PAID") setStep(5);
          return false;
        });
      };

      // @ts-ignore
      if (!window.KR) {
        const script = document.createElement("script");
        script.src = `https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js`;
        script.setAttribute("kr-public-key", apiPublicKey);
        script.setAttribute("kr-post-url-success", window.location.origin);
        script.onload = initIzipay;
        document.head.appendChild(script);
      } else {
        setTimeout(initIzipay, 150);
      }
    }
  }, [isOpen, step, payMethod, formToken, apiPublicKey, currency]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1); setDone(false); setFormToken(""); setApiPublicKey(""); setValidationError(""); onClose();
  };

  const next = async () => {
    setValidationError("");
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (!form.name.trim() || !form.email.trim()) {
        setValidationError("Por favor completa tu nombre y correo.");
        return;
      }
      if (itemName.startsWith("Transferencia")) {
        const epp = form.eppCode.trim();
        if (!epp) {
          setValidationError("El código EPP es obligatorio para transferir tu dominio.");
          return;
        }
        // Basic EPP Auth Code validation: typically 8-32 chars, needs letters, numbers, and maybe special chars.
        if (epp.length < 8) {
          setValidationError("El código EPP debe tener al menos 8 caracteres.");
          return;
        }
        if (!/[a-zA-Z]/.test(epp) || !/[0-9]/.test(epp)) {
          setValidationError("El código EPP ingresado no tiene un formato válido (debe incluir letras y números).");
          return;
        }
      }
      const username = slugifyName(form.name);
      setCreds({ username, password: generatePassword(16) });
      setStep(3);
    }
    else if (step === 3) {
      if (currency === "PEN" && payMethod === "card") { 
        setLoading(true); await prefetchToken(form.name, form.email); setLoading(false); 
      }
      setStep(4);
    }
    else if (step === 5) {
      setStep(6);
      for (let i = 0; i < 4; i++) {
        setProv(prev => prev.map((p, idx) => idx === i ? { ...p, status: "loading" } : p));
        if (i === 1) {
          await fetch('/api/provision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              domain: form.domain || `${creds.username}.odiseacloud.com`,
              username: creds.username, password: creds.password, email: form.email,
              planId, isReseller: planType === 'reseller', eppCode: form.eppCode
            })
          });
        }
        if (i === 3) {
          await fetch('/api/send-credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name, email: form.email, username: creds.username,
              password: creds.password, planName: itemName, type: planType
            })
          });
        }
        await new Promise(r => setTimeout(r, 1500));
        setProv(prev => prev.map((p, idx) => idx === i ? { ...p, status: "done" } : p));
      }
      setDone(true);
    }
  };

  return (
    <div style={{ 
      position: "fixed", inset: 0, zIndex: 9999, 
      background: "rgba(255, 255, 255, 0.8)", 
      backdropFilter: "blur(20px)", 
      display: "flex", alignItems: "center", justifyContent: "center", 
      padding: "20px", fontFamily: "'Inter', sans-serif" 
    }}>
      <div style={{ 
        width: "100%", maxWidth: "520px", 
        background: "#FFFFFF", 
        borderRadius: "28px", 
        border: "1px solid var(--border-hi)", 
        overflow: "hidden",
        boxShadow: "var(--shadow-xl)"
      }}>
        
        <div style={{ padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "var(--bg-raised)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/logo.png" alt="Odisea" style={{ height: "24px" }} />
            <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-3)", letterSpacing: "0.1em" }}>CHECKOUT SEGURO</span>
          </div>
          <button onClick={handleClose} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", color: "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ padding: "40px" }}>
          {step <= 3 && (
            <div style={{ animation: "fadeIn 0.4s" }}>
              <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-1)", marginBottom: "8px", fontFamily: "var(--font-display)" }}>
                  {step === 1 ? "Resumen de orden" : step === 2 ? "Información de contacto" : "Selecciona tu pago"}
                </h2>
                <p style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>
                  {step === 1 ? "Revisa los detalles de tu servicio" : step === 2 ? "Necesitamos tus datos para activar la cuenta" : "Elige el método que prefieras"}
                </p>
              </div>

              {step === 1 && (
                <div style={{ background: "var(--bg-raised)", padding: "24px", borderRadius: "20px", border: "1px solid var(--border)", marginBottom: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>Servicio</span>
                    <span style={{ color: "var(--text-1)", fontWeight: 700 }}>{itemName}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>Plan</span>
                    <span style={{ color: "var(--text-1)", fontWeight: 700 }}>{planType.toUpperCase()}</span>
                  </div>
                  <div style={{ height: "1px", background: "var(--border)", margin: "16px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-1)", fontWeight: 800 }}>Total</span>
                    <span style={{ color: "var(--accent)", fontSize: "1.75rem", fontWeight: 900, fontFamily: "var(--font-display)" }}>{formatPrice(itemPrice, currency)}</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                  {validationError && (
                    <div style={{ padding: "12px 16px", background: "oklch(0.65 0.15 25 / 0.1)", color: "var(--danger)", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600, border: "1px solid oklch(0.65 0.15 25 / 0.2)" }}>
                      {validationError}
                    </div>
                  )}
                  <input type="text" placeholder="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "16px 20px", background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: "14px", color: "var(--text-1)", outline: "none", fontSize: "0.95rem" }} />
                  <input type="email" placeholder="Correo electrónico" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "16px 20px", background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: "14px", color: "var(--text-1)", outline: "none", fontSize: "0.95rem" }} />
                  {itemName.startsWith("Transferencia") && (
                    <input type="text" placeholder="Código EPP / Auth Code" value={form.eppCode} onChange={e => setForm({ ...form, eppCode: e.target.value })} style={{ width: "100%", padding: "16px 20px", background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: "14px", color: "var(--text-1)", outline: "none", fontSize: "0.95rem" }} />
                  )}
                </div>
              )}

              {step === 3 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
                  {currency === "PEN" ? (
                    <>
                      <button onClick={() => setPayMethod("card")} style={{ padding: "24px 10px", borderRadius: "18px", border: payMethod === "card" ? "2px solid var(--accent)" : "1px solid var(--border)", background: payMethod === "card" ? "var(--accent-dim)" : "white", color: "var(--text-1)", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>💳</div><div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.05em" }}>TARJETA DE CRÉDITO</div>
                      </button>
                      <button onClick={() => setPayMethod("yape")} style={{ padding: "24px 10px", borderRadius: "18px", border: payMethod === "yape" ? "2px solid var(--accent)" : "1px solid var(--border)", background: payMethod === "yape" ? "var(--accent-dim)" : "white", color: "var(--text-1)", cursor: "pointer", transition: "all 0.2s" }}>
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>📱</div><div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.05em" }}>YAPE / PLIN</div>
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setPayMethod("crypto")} style={{ gridColumn: "span 2", padding: "32px", borderRadius: "18px", border: "2px solid oklch(0.75 0.15 75)", background: "oklch(0.75 0.15 75 / 0.05)", color: "var(--text-1)", cursor: "pointer" }}>
                      <div style={{ fontSize: "32px", marginBottom: "12px" }}>₿</div><div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em" }}>PAGAR CON CRIPTOMONEDAS</div>
                    </button>
                  )}
                </div>
              )}
              <button onClick={next} disabled={loading} style={{ 
                width: "100%", padding: "18px", 
                background: "var(--accent)", 
                border: "none", borderRadius: "14px", 
                color: "white", fontSize: "16px", fontWeight: 800,
                boxShadow: "0 10px 20px -5px oklch(0.68 0.18 245 / 0.4)",
                cursor: "pointer", transition: "all 0.2s"
              }}>
                {loading ? "Procesando..." : "Siguiente paso →"}
              </button>
            </div>
          )}

          {step === 4 && (
            <div style={{ animation: "fadeIn 0.4s" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-1)", marginBottom: "24px", textAlign: "center", fontFamily: "var(--font-display)" }}>Pago Seguro</h2>
              <div id="izipay-container" style={{ background: "white", borderRadius: "24px", border: "1px solid var(--border)", padding: "32px", minHeight: "360px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {payMethod === "card" && currency === "PEN" ? (
                  tokenLoading ? <div style={{ textAlign: "center" }}><div className="dh-spinner" style={{ marginBottom: "12px" }}></div><p style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>Cargando pasarela segura...</p></div> : (
                    <div className="kr-embedded" kr-form-token={formToken}>
                      <div className="kr-pan"></div>
                      <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
                        <div className="kr-expiry" style={{ flex: 1 }}></div>
                        <div className="kr-security-code" style={{ flex: 1 }}></div>
                      </div>
                      <div className="kr-payment-button"></div>
                    </div>
                  )
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "64px", marginBottom: "16px" }}>{payMethod === "crypto" ? "₿" : "📱"}</div>
                    <p style={{ color: "var(--text-1)", fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>{payMethod === "crypto" ? "Pago con USDT" : "Pago Manual"}</p>
                    <p style={{ color: "var(--text-3)", fontSize: "0.9rem", marginBottom: "24px" }}>Envía el comprobante a nuestro WhatsApp para activar el servicio.</p>
                    <button onClick={() => setStep(5)} style={{ padding: "14px 28px", background: "var(--accent)", border: "none", borderRadius: "12px", color: "white", fontWeight: 700, cursor: "pointer" }}>Confirmar Envío</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: "center", color: "var(--text-1)", padding: "20px 0" }}>
              <div style={{ fontSize: "72px", marginBottom: "24px" }}>💎</div>
              <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "12px", fontFamily: "var(--font-display)" }}>¡Excelente elección!</h2>
              <p style={{ color: "var(--text-3)", marginBottom: "32px" }}>Tu pago ha sido validado correctamente.</p>
              <button onClick={next} style={{ width: "100%", padding: "18px", background: "var(--success)", border: "none", borderRadius: "16px", color: "white", fontSize: "16px", fontWeight: 800, cursor: "pointer" }}>🚀 Activar mi Infraestructura</button>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-1)", textAlign: "center", marginBottom: "32px", fontFamily: "var(--font-display)" }}>{planType === 'reseller' ? 'Configurando Reseller WHM' : 'Activando Odin Cloud'}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {prov.map((p, i) => (
                  <div key={i} style={{ 
                    padding: "16px 20px", 
                    background: p.status === 'done' ? "oklch(0.65 0.15 150 / 0.05)" : "var(--bg-raised)", 
                    borderRadius: "14px", 
                    border: `1px solid ${p.status === 'done' ? 'var(--success)' : 'var(--border)'}`, 
                    color: "var(--text-1)", display: "flex", alignItems: "center", gap: "15px",
                    transition: "all 0.3s"
                  }}>
                    <span style={{ color: p.status === 'done' ? 'var(--success)' : 'var(--text-3)' }}>
                      {p.status === 'done' ? '✓' : p.status === 'loading' ? '⟳' : '○'}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: p.status === 'loading' ? 'var(--text-1)' : 'var(--text-2)' }}>{p.label}</span>
                  </div>
                ))}
              </div>
              {done && (
                <div style={{ marginTop: "32px", padding: "28px", background: "oklch(0.65 0.15 150 / 0.05)", borderRadius: "20px", border: "1px solid var(--success)", textAlign: "center" }}>
                  <p style={{ color: "var(--success)", fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>¡Activación completada!</p>
                  <p style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>Hemos enviado los accesos a <b>{form.email}</b></p>
                  <button onClick={handleClose} style={{ marginTop: "24px", width: "100%", padding: "14px", background: "var(--text-1)", border: "none", borderRadius: "12px", color: "white", fontWeight: 800, cursor: "pointer" }}>Cerrar y empezar</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .kr-embedded .kr-field { background: white !important; border-radius: 10px !important; border: 1px solid var(--border) !important; }
        .kr-embedded .kr-payment-button button { background: var(--accent) !important; border-radius: 10px !important; color: white !important; font-weight: 800 !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
