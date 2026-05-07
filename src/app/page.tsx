"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Server, Globe, Zap, ArrowRight, Check, Search } from "lucide-react";
import { searchDomain, DomainAvailability } from "@/lib/domains";
import CheckoutModal from "@/components/CheckoutModal";
import { calculateFinalPrice, formatPrice, Currency } from "@/lib/pricing";
import { fetchOdiseaPlans } from "@/lib/plans";
import { useQuery } from "@tanstack/react-query";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DomainAvailability[]>([]);
  const [loading, setLoading] = useState(false);

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ name: "", price: 0 });

  // React Query for Plans
  const { data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchOdiseaPlans,
  });

  const getPrice = (base: number) => {
    const p = calculateFinalPrice(base, currency);
    return formatPrice(p.total, currency);
  };

  const openCheckout = (name: string, basePrice: number) => {
    setSelectedItem({ name, price: basePrice });
    setIsCheckoutOpen(true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    try {
      const data = await searchDomain(searchQuery, currency);
      setResults(data);
    } catch (error) {
      console.error("Error searching domain", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Sticky Navigation */}
      <nav style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--card-border)',
        padding: '1rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="/logo.png" alt="Odisea Logo" style={{ height: '36px', width: 'auto' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.05em', color: 'var(--foreground)' }}>
              ODISEA<span style={{ color: 'var(--primary)' }}>.CLOUD</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <a href="#" style={{ color: 'oklch(0.4 0.05 260)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Soluciones</a>
            <a href="#" style={{ color: 'oklch(0.4 0.05 260)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Soporte</a>
            
            <div style={{ 
              display: 'flex', 
              background: 'rgba(0,0,0,0.05)', 
              padding: '3px', 
              borderRadius: '10px',
              border: '1px solid var(--card-border)'
            }}>
              <button 
                onClick={() => setCurrency('USD')}
                style={{
                  padding: '5px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: currency === 'USD' ? 'var(--primary)' : 'transparent',
                  color: currency === 'USD' ? 'white' : 'var(--foreground)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >USD</button>
              <button 
                onClick={() => setCurrency('PEN')}
                style={{
                  padding: '5px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: currency === 'PEN' ? 'var(--primary)' : 'transparent',
                  color: currency === 'PEN' ? 'white' : 'var(--foreground)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >PEN</button>
            </div>
            
            <a href="/dashboard" style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '0.7rem 1.4rem', 
              borderRadius: '12px', 
              fontSize: '0.9rem', 
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 10px 20px -5px oklch(0.6 0.18 260 / 0.3)'
            }}>Área de Clientes</a>
          </div>
        </div>
      </nav>

      <div style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{ textAlign: 'center', padding: '12rem 0 10rem' }}
        >
          <motion.h1 variants={itemVariants} style={{ fontSize: '5.5rem', marginBottom: '2rem', lineHeight: 1, fontWeight: 900, color: 'oklch(0.1 0.05 260)' }}>
            Domina la web con <br />
            <span style={{ color: 'var(--primary)' }}>Infraestructura Elite</span>
          </motion.h1>
          <motion.p variants={itemVariants} style={{ fontSize: '1.4rem', color: 'oklch(0.4 0.05 260)', maxWidth: '700px', margin: '0 auto 5rem', fontWeight: 500 }}>
            Hosting de ultra-bajo retardo, dominios globales y herramientas para revendedores de alto volumen.
          </motion.p>

          {/* Domain Search UI */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSearch} style={{ 
              background: 'white', 
              border: '1px solid var(--card-border)',
              borderRadius: '32px',
              padding: '0.8rem',
              display: 'flex',
              maxWidth: '850px',
              margin: '0 auto',
              boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '1.5rem' }}>
                <Search size={20} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Escribe el nombre de tu marca aquí..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    padding: '1.2rem', 
                    color: 'oklch(0.1 0.05 260)',
                    fontSize: '1.15rem',
                    outline: 'none',
                    fontWeight: 500
                  }}
                />
              </div>
              <button 
                disabled={loading}
                style={{ 
                  background: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0 3rem', 
                  borderRadius: '18px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 0 20px var(--primary-glow)',
                  opacity: loading ? 0.7 : 1
                }}>
                {loading ? "Analizando..." : "Verificar Disponibilidad"}
              </button>
            </form>
          </motion.div>
        </motion.section>

        {/* Search Results */}
        {results.length > 0 && (
          <div style={{ 
            maxWidth: '700px', 
            margin: '2rem auto 0', 
            background: 'var(--card-bg)', 
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
          }}>
            {results.map((res, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1.2rem 2rem',
                borderBottom: i === results.length - 1 ? 'none' : '1px solid var(--glass-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{res.domain}</div>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    background: res.available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: res.available ? '#10b981' : '#ef4444',
                    fontWeight: 700
                  }}>
                    {res.available ? "DISPONIBLE" : "OCUPADO"}
                  </span>
                </div>
                {res.available && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{res.priceUser}</div>
                    <button 
                      onClick={() => openCheckout(res.domain, res.priceUSD)}
                      style={{ 
                      background: 'white', 
                      color: 'black', 
                      border: 'none', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}>Comprar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Plans Section */}
        <section style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4rem', marginBottom: '4rem' }}>
            <div style={{ textAlign: 'center', flex: '1 1 100%' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Nuestros <span style={{ color: 'var(--primary)' }}>Servicios</span></h2>
              <p style={{ color: 'var(--text-muted)' }}>Potencia y escalabilidad para cada etapa de tu negocio</p>
            </div>

            {/* Hosting Personal Section */}
            <div style={{ flex: '1 1 100%', marginTop: '2rem' }}>
               <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <Server size={24} color="var(--primary)" /> Hosting Compartido
               </h3>
               <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                 gap: '2rem' 
               }}>
                  {plans.filter(p => p.type === 'shared').map(plan => (
                    <div key={plan.id} className="plan-card" style={cardStyle}>
                      <h4>{plan.name}</h4>
                      <div style={{ fontSize: '2rem', fontWeight: 700, margin: '1rem 0' }}>{getPrice(plan.price)}<span style={{ fontSize: '0.8rem', color: 'oklch(0.4 0.05 260)' }}>/mes</span></div>
                      <ul style={listStyle}>
                        {plan.features.map((f, i) => (
                          <li key={i} style={listItemStyle}><Check size={14} color="var(--primary)" /> {f}</li>
                        ))}
                      </ul>
                      <button onClick={() => openCheckout(plan.name, plan.price)} style={btnStyle}>Contratar</button>
                    </div>
                  ))}
               </div>
            </div>

            {/* Reseller Section */}
            <div style={{ flex: '1 1 100%', marginTop: '4rem' }}>
               <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <Shield size={24} color="var(--primary)" /> Programas Reseller (WHM)
               </h3>
               <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                 gap: '2rem' 
               }}>
                  {plans.filter(p => p.type === 'reseller').map(plan => {
                    const isPopular = plan.id.includes('silver');
                    return (
                      <div key={plan.id} className="plan-card" style={{
                        ...cardStyle,
                        border: isPopular ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                        background: isPopular ? 'oklch(0.6 0.18 260 / 0.03)' : 'var(--card-bg)',
                        boxShadow: isPopular ? '0 20px 40px -10px oklch(0.6 0.18 260 / 0.1)' : 'none'
                      }}>
                        {isPopular && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em' }}>POPULAR</div>}
                        <h4>{plan.name}</h4>
                        <div style={{ fontSize: isPopular ? '2.5rem' : '2rem', fontWeight: isPopular ? 900 : 700, margin: '1rem 0' }}>{getPrice(plan.price)}<span style={{ fontSize: '0.8rem', color: 'oklch(0.4 0.05 260)' }}>/mes</span></div>
                        <ul style={listStyle}>
                          {plan.features.map((f, i) => (
                            <li key={i} style={listItemStyle}><Check size={14} color="var(--primary)" /> {f}</li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => openCheckout(plan.name, plan.price)} 
                          style={{...btnStyle, background: isPopular ? 'var(--primary)' : 'transparent', color: isPopular ? 'white' : 'inherit'}}
                        >
                          Ser Reseller
                        </button>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Digital Services Section - NEW */}
            <div style={{ marginTop: '8rem', textAlign: 'center', width: '100%' }}>
              <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 900 }}>Servicios <span style={{ color: 'var(--primary)' }}>Digitales</span></h2>
              <p style={{ color: 'oklch(0.4 0.05 260)', fontSize: '1.2rem', marginBottom: '5rem' }}>Soluciones de desarrollo a medida para marcas que buscan la excelencia.</p>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
                gap: '3rem' 
              }}>
                {/* Web Design Card */}
                <div style={{ 
                  background: 'white', 
                  border: '1px solid var(--card-border)', 
                  borderRadius: '32px', 
                  padding: '4rem',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'oklch(0.6 0.18 200 / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(0.6 0.18 200)' }}>
                    <Zap size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Diseño Web Corporativo</h3>
                    <p style={{ color: 'oklch(0.4 0.05 260)', lineHeight: 1.8 }}>Creamos presencia digital con identidad propia. Sitios web optimizados para conversión, velocidad extrema y SEO desde el primer día.</p>
                  </div>
                  <ul style={{ ...listStyle, marginBottom: '1rem' }}>
                    <li style={listItemStyle}><Check size={16} color="var(--primary)" /> Diseño UI/UX Exclusivo</li>
                    <li style={listItemStyle}><Check size={16} color="var(--primary)" /> Optimización de Velocidad</li>
                    <li style={listItemStyle}><Check size={16} color="var(--primary)" /> Soporte Multilenguaje</li>
                  </ul>
                  <button 
                    onClick={() => openCheckout("Diseño Web Corporativo", 499.00)}
                    style={{ ...btnStyle, background: 'oklch(0.1 0.05 260)', color: 'white', border: 'none', padding: '1.2rem' }}>
                    Solicitar Cotización <ArrowRight size={18} />
                  </button>
                </div>

                {/* E-commerce Card */}
                <div style={{ 
                  background: 'oklch(0.1 0.05 260)', 
                  borderRadius: '32px', 
                  padding: '4rem',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  color: 'white',
                  boxShadow: '0 40px 80px -20px oklch(0.1 0.05 260 / 0.3)'
                }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'oklch(0.6 0.18 260 / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Globe size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>E-commerce Pro</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>Tu tienda online sin límites. Gestión de inventario, múltiples pasarelas de pago y panel administrativo intuitivo.</p>
                  </div>
                  <ul style={{ ...listStyle, marginBottom: '1rem' }}>
                    <li style={{ ...listItemStyle, color: 'white' }}><Check size={16} color="var(--primary)" /> Pagos con Stripe/PayPal/Niubiz</li>
                    <li style={{ ...listItemStyle, color: 'white' }}><Check size={16} color="var(--primary)" /> Gestión de Carrito Avanzada</li>
                    <li style={{ ...listItemStyle, color: 'white' }}><Check size={16} color="var(--primary)" /> Hosting E-commerce Incluido</li>
                  </ul>
                  <button 
                    onClick={() => openCheckout("E-commerce Pro", 899.00)}
                    style={{ ...btnStyle, background: 'var(--primary)', color: 'white', border: 'none', padding: '1.2rem' }}>
                    Empezar a Vender <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        itemName={selectedItem.name}
        itemPrice={selectedItem.price}
        currency={currency}
      />
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  padding: '2.5rem',
  borderRadius: '24px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease'
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '0 0 2.5rem 0',
  flex: 1
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '0.8rem',
  fontSize: '0.95rem'
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid var(--card-border)',
  background: 'transparent',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease'
};
