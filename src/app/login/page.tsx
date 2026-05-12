"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, Zap, ChevronLeft } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (username.length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ODISEA_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "Error al iniciar sesión");
      }

      // Save token (simple localStorage for testing, should be secure cookies/session)
      localStorage.setItem("odisea_token", result.data.token);
      localStorage.setItem("odisea_role", result.data.role);

      router.push(result.data.redirectTo || "/dashboard");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Background Visuals ── */}
      <div className="login-visual-bg">
        <div className="liquid-overlay" />
        <div className="glow-sphere" />
      </div>
      
      <div className="login-content">
        <motion.div 
          className="back-action"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/")}
        >
          <ChevronLeft size={18} /> <span>Volver al Inicio</span>
        </motion.div>

        <div className="login-grid">
          {/* ── Left: Features (Hidden on mobile) ── */}
          <div className="features-side">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="brand-logo">
                <img src="/logo.png" alt="Odisea" />
                ODISEA<span>.CLOUD</span>
              </div>
              <h2 className="display-title">Tu portal al <br/><span>futuro digital.</span></h2>
              
              <div className="features-list">
                <div className="feature-card">
                  <div className="icon-box"><Zap size={20} /></div>
                  <div className="feat-text">
                    <h5>Velocidad Extrema</h5>
                    <p>Tecnología NVMe de última generación.</p>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="icon-box"><ShieldCheck size={20} /></div>
                  <div className="feat-text">
                    <h5>Seguridad Total</h5>
                    <p>Protección proactiva 24/7.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Login Form ── */}
          <motion.div 
            className="form-card-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass-card">
              <div className="form-header">
                <h1>Iniciar Sesión</h1>
                <p>Ingresa tus datos para continuar.</p>
              </div>

              {error && (
                <motion.div 
                  className="error-banner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <ShieldCheck size={16} /> {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="actual-form">
                <div className="field-group">
                  <label>Usuario o Email</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="icon-abs" />
                    <input 
                      type="text" 
                      placeholder="admin o ejem@correo.com" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="field-group">
                  <div className="row-between">
                    <label>Contraseña</label>
                    <a href="#" className="link-sm">¿Olvidaste la clave?</a>
                  </div>
                  <div className="input-with-icon">
                    <Lock size={18} className="icon-abs" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="prime-btn" disabled={loading}>
                  {loading ? (
                    <span className="flex-center">Conectando...</span>
                  ) : (
                    <>Acceder al Panel <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="form-footer">
                ¿No tienes cuenta? <a href="/#pricing">Ver planes</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          color: white;
          font-family: var(--font-body);
        }
        
        .login-visual-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          opacity: 0.4;
          filter: blur(80px) saturate(1.5);
        }
        .liquid-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, oklch(0.62 0.22 259 / 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, oklch(0.62 0.22 259 / 0.1) 0%, transparent 50%);
        }
        .glow-sphere {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, oklch(0.62 0.22 259 / 0.1) 0%, transparent 70%);
          top: -10%;
          right: -10%;
          filter: blur(60px);
        }

        .error-banner {
          background: oklch(0.62 0.22 15 / 0.1);
          border: 1px solid oklch(0.62 0.22 15 / 0.2);
          color: #ff4d4d;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .login-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1100px;
        }

        .back-action {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: oklch(1 0 0 / 0.6);
          cursor: pointer;
          margin-bottom: 3rem;
          transition: color 0.2s;
        }
        .back-action:hover { color: white; }

        .login-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 6rem;
          align-items: center;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .brand-logo img { height: 32px; }
        .brand-logo span { color: var(--accent); }

        .display-title {
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 4rem;
        }
        .display-title span { color: var(--accent); }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 380px;
        }
        .feature-card {
          display: flex;
          gap: 1.25rem;
          align-items: center;
          background: oklch(1 0 0 / 0.03);
          padding: 1.25rem;
          border-radius: 20px;
          border: 1px solid oklch(1 0 0 / 0.05);
        }
        .icon-box {
          width: 48px;
          height: 48px;
          background: var(--accent-dim);
          border: 1px solid var(--accent-border);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }
        .feat-text { flex: 1; }
        .feature-card h5 { font-size: 1rem; margin-bottom: 0.25rem; }
        .feature-card p { font-size: 0.85rem; color: oklch(1 0 0 / 0.5); margin: 0; }

        .glass-card {
          background: oklch(0.12 0.01 258 / 0.8);
          backdrop-filter: blur(30px);
          border: 1px solid oklch(1 0 0 / 0.1);
          border-radius: 32px;
          padding: 4rem;
          box-shadow: 0 50px 100px -20px oklch(0 0 0 / 0.5);
        }
        .form-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .form-header p { color: oklch(1 0 0 / 0.5); font-size: 0.95rem; margin-bottom: 3rem; }

        .actual-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .field-group label { font-size: 0.8rem; font-weight: 700; color: oklch(1 0 0 / 0.8); text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
        .row-between { display: flex; justify-content: space-between; align-items: center; }
        .link-sm { font-size: 0.75rem; color: var(--accent); font-weight: 600; text-decoration: none; }

        .input-with-icon { position: relative; display: flex; align-items: center; }
        .icon-abs { 
          position: absolute; 
          left: 1.25rem; 
          top: 50%; 
          transform: translateY(-50%); 
          color: oklch(1 0 0 / 0.3); 
          z-index: 10;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .input-with-icon input {
          width: 100%;
          background: oklch(0 0 0 / 0.3);
          border: 1px solid oklch(1 0 0 / 0.1);
          padding: 1.25rem 1.25rem 1.25rem 3.5rem;
          border-radius: 16px;
          color: white;
          font-size: 1rem;
          font-family: var(--font-body);
          transition: all 0.2s;
          height: 60px; /* Force consistent height */
        }
        .input-with-icon input:focus {
          background: oklch(0 0 0 / 0.5);
          border-color: var(--accent);
          box-shadow: 0 0 0 4px var(--accent-dim);
          outline: none;
        }

        .prime-btn {
          margin-top: 1rem;
          background: var(--accent);
          color: white;
          border: none;
          padding: 1.25rem;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.2s;
          box-shadow: 0 15px 30px -5px oklch(0.62 0.22 259 / 0.4);
        }
        .prime-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -5px oklch(0.62 0.22 259 / 0.5); }
        .prime-btn:active { transform: translateY(0); }

        .form-footer {
          margin-top: 2.5rem;
          text-align: center;
          font-size: 0.9rem;
          color: oklch(1 0 0 / 0.5);
        }
        .form-footer a { color: var(--accent); font-weight: 700; text-decoration: none; }

        @media (max-width: 1024px) {
          .login-grid { grid-template-columns: 1fr; gap: 4rem; }
          .features-side { display: none; }
          .glass-card { padding: 3rem; }
          .display-title { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
}
