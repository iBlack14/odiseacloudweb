"use client";

import React, { useState } from "react";
import { Currency, formatPrice } from "../lib/pricing";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  itemName: string;
  itemPrice: number;
  currency: Currency;
}

type StepStatus = "pending" | "loading" | "done" | "error";

interface ProvStep {
  label: string;
  status: StepStatus;
}

export default function CheckoutModal({ isOpen, onClose, planId, itemName, itemPrice, currency }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState<"card" | "yape" | "transfer">("card");
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [prov, setProv] = useState<ProvStep[]>([
    { label: "Verificando transacción", status: "pending" },
    { label: "Asignando nodo de cómputo", status: "pending" },
    { label: "Configurando zona DNS", status: "pending" },
    { label: "Instalando cPanel / WHM", status: "pending" },
    { label: "Finalizando aprovisionamiento", status: "pending" },
  ]);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const updateProv = (idx: number, status: StepStatus) => {
    setProv(prev => prev.map((p, i) => i === idx ? { ...p, status } : p));
  };

  const runProvisioning = async () => {
    setStep(5);
    for (let i = 0; i < 5; i++) {
      updateProv(i, "loading");
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
      updateProv(i, "done");
    }
    setDone(true);
  };

  const next = async () => {
    if (step === 1) { setStep(2); return; }
    if (step === 2) {
      if (!form.email || !form.username || !form.password) return;
      setStep(3); return;
    }
    if (step === 3) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1800));
      setLoading(false);
      setStep(4); return;
    }
    if (step === 4) { runProvisioning(); return; }
  };

  const statusIcon = (s: StepStatus) => {
    if (s === "done") return "✓";
    if (s === "loading") return "⟳";
    if (s === "error") return "✕";
    return "○";
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "500px", background: "linear-gradient(145deg, #0f1623 0%, #0a0f1a 100%)", borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* ── HEADER ── */}
        <div style={{ padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/logo.png" alt="Odisea" style={{ height: "36px", objectFit: "contain" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#00A3FF", background: "rgba(0,163,255,0.1)", border: "1px solid rgba(0,163,255,0.2)", padding: "3px 10px", borderRadius: "100px", letterSpacing: "0.05em" }}>🔒 SECURE</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", color: "#94a3b8", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div style={{ height: "2px", background: "rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #00A3FF, #00d1ff)", width: `${Math.min(step / 4, 1) * 100}%`, transition: "width 0.5s ease" }} />
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding: "36px 36px 28px", flex: 1 }}>

          {/* STEP 1 — Resumen */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#00A3FF", letterSpacing: "0.12em", marginBottom: "8px", textTransform: "uppercase" }}>Paso 1 de 4</p>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "white", marginBottom: "28px", letterSpacing: "-0.02em" }}>Resumen del Pedido</h2>

              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, rgba(0,163,255,0.2), rgba(0,163,255,0.05))", border: "1px solid rgba(0,163,255,0.2)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🖥️</div>
                  <div>
                    <p style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Plan Seleccionado</p>
                    <p style={{ fontSize: "17px", fontWeight: 700, color: "white" }}>{itemName}</p>
                  </div>
                </div>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>Total a Pagar</p>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "32px", fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1 }}>{formatPrice(itemPrice, currency)}</p>
                    <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Incluye impuestos</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "20px", padding: "14px 18px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "16px" }}>🛡️</span>
                <p style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: 600 }}>Pago 100% seguro con encriptación SSL de 256 bits</p>
              </div>
            </div>
          )}

          {/* STEP 2 — Cuenta */}
          {step === 2 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#00A3FF", letterSpacing: "0.12em", marginBottom: "8px", textTransform: "uppercase" }}>Paso 2 de 4</p>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "white", marginBottom: "8px", letterSpacing: "-0.02em" }}>Datos de tu Cuenta</h2>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "28px" }}>Crea las credenciales para acceder a tu panel de hosting.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { label: "👤 Usuario de Hosting", key: "username", type: "text", ph: "ej: miempresa" },
                  { label: "📧 Correo de Contacto", key: "email", type: "email", ph: "hola@empresa.com" },
                  { label: "🔑 Contraseña del Panel", key: "password", type: "password", ph: "••••••••••" }
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.ph}
                      value={(form as any)[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Pago */}
          {step === 3 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#00A3FF", letterSpacing: "0.12em", marginBottom: "8px", textTransform: "uppercase" }}>Paso 3 de 4</p>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "white", marginBottom: "28px", letterSpacing: "-0.02em" }}>Método de Pago</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { id: "card", icon: "💳", label: "Tarjeta Débito / Crédito", sub: "Visa, Mastercard, AMEX" },
                  { id: "yape", icon: "📱", label: "Yape / Plin", sub: "Escanea el QR con tu app" },
                  { id: "transfer", icon: "🏦", label: "Transferencia Bancaria", sub: "BCP, Interbank, BBVA, Scotiabank" },
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id as any)} style={{ background: payMethod === m.id ? "rgba(0,163,255,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${payMethod === m.id ? "#00A3FF" : "rgba(255,255,255,0.07)"}`, borderRadius: "16px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                    <span style={{ fontSize: "24px" }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "2px" }}>{m.label}</p>
                      <p style={{ fontSize: "11px", color: "#64748b" }}>{m.sub}</p>
                    </div>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${payMethod === m.id ? "#00A3FF" : "#334155"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {payMethod === m.id && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00A3FF" }} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — Confirmación */}
          {step === 4 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "white", marginBottom: "12px" }}>¡Pago Confirmado!</h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, maxWidth: "300px", margin: "0 auto 28px" }}>Todo está listo. Presiona el botón para iniciar el despliegue de tu infraestructura.</p>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "16px 20px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Plan</span>
                <span style={{ fontSize: "12px", color: "white", fontWeight: 700 }}>{itemName}</span>
              </div>
            </div>
          )}

          {/* STEP 5 — Provisioning */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "white", marginBottom: "8px", textAlign: "center" }}>Activando Servicios</h2>
              <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", marginBottom: "32px" }}>Esto tomará solo unos segundos...</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {prov.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", background: p.status === "done" ? "rgba(16,185,129,0.06)" : p.status === "loading" ? "rgba(0,163,255,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${p.status === "done" ? "rgba(16,185,129,0.15)" : p.status === "loading" ? "rgba(0,163,255,0.15)" : "rgba(255,255,255,0.04)"}`, borderRadius: "14px", transition: "all 0.4s" }}>
                    <span style={{ fontSize: "16px", color: p.status === "done" ? "#10B981" : p.status === "loading" ? "#00A3FF" : "#334155", fontWeight: 900, animation: p.status === "loading" ? "spin 1s linear infinite" : "none" }}>{statusIcon(p.status)}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: p.status === "pending" ? "#475569" : "white" }}>{p.label}</span>
                    {p.status === "done" && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#10B981", fontWeight: 700 }}>OK</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div style={{ padding: "20px 36px 28px" }}>
          {step < 5 && (
            <button
              onClick={next}
              disabled={loading}
              style={{ width: "100%", padding: "17px", background: loading ? "#1e3a5f" : "linear-gradient(135deg, #00A3FF 0%, #0066dd 100%)", border: "none", borderRadius: "16px", color: "white", fontSize: "15px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: loading ? "none" : "0 8px 24px rgba(0,163,255,0.35)", transition: "all 0.3s", letterSpacing: "-0.01em" }}
            >
              {loading ? "⟳ Procesando..." : step === 4 ? "🚀 Activar Infraestructura" : step === 3 ? "💳 Confirmar Pago" : "Continuar →"}
            </button>
          )}
          {step === 5 && done && (
            <button
              onClick={onClose}
              style={{ width: "100%", padding: "17px", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", border: "none", borderRadius: "16px", color: "white", fontSize: "15px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}
            >
              ✓ Ir al Panel de Control →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
