"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, Zap, ChevronLeft, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
                  <div className="input-wrapper">
                    <span className="input-icon-left"><Mail size={18} /></span>
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
                  <div className="input-wrapper">
                    <span className="input-icon-left"><Lock size={18} /></span>
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <button 
                      type="button" 
                      className="input-icon-right" 
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
          background: var(--bg-raised);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          color: var(--text-1);
          font-family: var(--font-body);
        }
        
        .login-visual-bg {
          position: absolute;
          inset: 0;
          background-image: url('/hero_background_abstract_1778689298235.png'); /* Using the new abstract bg */
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          filter: blur(40px);
        }
        .liquid-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, oklch(0.68 0.18 245 / 0.05) 0%, transparent 60%),
                      radial-gradient(circle at 80% 70%, oklch(0.68 0.18 245 / 0.08) 0%, transparent 50%);
        }
        .glow-sphere { display: none; }

        .error-banner {
          background: oklch(0.65 0.15 25 / 0.1);
          border: 1px solid oklch(0.65 0.15 25 / 0.2);
          color: var(--danger);
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
          font-weight: 700;
          color: var(--text-3);
          cursor: pointer;
          margin-bottom: 3rem;
          transition: color 0.2s;
          background: white;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .back-action:hover { color: var(--accent); border-color: var(--accent); }

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
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin-bottom: 3rem;
          color: var(--text-1);
        }
        .display-title span { color: var(--accent); }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 380px;
        }
        .feature-card {
          display: flex;
          gap: 1.25rem;
          align-items: center;
          background: white;
          padding: 1.25rem;
          border-radius: 20px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .icon-box {
          width: 48px;
          height: 48px;
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }
        .feat-text { flex: 1; }
        .feature-card h5 { font-size: 1rem; font-weight: 800; color: var(--text-1); margin-bottom: 0.25rem; }
        .feature-card p { font-size: 0.85rem; color: var(--text-2); margin: 0; line-height: 1.4; }

        .glass-card {
          background: white;
          border: 1px solid var(--border-hi);
          border-radius: 32px;
          padding: 3.5rem;
          box-shadow: var(--shadow-xl);
        }
        .form-header h1 { font-size: 2.25rem; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .form-header p { color: var(--text-2); font-size: 0.95rem; margin-bottom: 2.5rem; }

        .actual-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-group label { font-size: 0.75rem; font-weight: 800; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
        .row-between { display: flex; justify-content: space-between; align-items: center; }
        .link-sm { font-size: 0.75rem; color: var(--accent); font-weight: 700; text-decoration: none; transition: opacity 0.2s; }
        .link-sm:hover { opacity: 0.8; }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon-left {
          position: absolute;
          left: 1.25rem;
          color: var(--text-3);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .input-icon-right {
          position: absolute;
          right: 1.25rem;
          color: var(--text-3);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s;
        }
        .input-icon-right:hover { color: var(--text-1); }
        
        .input-wrapper input {
          width: 100%;
          display: block;
          background: var(--bg-raised);
          border: 1px solid var(--border);
          padding: 1.25rem 3.5rem;
          border-radius: 16px;
          color: var(--text-1);
          font-size: 1rem;
          font-family: var(--font-body);
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          height: 60px;
          box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.02);
        }
        .input-wrapper input:focus {
          background: white;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px var(--accent-dim), inset 0 2px 4px 0 rgba(0,0,0,0.02);
          outline: none;
        }
        .input-wrapper input::placeholder { color: var(--text-3); font-weight: 400; }

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
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 25px -8px oklch(0.68 0.18 245 / 0.5);
        }
        .prime-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 15px 35px -10px oklch(0.68 0.18 245 / 0.6); 
          background: var(--accent-hi);
        }
        .prime-btn:active { transform: translateY(0); }

        .form-footer {
          margin-top: 2.5rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-2);
        }
        .form-footer a { color: var(--accent); font-weight: 800; text-decoration: none; }

        @media (max-width: 1024px) {
          .login-grid { grid-template-columns: 1fr; gap: 4rem; }
          .features-side { display: none; }
          .glass-card { padding: 2.5rem; }
          .display-title { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
}
