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
  const [form, setForm] = useState({ name: "", email: "", domain: initialDomain || "" });
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formToken, setFormToken] = useState("");
  const [apiPublicKey, setApiPublicKey] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [done, setDone] = useState(false);
  
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
    setStep(1); setDone(false); setFormToken(""); setApiPublicKey(""); onClose();
  };

  const next = async () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (!form.name.trim() || !form.email.trim()) return;
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
              planId, isReseller: planType === 'reseller'
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
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(2,4,8,0.92)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "480px", background: "linear-gradient(165deg, #0f172a 0%, #020617 100%)", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        
        <div style={{ padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo.png" alt="Odisea" style={{ height: "28px" }} />
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#10B981", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "10px" }}>ODISEA BILLING</span>
          </div>
          <button onClick={handleClose} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", width: "32px", height: "32px", cursor: "pointer", color: "white" }}>×</button>
        </div>

        <div style={{ padding: "0 40px 40px" }}>
          {step <= 3 && (
            <div style={{ animation: "fadeIn 0.4s" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "white", marginBottom: "20px" }}>{step === 1 ? "Resumen" : step === 2 ? "Tus Datos" : "Método de Pago"}</h2>
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
                  <input type="text" placeholder="Tu nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", color: "white", outline: "none" }} />
                  <input type="email" placeholder="Tu email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", color: "white", outline: "none" }} />
                </div>
              )}
              {step === 3 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  {currency === "PEN" ? (
                    <>
                      <button onClick={() => setPayMethod("card")} style={{ padding: "24px 10px", borderRadius: "20px", border: payMethod === "card" ? "2px solid #00A3FF" : "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "white", cursor: "pointer" }}>
                        <div style={{ fontSize: "28px" }}>💳</div><div style={{ fontSize: "11px", fontWeight: 800 }}>TARJETA</div>
                      </button>
                      <button onClick={() => setPayMethod("yape")} style={{ padding: "24px 10px", borderRadius: "20px", border: payMethod === "yape" ? "2px solid #00A3FF" : "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "white", cursor: "pointer" }}>
                        <div style={{ fontSize: "28px" }}>📱</div><div style={{ fontSize: "11px", fontWeight: 800 }}>YAPE</div>
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setPayMethod("crypto")} style={{ gridColumn: "span 2", padding: "24px 10px", borderRadius: "20px", border: "2px solid #F7931A", background: "rgba(247,147,26,0.05)", color: "white" }}>
                      <div style={{ fontSize: "28px" }}>₿</div><div style={{ fontSize: "11px", fontWeight: 800 }}>CRIPTO</div>
                    </button>
                  )}
                </div>
              )}
              <button onClick={next} disabled={loading} style={{ width: "100%", padding: "18px", background: "#00A3FF", border: "none", borderRadius: "18px", color: "white", fontSize: "16px", fontWeight: 800 }}>Continuar →</button>
            </div>
          )}

          {step === 4 && (
            <div style={{ animation: "fadeIn 0.4s" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "white", marginBottom: "20px" }}>Pago Seguro</h2>
              <div id="izipay-container" style={{ background: "rgba(255,255,255,0.015)", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", padding: "30px", minHeight: "340px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {payMethod === "card" && currency === "PEN" ? (
                  tokenLoading ? <p style={{ color: "#64748b" }}>Cargando pasarela...</p> : (
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
                    <div style={{ fontSize: "64px" }}>{payMethod === "crypto" ? "₿" : "📱"}</div>
                    <p style={{ color: "white", fontSize: "18px", fontWeight: 800 }}>{payMethod === "crypto" ? "Pago con USDT" : "Pago Manual"}</p>
                    <button onClick={() => setStep(5)} style={{ marginTop: "20px", padding: "12px 24px", background: "#00A3FF", border: "none", borderRadius: "12px", color: "white" }}>Confirmar Envío</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: "center", color: "white", padding: "40px 0" }}>
              <div style={{ fontSize: "80px", marginBottom: "20px" }}>🎉</div>
              <h2 style={{ fontSize: "28px", fontWeight: 900 }}>¡Pago Confirmado!</h2>
              <button onClick={next} style={{ marginTop: "30px", width: "100%", padding: "18px", background: "#10B981", border: "none", borderRadius: "18px", color: "white", fontSize: "16px", fontWeight: 800 }}>🚀 Activar {planType === 'reseller' ? 'WHM' : 'Panel'} Ahora</button>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "white", textAlign: "center", marginBottom: "30px" }}>{planType === 'reseller' ? 'Aprovisionando Reseller WHM' : 'Activando Odin Cloud'}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {prov.map((p, i) => (
                  <div key={i} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: `1px solid ${p.status === 'done' ? '#10B981' : 'rgba(255,255,255,0.05)'}`, color: "white", display: "flex", alignItems: "center", gap: "15px" }}>
                    <span>{p.status === 'done' ? '✓' : p.status === 'loading' ? '⟳' : '○'}</span>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>{p.label}</span>
                  </div>
                ))}
              </div>
              {done && (
                <div style={{ marginTop: "30px", padding: "24px", background: "rgba(16,185,129,0.1)", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.2)", textAlign: "center" }}>
                  <p style={{ color: "#10B981", fontWeight: 800, fontSize: "18px" }}>¡Todo Listo!</p>
                  <p style={{ color: "white", fontSize: "14px" }}>Revisa tu correo <b>{form.email}</b> para ver tus accesos.</p>
                  <button onClick={handleClose} style={{ marginTop: "20px", width: "100%", padding: "14px", background: "white", border: "none", borderRadius: "12px", color: "black", fontWeight: 800 }}>Entendido</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .kr-embedded .kr-field { background: rgba(255,255,255,0.05) !important; border-radius: 12px !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        .kr-embedded .kr-payment-button button { background: #00A3FF !important; border-radius: 12px !important; color: white !important; font-weight: 800 !important; }
      `}</style>
    </div>
  );
}
