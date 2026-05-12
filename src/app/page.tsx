"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, Search, Server, Shield, Globe,
  Zap, Monitor, Code2, Package, PlusCircle, Twitter, Linkedin, Instagram, Facebook
} from "lucide-react";
import { searchDomain, DomainAvailability } from "@/lib/domains";
import CheckoutModal from "@/components/CheckoutModal";
import { calculateFinalPrice, formatPrice, Currency } from "@/lib/pricing";
import { fetchOdiseaPlans, HostingPlan } from "@/lib/plans";
import { useQuery } from "@tanstack/react-query";

type ServiceTab = "shared" | "reseller" | "web-design" | "web-system" | "addon" | "combo";

const SERVICE_TABS: { id: ServiceTab; label: string; icon: React.ReactNode; tagline: string }[] = [
  { id: "shared",     label: "Hosting Compartido", icon: <Server size={18} />,  tagline: "Para sitios, blogs y tiendas. Ideal para empezar." },
  { id: "reseller",   label: "Reseller WHM",        icon: <Shield size={18} />,  tagline: "Vende hosting con tu propia marca. Panel WHM completo." },
  { id: "web-design", label: "Webs Corporativas",   icon: <Monitor size={18} />, tagline: "Diseño profesional llave en mano. Entrega garantizada." },
  { id: "web-system", label: "Sistemas Web",        icon: <Code2 size={18} />,   tagline: "ERP, CRM, catálogos y sistemas a medida para tu empresa." },
  { id: "addon",      label: "Complementos",       icon: <PlusCircle size={18} />, tagline: "Mejora tu infraestructura con SSL, IPs dedicadas y más." },
  { id: "combo",      label: "Combos Especiales",   icon: <Package size={18} />, tagline: "Dominio + Hosting en un solo paquete con precio reducido." },
];

function PricingSection({
  plans,
  type,
  currency,
  onCheckout,
}: {
  plans: HostingPlan[];
  type: ServiceTab;
  currency: Currency;
  onCheckout: (id: string, name: string, price: number) => void;
}) {
  const filtered = plans.filter((p) => p.type === type);
  const isOneTime = type === "web-design" || type === "web-system" || type === "addon";

  return (
    <div className="pricing-grid">
      {filtered.map((plan) => {
        const isUnlimited = plan.id === 'unlimited';
        const finalPrice = (() => {
          if (currency === 'PEN' && plan.price_pen) {
            return formatPrice(plan.price_pen, 'PEN');
          }
          if (isOneTime) {
            return formatPrice(plan.price, currency);
          }
          const p = calculateFinalPrice(plan.price, currency);
          return formatPrice(p.total, currency);
        })();

        return (
          <div key={plan.id} className={`plan-card ${plan.popular || isUnlimited ? "featured" : ""}`}>
            {(plan.popular || isUnlimited) && (
              <div className="plan-badge">
                {isUnlimited ? "Plan Definitivo" : "Más popular"}
              </div>
            )}
            
            <div className="plan-header">
              <div className="plan-name">{plan.name}</div>
              <p className="plan-desc">{plan.description}</p>
            </div>

            <div className="plan-price-box">
              <div className="plan-price">
                {finalPrice}
                <span className="plan-period">{isOneTime ? "" : " /mes"}</span>
              </div>
              {plan.note && <div className="plan-note">{plan.note}</div>}
            </div>

            <div className="plan-divider" />

            <div className="plan-features-header">¿Qué incluye este plan?</div>
            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i} className="plan-feature">
                  <div className="feature-icon-check"><Check size={14} strokeWidth={3} /></div>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="plan-footer">
              <button
                className={`plan-cta ${plan.popular || isUnlimited ? "primary" : "secondary"}`}
                onClick={() => onCheckout(plan.id, plan.name, plan.price)}
              >
                {isOneTime ? "Solicitar Propuesta" : `Contratar ${plan.name}`}
              </button>
              {!isOneTime && (
                <div className="plan-guarantee">Garantía de reembolso de 30 días</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<ServiceTab>("shared");
  const [searchQuery, setSearchQuery] = useState("");
  const [domainMode, setDomainMode] = useState<"register" | "transfer">("register");
  const [results, setResults] = useState<DomainAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ id: "", name: "", price: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchOdiseaPlans,
  });

  const openCheckout = (id: string, name: string, basePrice: number) => {
    setSelectedItem({ id, name, price: basePrice });
    setIsCheckoutOpen(true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await searchDomain(searchQuery, currency);
      setResults(data);
    } catch (err) {
      console.error("Domain search error", err);
    } finally {
      setLoading(false);
    }
  };

  const currentTab = SERVICE_TABS.find((t) => t.id === activeTab)!;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main>
      <div className="site-grid" />
      <div className="site-glow" />

      {/* ── Nav ── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => window.scrollTo(0, 0)} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Odisea Cloud" />
            ODISEA<span>.CLOUD</span>
          </div>
          
          <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>Servicios</a>
            <a href="#domains" onClick={() => setIsMenuOpen(false)}>Dominios</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Planes</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Soporte</a>
            <div className="mobile-only-nav">
              <a href="/login" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Área de Clientes</a>
            </div>
          </div>

          <div className="nav-right">
            <div className="currency-toggle">
              <button className={`currency-btn ${currency === "USD" ? "active" : ""}`} onClick={() => setCurrency("USD")}>USD</button>
              <button className={`currency-btn ${currency === "PEN" ? "active" : ""}`} onClick={() => setCurrency("PEN")}>PEN</button>
            </div>
            <div className="desktop-only-nav">
              <a href="/login" className="btn-ghost">Área de Clientes</a>
            </div>
            <a href="#pricing" className="btn-primary desktop-only-nav">Ver Planes <ArrowRight size={14} /></a>
            
            {/* Burger Button */}
            <button className="burger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="burger-line" />
              <div className="burger-line" />
              <div className="burger-line" />
            </button>
          </div>
        </div>
      </nav>

      <div className="page-content">

        {/* ── Hero ── */}
        <section className="hero" id="home">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-eyebrow">
              <Zap size={12} /> Agencia digital y proveedor de hosting en Latinoamérica
            </div>
            <h1>
              Del dominio al<br /><em>sistema completo</em>
            </h1>
            <p className="hero-lead">
              Hosting profesional, desarrollo web corporativo y sistemas a medida.
              Un solo proveedor para toda tu infraestructura digital.
            </p>
            <div className="hero-actions">
              <a href="#pricing" className="btn-primary">Ver todos los servicios <ArrowRight size={16} /></a>
              <a href="#domains" className="btn-ghost">Buscar Dominio</a>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-dot" />
              Hosting, desarrollo web y sistemas: más de 5,000 proyectos entregados desde 2018.
            </div>
          </motion.div>
        </section>

        {/* ── Services Overview (4 cards) ── */}
        <section id="services" style={{ borderTop: "1px solid var(--border)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", marginBottom: "0.5rem" }}>Nuestros servicios</h2>
              <p style={{ color: "var(--text-2)", fontSize: "1.05rem" }}>Seis categorías estratégicas. Cada una con sus planes y precios claros.</p>
            </div>

            <div className="services-overview-grid">
              {SERVICE_TABS.map((tab) => (
                <a
                  key={tab.id}
                  href="#pricing"
                  className="service-card"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="service-card-icon">{tab.icon}</div>
                  <h3>{tab.label}</h3>
                  <p>{tab.tagline}</p>
                  <span className="service-card-link">Ver planes <ArrowRight size={14} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Domain Search ── */}
        <section className="domain-widget" id="domains" style={{ borderTop: "1px solid var(--border)" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", marginBottom: "0.5rem" }}>Registrar o Transferir Dominio</h2>
            <p style={{ color: "var(--text-2)", fontSize: "1.05rem" }}>Todos los planes de hosting incluyen un dominio gratis el primer año.</p>
          </div>

          <div className="domain-tabs">
            <button className={`domain-tab ${domainMode === "register" ? "active" : ""}`} onClick={() => { setDomainMode("register"); setResults([]); setSearchQuery(""); }}>
              Registrar Dominio
            </button>
            <button className={`domain-tab ${domainMode === "transfer" ? "active" : ""}`} onClick={() => { setDomainMode("transfer"); setResults([]); setSearchQuery(""); }}>
              Transferir Dominio
            </button>
          </div>

          <form onSubmit={handleSearch}>
            <div className="domain-search-box">
              <div className="domain-search-icon"><Search size={20} /></div>
              <input
                type="text"
                className="domain-search-input"
                placeholder={domainMode === "register" ? "Escribe el nombre que deseas registrar..." : "Ingresa tu dominio actual para transferirlo..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="domain-search-btn" disabled={loading}>
                {loading ? "Verificando..." : domainMode === "register" ? "Verificar Disponibilidad" : "Iniciar Transferencia"}
              </button>
            </div>
          </form>

          {domainMode === "transfer" && (
            <div className="domain-transfer-note">
              <Shield size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />
              <span>Para transferir necesitas el <strong>código EPP/Auth</strong> de tu registrador actual. La transferencia incluye 1 año adicional de registro sin costo extra.</span>
            </div>
          )}

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div className="domain-results" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {results.map((res, i) => (
                  <div className="domain-result-row" key={i}>
                    <div className="domain-result-left">
                      <span className="domain-result-name">{res.domain}</span>
                      {domainMode === "register"
                        ? <span className={`domain-badge ${res.available ? "available" : "taken"}`}>{res.available ? "Disponible" : "No Disponible"}</span>
                        : <span className="domain-badge transfer">Transferible</span>
                      }
                    </div>
                    {(res.available || domainMode === "transfer") && (
                      <div className="domain-result-right">
                        <div>
                          <div className="domain-price">{res.priceUser}<span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 400 }}>/año</span></div>
                          {domainMode === "transfer" && <div className="domain-price-sub">incl. 1 año de renovación</div>}
                        </div>
                        <button
                          className={`domain-cta ${domainMode === "transfer" ? "transfer-cta" : ""}`}
                          onClick={() => openCheckout('domain-purchase', `${domainMode === "transfer" ? "Transferencia: " : ""}${res.domain}`, res.priceUSD)}
                        >
                          {domainMode === "register" ? "Registrar" : "Transferir"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Pricing by Service ── */}
        <section className="pricing" id="pricing" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="pricing-header">
            <h2>Planes y precios</h2>
            <p>Elige la categoría. Sin letra chica ni costos ocultos.</p>
          </div>

          {/* Service Tabs */}
          <div className="service-tabs">
            {SERVICE_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`service-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Description */}
          <div className="service-tab-desc">
            <p>{currentTab.tagline}</p>
            {(activeTab === "web-design" || activeTab === "web-system") && (
              <span className="service-tab-note">Los precios son referenciales. El costo final se define tras la reunión de requerimientos.</span>
            )}
          </div>

          {/* Plans for selected tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <PricingSection
                plans={plans}
                type={activeTab}
                currency={currency}
                onCheckout={openCheckout}
              />
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── Footer ── */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-brand">
                  <img src="/logo.png" alt="Odisea Cloud" />
                  ODISEA<span>.CLOUD</span>
                </div>
                <p className="footer-desc">
                  Hosting, desarrollo web y sistemas. Todo en un solo proveedor para tu negocio digital en Latinoamérica.
                </p>
                <div className="footer-socials">
                  <a href="#" className="footer-social"><Twitter size={16} /></a>
                  <a href="#" className="footer-social"><Linkedin size={16} /></a>
                  <a href="#" className="footer-social"><Instagram size={16} /></a>
                  <a href="#" className="footer-social"><Facebook size={16} /></a>
                </div>
                <div style={{ marginTop: '3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <Shield size={12} color="var(--accent)" />
                    <h5 style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>Pagos 100% Seguros</h5>
                  </div>
                  <div className="payment-methods-grid">
                    <div className="payment-method-item" style={{ background: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                      <img src="/visa.svg" alt="Visa" />
                    </div>
                    <div className="payment-method-item">
                      <img src="/mastercard.svg" alt="Mastercard" />
                    </div>
                    <div className="payment-method-item">
                      <img src="/yape.png" alt="Yape" style={{ borderRadius: '6px' }} />
                    </div>
                    <div className="payment-method-item">
                      <img src="/plin.png" alt="Plin" style={{ borderRadius: '6px' }} />
                    </div>
                    <div className="payment-method-item transfer-method">
                      <span>TRANSF. BANCARIA</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-col">
                <h5>Hosting</h5>
                <ul>
                  <li><a href="#">Hosting Compartido</a></li>
                  <li><a href="#">Reseller WHM</a></li>
                  <li><a href="#">Registro de Dominios</a></li>
                  <li><a href="#">Certificados SSL</a></li>
                  <li><a href="#pricing" onClick={() => setActiveTab('addon')}>Complementos</a></li>
                  <li><a href="#pricing" onClick={() => setActiveTab('combo')}>Combos Especiales</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Desarrollo</h5>
                <ul>
                  <li><a href="#">Webs Corporativas</a></li>
                  <li><a href="#">E-commerce</a></li>
                  <li><a href="#">Sistemas de Gestión</a></li>
                  <li><a href="#">CRM y ERP</a></li>
                  <li><a href="#">Integraciones API</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Soporte</h5>
                <ul>
                  <li><a href="#">Base de Conocimiento</a></li>
                  <li><a href="#">Estado de Red</a></li>
                  <li><a href="#">Tickets</a></li>
                  <li><a href="/login">Área de Clientes</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 Odisea Cloud. Todos los derechos reservados.</span>
              <div className="footer-bottom-links">
                <a href="#">Términos de Servicio</a>
                <a href="#">Política de Privacidad</a>
                <a href="#">SLA</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        planId={selectedItem.id}
        itemName={selectedItem.name}
        itemPrice={selectedItem.price}
        currency={currency}
      />
    </main>
  );
}


