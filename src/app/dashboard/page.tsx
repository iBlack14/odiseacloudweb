"use client";

import React from "react";
import { 
  LayoutDashboard, Globe, CreditCard, Headphones, 
  Package, User, LogOut, ChevronRight, Plus, 
  Search, Bell, Settings, ExternalLink, Activity
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="dashboard-container">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Odisea" style={{ height: "28px" }} />
          <div style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
            ODISEA<span style={{ color: "var(--accent)" }}>.CLOUD</span>
          </div>
        </div>

        <nav className="nav-section">
          <div className="nav-label">Principal</div>
          <NavItem icon={<LayoutDashboard size={18} />} label="Panel Resumen" active />
          <NavItem icon={<Package size={18} />} label="Mis Servicios" />
          <NavItem icon={<Globe size={18} />} label="Gestión de Dominios" />
          
          <div className="nav-label">Administración</div>
          <NavItem icon={<CreditCard size={18} />} label="Facturación y Pagos" />
          <NavItem icon={<Activity size={18} />} label="Uso de Recursos" />
          <NavItem icon={<Headphones size={18} />} label="Centro de Soporte" />
          
          <div className="nav-label">Configuración</div>
          <NavItem icon={<Settings size={18} />} label="Ajustes de Perfil" />
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="white" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Nombre del Cliente</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>usuario@dominio.com</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.75rem', 
              padding: '0.85rem', 
              borderRadius: '10px',
              background: 'oklch(0.64 0.22 24 / 0.1)',
              color: 'oklch(0.64 0.22 24)',
              border: '1px solid oklch(0.64 0.22 24 / 0.2)',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <Search size={18} color="var(--text-3)" />
            <input type="text" placeholder="Buscar servicios, facturas o ayuda..." />
          </div>
          <div className="user-actions">
            <button className="action-btn"><Bell size={18} /></button>
            <button className="action-btn"><Settings size={18} /></button>
            <button style={{ 
              background: 'var(--accent)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 16px -4px var(--accent)'
            }}>
              <Plus size={18} /> Nuevo Servicio
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-header">
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>Bienvenido al <span style={{ color: 'var(--accent)' }}>Panel de Control</span></h1>
              <p style={{ color: 'var(--text-3)', fontWeight: 500 }}>Gestiona tus servicios activos y facturación desde aquí.</p>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard label="Servicios Activos" value="0" trend="Sin servicios contratados" />
            <StatCard label="Dominios Registrados" value="0" trend="Sin dominios activos" />
            <StatCard label="Saldo Pendiente" value="$0.00" trend="Al día con tus pagos" />
          </div>

          <div className="section-header">
            <h2>Servicios Recientes</h2>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Gestionar todos</button>
          </div>

          <div className="service-list">
            <div style={{ 
              padding: '4rem', 
              textAlign: 'center', 
              background: 'var(--bg-raised)', 
              borderRadius: '20px',
              border: '2px dashed var(--border)',
              color: 'var(--text-3)'
            }}>
              <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>Aún no tienes servicios activos</div>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Contrata un plan de hosting para comenzar.</p>
              <button 
                onClick={() => router.push('/#pricing')}
                style={{ 
                  background: 'var(--accent-dim)', 
                  color: 'var(--accent)', 
                  border: '1px solid var(--accent-border)', 
                  padding: '0.6rem 1.5rem', 
                  borderRadius: '10px', 
                  fontWeight: 800, 
                  cursor: 'pointer' 
                }}
              >
                Ver Planes de Hosting
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.85rem', 
      padding: '0.85rem 1rem', 
      borderRadius: '10px',
      background: active ? 'var(--accent-dim)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-2)',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: active ? 800 : 500,
      transition: 'all 0.15s',
      border: active ? '1px solid var(--accent-border)' : '1px solid transparent'
    }}>
      <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {active && <ChevronRight size={14} />}
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string, value: string, trend: string }) {
  return (
    <div style={{ 
      background: 'var(--bg-raised)', 
      border: '1px solid var(--border)', 
      padding: '2rem', 
      borderRadius: '20px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ color: 'var(--text-3)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>{label}</div>
      <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{trend}</div>
    </div>
  );
}

function ServiceRow({ name, type, status, price, period, expiry, icon }: { name: string, type: string, status: string, price: string, period: string, expiry: string, icon: any }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.25rem 1.75rem', 
      background: 'var(--bg-raised)', 
      border: '1px solid var(--border)',
      borderRadius: '16px',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.15rem' }}>{name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>{type} • Vence el {expiry}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 900, fontSize: '1.15rem', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            {price}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-3)' }}>{period}</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status}</div>
        </div>
        <button style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '8px', color: 'var(--text-2)', cursor: 'pointer' }}>
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
