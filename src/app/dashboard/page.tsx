"use client";

import React from "react";
import { LayoutDashboard, Globe, CreditCard, Headphones, Package, User, LogOut, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Mock logout logic
    router.push("/");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Sidebar - Light Tinted Neutral */}
      <aside style={{ 
        width: '300px', 
        background: 'oklch(0.97 0.01 260)', 
        borderRight: '1px solid var(--card-border)',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem' }}>
          <img src="/logo.png" alt="Odisea Logo" style={{ height: '32px', width: 'auto' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            ODISEA<span style={{ color: 'var(--primary)' }}>.CLOUD</span>
          </div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          <NavItem icon={<LayoutDashboard size={18} />} label="Resumen" active />
          <NavItem icon={<Package size={18} />} label="Mis Servicios" />
          <NavItem icon={<Globe size={18} />} label="Dominios" />
          <NavItem icon={<CreditCard size={18} />} label="Facturación" />
          <NavItem icon={<Headphones size={18} />} label="Soporte" />
        </nav>

        {/* User Info & Logout */}
        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--foreground)' }}>Usuario Demo</div>
              <div style={{ fontSize: '0.75rem', color: 'oklch(0.4 0.05 260)' }}>cliente@ejemplo.com</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '1rem', 
              borderRadius: '12px',
              background: 'oklch(0.6 0.15 20 / 0.1)',
              color: 'oklch(0.6 0.15 20)',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '5rem' }}>
        <header style={{ marginBottom: '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '0.75rem', fontWeight: 900, color: 'oklch(0.1 0.05 260)' }}>Panel de Control</h1>
            <p style={{ color: 'oklch(0.4 0.05 260)', fontSize: '1.1rem', fontWeight: 500 }}>Gestiona tu infraestructura y servicios activos.</p>
          </div>
          <button style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            padding: '1.2rem 2.5rem', 
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 15px 30px -10px oklch(0.6 0.18 260 / 0.4)'
          }}>
            Contratar Nuevo
          </button>
        </header>

        {/* Stats Grid - Solid Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
          <StatCard label="Servicios Activos" value="2" />
          <StatCard label="Dominios" value="1" />
          <StatCard label="Facturas Pendientes" value="0" />
        </div>

        {/* Active Services - High Contrast */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Servicios en curso</h2>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>Ver todo</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ServiceRow 
              name="Reseller Bronze" 
              status="Activo" 
              price="$29.99/mes" 
              expiry="15 Jun 2026"
            />
            <ServiceRow 
              name="Dominio: odiseahost.com" 
              status="Activo" 
              price="$12.00/año" 
              expiry="10 May 2027"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '1rem 1.2rem', 
      borderRadius: '12px',
      background: active ? 'var(--primary-muted)' : 'transparent',
      color: active ? 'var(--primary)' : 'oklch(0.7 0.02 260)',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: active ? 800 : 500,
      transition: 'all 0.2s'
    }}>
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      {active && <ChevronRight size={16} />}
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ 
      background: 'var(--card-bg)', 
      border: '1px solid var(--card-border)', 
      padding: '3rem 2.5rem', 
      borderRadius: '28px'
    }}>
      <div style={{ color: 'oklch(0.7 0.02 260)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>{label}</div>
      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>{value}</div>
    </div>
  );
}

function ServiceRow({ name, status, price, expiry }: { name: string, status: string, price: string, expiry: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '2rem 3rem', 
      background: 'oklch(0.16 0.02 260 / 0.5)', 
      border: '1px solid var(--card-border)',
      borderRadius: '24px',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--background)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
          <Package size={24} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{name}</div>
          <div style={{ fontSize: '0.85rem', color: 'oklch(0.6 0.02 260)' }}>Vence el {expiry}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>{price}</div>
        <div style={{ fontSize: '0.75rem', color: 'oklch(0.7 0.15 150)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{status}</div>
      </div>
    </div>
  );
}
