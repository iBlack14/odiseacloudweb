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
}

type StepStatus = "pending" | "loading" | "done" | "error";
interface ProvStep { label: string; status: StepStatus; }

/* ── Helpers ─────────────────────────────────────── */
function slugifyName(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").slice(0, 16) || "cliente";
}

function generatePassword(len = 16): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!%&*";
  const rand = () => crypto.getRandomValues(new Uint32Array(1))[0];
  return Array.from({ length: len }, () => chars[rand() % chars.length]).join("");
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{ background: "rgba(0,163,255,0.12)", border: "1px solid rgba(0,163,255,0.25)", borderRadius: "6px", padding: "2px 10px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#00A3FF" }}>
      {copied ? "✓ Copiado" : "Copiar"}
    </button>
  );
}

function CredRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "8px" }}>
      <div>
        <p style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "3px" }}>{label}</p>
        <p style={{ fontSize: "14px", color: "white", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
      </div>
      <CopyBtn text={value} />
    </div>
  );
}

export default function CheckoutModal({ isOpen, onClose, planId, itemName, itemPrice, currency, domain: initialDomain }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState<"card" | "yape" | "transfer">("card");
  const [form, setForm] = useState({ name: "", email: "", domain: initialDomain || "" });
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formToken, setFormToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [prov, setProv] = useState<ProvStep[]>([
    { label: "Verificando transacción", status: "pending" },
    { label: "Aprovisionando en WHM", status: "pending" },
    { label: "Configurando zona DNS", status: "pending" },
    { label: "Instalando cPanel / WHM", status: "pending" },
    { label: "Enviando credenciales al cliente", status: "pending" },
  ]);

  const izipayInjected = useRef(false);
  const tokenFetched = useRef(false);

  useEffect(() => {
    if (initialDomain) setForm(prev => ({ ...prev, domain: initialDomain }));
  }, [initialDomain]);

  const prefetchToken = useCallback(async (name: string, email: string) => {
    if (tokenFetched.current) return;
    tokenFetched.current = true;
    setTokenLoading(true);
    try {
      const resp = await fetch('/api/izipay/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: itemPrice, currency, email: email || 'cliente@odisea.pe', name: name || 'Cliente' }),
      });
      const data = await resp.json();
      if (data.formToken) setFormToken(data.formToken);
    } catch (e) { console.error("Izipay token error", e); tokenFetched.current = false; }
    finally { setTokenLoading(false); }
  }, [itemPrice, currency]);

  useEffect(() => {
    if (step === 4 && payMethod === "card" && formToken && !izipayInjected.current) {
      izipayInjected.current = true;

      // @ts-ignore
      if (window.KR) {
        // @ts-ignore
        window.KR.setFormConfig({ formToken });
        return;
      }

      const darkThemeCss = `
        .kr-embedded { font-family: 'Inter', sans-serif !important; }
        .kr-field-wrapper, .kr-field { 
          background: rgba(255, 255, 255, 0.05) !important; 
          border: 1px solid rgba(255, 255, 255, 0.1) !important; 
          border-radius: 12px !important; 
        }
        .kr-field-element, .kr-field select { color: white !important; }
        .kr-label { color: #94a3b8 !important; font-size: 11px !important; text-transform: uppercase !important; font-weight: 700 !important; }
        .kr-payment-button button { 
          background: linear-gradient(135deg, #00A3FF, #0066cc) !important; 
          border-radius: 14px !important; padding: 16px !important; font-weight: 800 !important; 
        }
        .kr-field select { background: #0d1526 !important; }
      `;
      const cssBase64 = btoa(darkThemeCss);

      const script = document.createElement("script");
      script.src = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";
      script.setAttribute("kr-public-key", process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY || "47575197:testpublickey_a3D9ovCVNYiJPdPry70gIGYhzU8aRcLa1iEX72P5Cdixi");
      script.setAttribute("kr-post-url-success", "javascript:void(0)");
      script.setAttribute("kr-language", "es-PE");
      script.setAttribute("kr-custom-css", `data:text/css;base64,${cssBase64}`);
      script.onload = () => {
        // @ts-ignore
        if (window.KR) {
          // @ts-ignore
          window.KR.setFormConfig({ formToken });
          // @ts-ignore
          window.KR.onSubmit((res: any) => {
            if (res.clientAnswer?.orderStatus === "PAID") {
              setStep(5);
            }
            return false;
          });
        }
      };
      document.head.appendChild(script);
    }
  }, [step, payMethod, formToken]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1); setForm({ name: "", email: "", domain: initialDomain || "" }); setCreds({ username: "", password: "" });
    setProv(p => p.map(x => ({ ...x, status: "pending" }))); setDone(false); setLoading(false); setFormToken("");
    izipayInjected.current = false; tokenFetched.current = false;
    onClose();
  };

  const updateProv = (idx: number, status: StepStatus) =>
    setProv(prev => prev.map((p, i) => i === idx ? { ...p, status } : p));

  const runProvisioning = async () => {
    setStep(6);
    for (let i = 0; i < 5; i++) {
      updateProv(i, "loading");
      if (i === 1) {
        try {
          await fetch('/api/provision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: form.domain, username: creds.username, password: creds.password, email: form.email, planId }),
          });
        } catch { updateProv(i, "error"); }
      }
      if (i === 4) {
        try {
          await fetch('/api/send-credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: form.name, email: form.email, username: creds.username, password: creds.password, planName: itemName }),
          });
        } catch (e) { console.error(e); }
      }
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
      updateProv(i, "done");
    }
    setDone(true);
  };

  const next = async () => {
    if (step === 1) { setStep(2); return; }
    if (step === 2) {
      if (!form.name.trim() || !form.email.trim()) return;
      const username = slugifyName(form.name);
      const password = generatePassword(16);
      const finalDomain = form.domain || `${username}.odisea.live`;
      setCreds({ username, password });
      setForm(prev => ({ ...prev, domain: finalDomain }));
      setStep(3);
      return;
    }
    if (step === 3) {
      if (payMethod === "card") {
        setLoading(true);
        await prefetchToken(form.name, form.email);
        setLoading(false);
      }
      setStep(4);
      return;
    }
    if (step === 4) { setStep(5); return; }
    if (step === 5) { runProvisioning(); return; }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", fontSize: "15px", outline: "none", boxSizing: "border-box",
  };

  const canContinue = !(step === 2 && (!form.name.trim() || !form.email.trim()));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "480px", background: "linear-gradient(160deg, #0d1526 0%, #080c16 100%)", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px rgba(0,0,0,0.7)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <img src="/logo.png" alt="Odisea" style={{ height: "28px" }} />
          <button onClick={handleClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "#94a3b8" }}>×</button>
        </div>

        <div style={{ height: "2px", background: "rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #00A3FF, #00d4ff)", width: `${(Math.min(step, 5) / 5) * 100}%`, transition: "width 0.5s ease" }} />
        </div>

        <div style={{ padding: "28px 28px 20px" }}>
          {step === 1 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#00A3FF", textTransform: "uppercase", marginBottom: "6px" }}>Paso 1 de 4</p>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "white", marginBottom: "24px" }}>Resumen del Pedido</h2>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><p style={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>PLAN</p><p style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>{itemName}</p></div>
                <div style={{ textAlign: "right" }}><p style={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>TOTAL</p><p style={{ fontSize: "28px", fontWeight: 900, color: "white" }}>{formatPrice(itemPrice, currency)}</p></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#00A3FF", textTransform: "uppercase", marginBottom: "6px" }}>Paso 2 de 4</p>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "white", marginBottom: "24px" }}>Tus Datos</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input type="text" placeholder="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                <input type="email" placeholder="Correo electrónico" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#00A3FF", textTransform: "uppercase", marginBottom: "6px" }}>Paso 3 de 4</p>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "white", marginBottom: "20px" }}>Elige tu Pago</h2>
              <div style={{ display: "flex", gap: "10px" }}>
                {[{id:'card',label:'Tarjeta',icon:'💳'},{id:'yape',label:'Yape',icon:'📱'},{id:'transfer',label:'Banco',icon:'🏦'}].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id as any)} style={{ flex: 1, padding: "15px 5px", borderRadius: "16px", border: payMethod === m.id ? "2px solid #00A3FF" : "1px solid rgba(255,255,255,0.1)", background: payMethod === m.id ? "rgba(0,163,255,0.1)" : "rgba(255,255,255,0.02)", color: "white", cursor: "pointer" }}>
                    <div style={{ fontSize: "20px" }}>{m.icon}</div><div style={{ fontSize: "11px", fontWeight: 700, marginTop: "5px" }}>{m.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#00A3FF", textTransform: "uppercase", marginBottom: "6px" }}>Paso 4 de 4</p>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "white", marginBottom: "20px" }}>
                {payMethod === "card" ? "Finalizar Pago" : "Instrucciones de Pago"}
              </h2>
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", minHeight: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {payMethod === "card" ? (
                  tokenLoading ? <p style={{ color: "#64748b" }}>Cargando pasarela...</p> : <div style={{ width: "100%" }}><div className="kr-embedded" kr-form-token={formToken} /></div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>{payMethod === "yape" ? "📱" : "🏦"}</div>
                    <p style={{ color: "white", fontWeight: 600 }}>{payMethod === "yape" ? "Yape / Plin" : "Depósito Bancario"}</p>
                    <p style={{ fontSize: "13px", color: "#64748b", marginTop: "8px" }}>Realiza el pago y presiona el botón para confirmar.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "56px" }}>🎉</div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>¡Pedido Recibido!</h2>
              <p style={{ color: "#64748b" }}>Activaremos tu hosting en unos segundos.</p>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "white", textAlign: "center", marginBottom: "20px" }}>Activando...</h2>
              {prov.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", color: p.status === 'done' ? '#10B981' : 'white' }}>
                  <span>{p.status === 'done' ? '✓' : '○'}</span><span>{p.label}</span>
                </div>
              ))}
              {done && (
                <div style={{ marginTop: "15px", background: "rgba(0,163,255,0.06)", padding: "15px", borderRadius: "12px" }}>
                  <CredRow label="Usuario" value={creds.username} /><CredRow label="Contraseña" value={creds.password} />
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ padding: "16px 28px 24px" }}>
          {step <= 2 && (
            <button onClick={next} disabled={!canContinue} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #00A3FF, #0066cc)", border: "none", borderRadius: "14px", color: "white", fontWeight: 800, cursor: "pointer" }}>
              Continuar →
            </button>
          )}
          {step === 3 && (
            <button onClick={next} disabled={loading} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #00A3FF, #0066cc)", border: "none", borderRadius: "14px", color: "white", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Cargando pasarela..." : "Continuar →"}
            </button>
          )}
          {step === 4 && payMethod !== "card" && (
            <button onClick={next} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #00A3FF, #0066cc)", border: "none", borderRadius: "14px", color: "white", fontWeight: 800, cursor: "pointer" }}>
              He realizado el pago →
            </button>
          )}
          {step === 5 && (
            <button onClick={next} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #00A3FF, #0066cc)", border: "none", borderRadius: "14px", color: "white", fontWeight: 800, cursor: "pointer" }}>
              🚀 Activar Hosting
            </button>
          )}
          {step === 6 && done && (
            <button onClick={handleClose} style={{ width: "100%", padding: "15px", background: "#10B981", border: "none", borderRadius: "14px", color: "white", fontWeight: 800, cursor: "pointer" }}>Finalizar</button>
          )}
        </div>
      </div>
    </div>
  );
}
