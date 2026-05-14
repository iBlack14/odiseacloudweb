"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, Search, Server, Shield, Globe,
  Zap, Monitor, Code2, Package, PlusCircle, Twitter, Linkedin, Instagram, Facebook,
  Star, Users, Clock, ChevronRight, ChevronLeft, Mail, MessageSquare
} from "lucide-react";
import { searchDomain, DomainAvailability } from "@/lib/domains";
import CheckoutModal from "@/components/CheckoutModal";
import { calculateFinalPrice, formatPrice, Currency, USD_TO_PEN_RATE } from "@/lib/pricing";
import { fetchOdiseaPlans, HostingPlan } from "@/lib/plans";
import { useQuery } from "@tanstack/react-query";

const POPULAR_TLDS = [
  { tld: ".com",  price: 8.99 },
  { tld: ".pe",   price: 29.00 },
  { tld: ".net",  price: 10.99 },
  { tld: ".org",  price: 9.99 },
  { tld: ".store",price: 4.99 },
  { tld: ".io",   price: 39.99 },
];

const TRUST_STATS = [
  { icon: <Users size={18} />, value: "5,000+", label: "Proyectos entregados" },
  { icon: <Star  size={18} />, value: "4.9/5",  label: "Calificación promedio" },
  { icon: <Clock size={18} />, value: "99.9%",  label: "Uptime garantizado" },
  { icon: <Shield size={18}/>, value: "SSL",    label: "Gratis en todos los planes" },
];

type ServiceTab = "shared" | "reseller" | "web-design" | "web-system" | "addon" | "combo";

const SERVICE_TABS: { id: ServiceTab; label: string; icon: React.ReactNode; tagline: string; illustration?: React.ReactNode }[] = [
  { id: "shared",     label: "Hosting Compartido", icon: <Server size={18} />,  tagline: "Para sitios, blogs y tiendas. Ideal para empezar.",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradShared" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0fdfa" />
            <stop offset="100%" stopColor="#ccfbf1" />
          </linearGradient>
          <pattern id="gridShared" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#14b8a6" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradShared)" />
        <rect width="100%" height="100%" fill="url(#gridShared)" />
        <g transform="translate(160, 40)">
          <rect x="0" y="0" width="80" height="20" rx="4" fill="white" stroke="#14b8a6" strokeWidth="2" />
          <circle cx="10" cy="10" r="3" fill="#14b8a6" />
          <line x1="25" y1="10" x2="40" y2="10" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          
          <rect x="0" y="30" width="80" height="20" rx="4" fill="white" stroke="#14b8a6" strokeWidth="2" />
          <circle cx="10" cy="40" r="3" fill="#14b8a6" />
          <line x1="25" y1="40" x2="50" y2="40" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

          <rect x="0" y="60" width="80" height="20" rx="4" fill="white" stroke="#14b8a6" strokeWidth="2" />
          <circle cx="10" cy="70" r="3" fill="#14b8a6" opacity="0.3"/>
          <line x1="25" y1="70" x2="35" y2="70" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </g>
      </svg>
    )
  },
  { id: "reseller",   label: "Reseller WHM",        icon: <Shield size={18} />,  tagline: "Vende hosting con tu propia marca. Panel WHM completo.",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradResell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>
          <pattern id="gridResell" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 10 20 M 0 10 L 20 10" stroke="#e11d48" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradResell)" />
        <rect width="100%" height="100%" fill="url(#gridResell)" />
        <g transform="translate(140, 30)">
          <path d="M 60 10 L 60 90 M 20 50 L 60 50 M 100 50 L 60 50" stroke="#e11d48" strokeWidth="2" strokeDasharray="4 2" opacity="0.4" />
          <rect x="40" y="0" width="40" height="20" rx="4" fill="white" stroke="#e11d48" strokeWidth="2" />
          <circle cx="50" cy="10" r="2" fill="#e11d48" />
          <rect x="0" y="40" width="40" height="20" rx="4" fill="white" stroke="#e11d48" strokeWidth="2" />
          <circle cx="10" cy="50" r="2" fill="#e11d48" />
          <rect x="80" y="40" width="40" height="20" rx="4" fill="white" stroke="#e11d48" strokeWidth="2" />
          <circle cx="90" cy="50" r="2" fill="#e11d48" />
          <rect x="40" y="80" width="40" height="20" rx="4" fill="white" stroke="#e11d48" strokeWidth="2" />
          <circle cx="50" cy="90" r="2" fill="#e11d48" />
        </g>
      </svg>
    )
  },
  { id: "web-design", label: "Webs Corporativas",   icon: <Monitor size={18} />, tagline: "Diseño profesional llave en mano. Entrega garantizada.", 
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradWeb" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f7ff" />
            <stop offset="100%" stopColor="#e0efff" />
          </linearGradient>
          <pattern id="gridWeb" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00A3FF" strokeWidth="0.5" strokeOpacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradWeb)" />
        <rect width="100%" height="100%" fill="url(#gridWeb)" />
        <g transform="translate(150, 40)">
          <rect x="0" y="0" width="100" height="70" rx="4" fill="white" stroke="#00A3FF" strokeWidth="2" />
          <circle cx="10" cy="10" r="3" fill="#00A3FF" />
          <circle cx="20" cy="10" r="3" fill="#00A3FF" opacity="0.5" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="#00A3FF" strokeWidth="1" opacity="0.3" />
          <rect x="10" y="30" width="40" height="4" rx="2" fill="#00A3FF" opacity="0.3" />
          <rect x="10" y="40" width="60" height="4" rx="2" fill="#00A3FF" opacity="0.2" />
          <rect x="10" y="50" width="80" height="4" rx="2" fill="#00A3FF" opacity="0.1" />
        </g>
      </svg>
    ) 
  },
  { id: "web-system", label: "Sistemas Web",        icon: <Code2 size={18} />,   tagline: "ERP, CRM, catálogos y sistemas a medida para tu empresa.", 
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradSys" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdf8ff" />
            <stop offset="100%" stopColor="#f3e8ff" />
          </linearGradient>
          <pattern id="gridSys" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#9333ea" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradSys)" />
        <rect width="100%" height="100%" fill="url(#gridSys)" />
        <g transform="translate(140, 30)">
          <rect x="0" y="10" width="30" height="30" rx="6" fill="white" stroke="#9333ea" strokeWidth="2" />
          <rect x="45" y="0" width="30" height="30" rx="6" fill="white" stroke="#9333ea" strokeWidth="2" />
          <rect x="90" y="10" width="30" height="30" rx="6" fill="white" stroke="#9333ea" strokeWidth="2" />
          
          <rect x="20" y="60" width="80" height="30" rx="6" fill="#9333ea" opacity="0.1" stroke="#9333ea" strokeWidth="2" strokeDasharray="4 2" />
          
          <path d="M 15 40 L 40 60 M 60 30 L 60 60 M 105 40 L 80 60" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </g>
      </svg>
    )
  },
  { id: "addon",      label: "Complementos",       icon: <PlusCircle size={18} />, tagline: "Mejora tu infraestructura con SSL, IPs dedicadas y más.",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradAddon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <pattern id="gridAddon" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="#d97706" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradAddon)" />
        <rect width="100%" height="100%" fill="url(#gridAddon)" />
        <g transform="translate(150, 40)">
          <rect x="10" y="10" width="35" height="35" rx="6" fill="white" stroke="#d97706" strokeWidth="2" />
          <rect x="55" y="10" width="35" height="35" rx="6" fill="#d97706" opacity="0.1" stroke="#d97706" strokeWidth="2" strokeDasharray="4 2" />
          <rect x="10" y="55" width="35" height="35" rx="6" fill="white" stroke="#d97706" strokeWidth="2" />
          <rect x="55" y="55" width="35" height="35" rx="6" fill="white" stroke="#d97706" strokeWidth="2" />
          <circle cx="27.5" cy="27.5" r="4" fill="#d97706" />
          <path d="M 72.5 20 L 72.5 35 M 65 27.5 L 80 27.5" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
  { id: "combo",      label: "Combos Especiales",   icon: <Package size={18} />, tagline: "Dominio + Hosting en un solo paquete con precio reducido.",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradCombo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4f4f5" />
            <stop offset="100%" stopColor="#e4e4e7" />
          </linearGradient>
          <pattern id="gridCombo" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 20" stroke="#52525b" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradCombo)" />
        <rect width="100%" height="100%" fill="url(#gridCombo)" />
        <g transform="translate(150, 40)">
          <circle cx="25" cy="40" r="20" fill="white" stroke="#52525b" strokeWidth="2" />
          <ellipse cx="25" cy="40" rx="8" ry="20" fill="none" stroke="#52525b" strokeWidth="1" opacity="0.5" />
          <line x1="5" y1="40" x2="45" y2="40" stroke="#52525b" strokeWidth="1" opacity="0.5" />
          
          <rect x="65" y="25" width="30" height="30" rx="4" fill="white" stroke="#52525b" strokeWidth="2" />
          <circle cx="80" cy="40" r="4" fill="#52525b" />
          
          <path d="M 45 40 L 65 40" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 2" />
          <circle cx="55" cy="40" r="8" fill="white" stroke="#52525b" strokeWidth="2" />
          <path d="M 52 40 L 58 40 M 55 37 L 55 43" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    )
  },
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
  onCheckout: (id: string, name: string, price: number, type: string) => void;
}) {
  const filtered = plans.filter((p) => p.type === type);
  const isOneTime = type === "web-design" || type === "web-system" || type === "addon";
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (filtered.length <= 1) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Aproximadamente el ancho de una tarjeta + gap
          scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth > 768 ? 350 : 280, behavior: 'smooth' });
        }
      }
    }, 4500); // 4.5s auto-scroll
    return () => clearInterval(interval);
  }, [filtered.length, type]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -350, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 350, behavior: 'smooth' });

  return (
    <div className="pricing-grid-container" style={{ position: "relative" }}>
      {filtered.length > 1 && (
        <>
          <button className="carousel-nav left" onClick={scrollLeft} aria-label="Anterior">
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-nav right" onClick={scrollRight} aria-label="Siguiente">
            <ChevronRight size={24} />
          </button>
        </>
      )}
      <div className="pricing-grid" ref={scrollRef}>
        {filtered.map((plan) => {
          const isUnlimited = plan.id === 'unlimited';
          
          // Logic for Display Price
          const displayPrice = (() => {
            if (currency === 'PEN') {
              const penValue = plan.price_pen || calculateFinalPrice(plan.price, 'PEN').total;
              return formatPrice(penValue, 'PEN');
            }
            // Default USD
            return formatPrice(plan.price, 'USD');
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
                  {displayPrice}
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
                  onClick={() => {
                    const checkoutPrice =
                      currency === 'PEN'
                        ? (plan.price_pen || calculateFinalPrice(plan.price, 'PEN').total)
                        : plan.price;
                    onCheckout(plan.id, plan.name, checkoutPrice, plan.type);
                  }}
                >
                  {isOneTime ? "Solicitar Propuesta" : (plan.name.length > 15 ? "Contratar Plan" : `Contratar ${plan.name}`)}
                </button>
                {!isOneTime && (
                  <div className="plan-guarantee">Garantía de reembolso de 30 días</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
  const [selectedItem, setSelectedItem] = useState({ id: "", name: "", price: 0, domain: "", type: "" });
  
  const [formData, setFormData] = useState({ name: "", email: "", subject: "Cotización de Hosting", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setFormStatus("sent");
    setFormData({ name: "", email: "", subject: "Cotización de Hosting", message: "" });
    setTimeout(() => setFormStatus("idle"), 5000);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchOdiseaPlans,
  });

  const openCheckout = (id: string, name: string, basePrice: number, type: string = "shared") => {
    setSelectedItem({ id, name, price: basePrice, domain: searchQuery, type });
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
              <a href="/login" className="btn-ghost" style={{ border: 'none' }}>Acceder</a>
            </div>
            <a href="#pricing" className="btn-primary desktop-only-nav" style={{ padding: '0.6rem 1.5rem', borderRadius: '100px' }}>Empezar <ArrowRight size={14} /></a>
            
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

        {/* ══════════════════════════════════════════
            HERO — Domain search as centrepiece
        ══════════════════════════════════════════ */}
        <section className="domain-hero" id="home" style={{ background: "radial-gradient(circle at top, oklch(0.68 0.18 245 / 0.03) 0%, transparent 70%)" }}>
          {/* Subtle background glow */}
          <div className="site-glow" style={{ opacity: 0.4 }}></div>

          <motion.div
            className="domain-hero-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", zIndex: 1 }}
          >
            {/* Eyebrow */}
            <div className="hero-eyebrow" style={{ background: "white", border: "1px solid var(--border)", color: "var(--accent)", padding: "8px 20px", borderRadius: "100px", boxShadow: "var(--shadow-sm)" }}>
              <Zap size={12} fill="currentColor" /> <span style={{ letterSpacing: "0.05em", fontWeight: 700 }}>INFRAESTRUCTURA DE PRÓXIMA GENERACIÓN</span>
            </div>

            {/* Headline */}
            <h1 className="domain-hero-h1" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", marginBottom: "1.5rem", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
              Tu proyecto merece<br />
              <span style={{ 
                background: "linear-gradient(135deg, var(--text-1) 20%, var(--accent) 100%)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
                fontWeight: 900
              }}>
                el mejor espacio.
              </span>
            </h1>
            
            <p className="domain-hero-sub" style={{ fontSize: "1.15rem", maxWidth: "600px", color: "var(--text-2)", lineHeight: 1.6, margin: "0 auto 3rem" }}>
              Hosting de alto rendimiento, dominios globales y soluciones tecnológicas diseñadas para escalar tu visión digital.
            </p>

            {/* Optional Hero Image for realism */}
            <div style={{ position: "relative", width: "100%", zIndex: 0 }}>
              <div style={{ position: "absolute", right: "-30%", top: "-10%", width: "600px", zIndex: -1, opacity: 0.8, filter: "blur(2px)" }}>
                <img src="/hero-cloud.png" alt="Cloud Infrastructure" style={{ width: "100%", maskImage: "radial-gradient(black, transparent 80%)" }} />
              </div>
            </div>

            {/* Search widget */}
            <div className="dh-search-card" id="domains" style={{ 
              marginTop: "0", 
              background: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 30px 60px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.4)",
              borderRadius: "32px"
            }}>
              {/* Subtle decorative pattern */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.02, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>

              <div className="dh-tabs">
                <button
                  className={`dh-tab ${domainMode === "register" ? "active" : ""}`}
                  onClick={() => { setDomainMode("register"); setResults([]); setSearchQuery(""); }}
                >
                  <Globe size={14} /> Registrar
                </button>
                <button
                  className={`dh-tab ${domainMode === "transfer" ? "active" : ""}`}
                  onClick={() => { setDomainMode("transfer"); setResults([]); setSearchQuery(""); }}
                >
                  <ArrowRight size={14} /> Transferir
                </button>
              </div>

              <form onSubmit={handleSearch} className="dh-form">
                <div className="dh-search-box">
                  <Search size={20} className="dh-input-icon" />
                  <input
                    id="domain-search-input"
                    type="text"
                    className="dh-input"
                    placeholder={
                      domainMode === "register"
                        ? "Escribe el dominio que deseas registrar…"
                        : "Ingresa tu dominio actual para transferirlo…"
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                  />
                  <button type="submit" className="dh-btn" disabled={loading}>
                    {loading ? (
                      <span className="dh-spinner" />
                    ) : (
                      domainMode === "register" ? "Verificar" : "Transferir"
                    )}
                  </button>
                </div>
              </form>

              {domainMode === "transfer" && (
                <div className="dh-transfer-note">
                  <Shield size={14} />
                  <span>Necesitas el <strong>código EPP/Auth</strong> de tu registrador actual. Incluye +1 año de renovación sin costo.</span>
                </div>
              )}

              {/* Results */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    className="domain-results"
                    style={{ margin: "1rem 0 0", borderRadius: "10px" }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {results.map((res, i) => (
                      <div className="domain-result-row" key={i}>
                        <div className="domain-result-left">
                          <span className="domain-result-name">{res.domain}</span>
                          {domainMode === "register"
                            ? <span className={`domain-badge ${res.available ? "available" : "taken"}`}>{res.available ? "Disponible" : "No Disponible"}</span>
                            : <span className={`domain-badge ${!res.available ? "transfer" : "taken"}`}>{!res.available ? "Transferible" : "No registrado"}</span>
                          }
                        </div>
                        {((domainMode === "register" && res.available) || (domainMode === "transfer" && !res.available)) && (
                          <div className="domain-result-right">
                            <div>
                              <div className="domain-price">{res.priceUser}<span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 400 }}>/año</span></div>
                              {domainMode === "transfer" && <div className="domain-price-sub">incl. 1 año de renovación</div>}
                            </div>
                            <button
                              className={`domain-cta ${domainMode === "transfer" ? "transfer-cta" : ""}`}
                              onClick={() => openCheckout("domain-purchase", `${domainMode === "transfer" ? "Transferencia: " : ""}${res.domain}`, res.priceTotal)}
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

              {/* TLD Price chips */}
              <div className="dh-tld-row">
                {POPULAR_TLDS.map(({ tld, price }) => (
                  <button
                    key={tld}
                    className="dh-tld-chip"
                    onClick={() => { setSearchQuery(tld); setDomainMode("register"); }}
                  >
                    <span className="dh-tld-ext">{tld}</span>
                    <span className="dh-tld-price">{formatPrice(currency === 'PEN' ? (price * USD_TO_PEN_RATE) : price, currency)}<small>/año</small></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust stats */}
            <div className="dh-stats" style={{ border: "none", padding: "4rem 0 2rem" }}>
              <div className="dh-stat">
                <div className="dh-stat-icon"><Shield size={18} /></div>
                <div className="dh-stat-value">5,000+</div>
                <div className="dh-stat-label">Proyectos Activos</div>
              </div>
              <div className="dh-stat">
                <div className="dh-stat-icon"><Star size={18} /></div>
                <div className="dh-stat-value">4.9/5</div>
                <div className="dh-stat-label">Calificación promedio</div>
              </div>
              <div className="dh-stat">
                <div className="dh-stat-icon"><Clock size={18} /></div>
                <div className="dh-stat-value">99.9%</div>
                <div className="dh-stat-label">Uptime garantizado</div>
              </div>
              <div className="dh-stat">
                <div className="dh-stat-icon"><Zap size={18} /></div>
                <div className="dh-stat-value">SSL</div>
                <div className="dh-stat-label">Gratis incluido</div>
              </div>
            </div>

            <div className="dh-secondary-ctas" style={{ marginTop: "1rem" }}>
              <a href="#pricing">Ver planes de hosting <ChevronRight size={14} /></a>
              <span className="dh-cta-divider"></span>
              <a href="#domains">Desarrollo web <ChevronRight size={14} /></a>
              <span className="dh-cta-divider"></span>
              <a href="/login">Área de clientes <ChevronRight size={14} /></a>
            </div>
          </motion.div>
        </section>

        {/* ── Services Overview ── */}
        <section id="services" style={{ borderTop: "1px solid var(--border)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", marginBottom: "0.5rem" }}>Nuestros servicios</h2>
              <p style={{ color: "var(--text-2)", fontSize: "1.05rem" }}>Seis categorías estratégicas. Cada una con sus planes y precios claros.</p>
            </div>
            <div className="services-overview-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", background: "transparent", border: "none" }}>
              {SERVICE_TABS.map((tab) => (
                <a key={tab.id} href="#pricing" className="service-card" onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }} style={{ 
                  border: "1px solid var(--border)", 
                  borderRadius: "20px", 
                  overflow: "hidden", 
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  {tab.illustration && (
                    <div className="svc-img-wrapper" style={{ width: "100%", height: "160px", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
                      {tab.illustration}
                    </div>
                  )}
                  <div style={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{tab.label}</h3>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-2)", lineHeight: 1.6, flex: 1 }}>{tab.tagline}</p>
                    <span className="service-card-link" style={{ marginTop: "1.5rem" }}>Ver planes <ArrowRight size={14} /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            .svc-img-wrapper > svg { transition: transform 0.4s ease; }
            .service-card:hover .svc-img-wrapper > svg { transform: scale(1.05); }
          `}} />
        </section>


        {/* ── Infrastructure & Control Panel ── */}
        <section id="infrastructure" style={{ padding: "8rem 2rem", background: "var(--bg-raised)", position: "relative", overflow: "hidden" }}>
          {/* Background decoration */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", background: "radial-gradient(circle at center, oklch(0.68 0.18 245 / 0.03) 0%, transparent 70%)", pointerEvents: "none" }} />
          
          <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", marginBottom: "5rem" }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="hero-eyebrow" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
                  <Shield size={12} fill="currentColor" /> <span style={{ letterSpacing: "0.05em", fontWeight: 700 }}>TECNOLOGÍA DE VANGUARDIA</span>
                </div>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1.5rem", lineHeight: 1.1 }}>
                  Infraestructura diseñada para la <span style={{ color: "var(--accent)" }}>máxima potencia.</span>
                </h2>
                <p style={{ color: "var(--text-2)", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: 1.6 }}>
                  No solo vendemos hosting, operamos una red global de servidores NVMe optimizados para ofrecer tiempos de respuesta instantáneos y una disponibilidad del 99.9%.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ padding: "1.5rem", background: "white", borderRadius: "16px", border: "1px solid var(--border)" }}>
                    <div style={{ color: "var(--accent)", marginBottom: "0.75rem" }}><Zap size={24} /></div>
                    <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Baja Latencia</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>Nodos estratégicos en Latam y USA para conexiones ultra rápidas.</p>
                  </div>
                  <div style={{ padding: "1.5rem", background: "white", borderRadius: "16px", border: "1px solid var(--border)" }}>
                    <div style={{ color: "var(--accent)", marginBottom: "0.75rem" }}><Shield size={24} /></div>
                    <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Seguridad Nivel 4</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>Protección DDoS avanzada y redundancia de datos en tiempo real.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="infra-main-image"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ position: "relative" }}
              >
                <div style={{ 
                  borderRadius: "24px", 
                  overflow: "hidden", 
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--border-hi)",
                  aspectRatio: "4/3",
                  background: "#eee"
                }}>
                  <img src="/infra-datacenter.png" alt="Data Center Odisea" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {/* Floating badge */}
                <div style={{ 
                  position: "absolute", 
                  bottom: "-20px", 
                  right: "-20px", 
                  background: "white", 
                  padding: "20px", 
                  borderRadius: "20px", 
                  boxShadow: "var(--shadow-lg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-3)", textTransform: "uppercase" }}>Estado de Red</div>
                    <div style={{ fontSize: "1rem", fontWeight: 900, color: "var(--text-1)" }}>100% Operativo</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid var(--border)", aspectRatio: "16/10", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-raised)" }}>
                  <svg width="100%" height="100%" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ opacity: 0.9 }}>
                    <defs>
                      <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f0f7ff" />
                        <stop offset="100%" stopColor="#e0efff" />
                      </linearGradient>
                      <pattern id="gridPanel" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00A3FF" strokeWidth="0.5" strokeOpacity="0.1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#panelGrad)" />
                    <rect width="100%" height="100%" fill="url(#gridPanel)" />
                    <g transform="translate(20, 20)">
                      <rect x="0" y="0" width="360" height="210" rx="12" fill="white" stroke="#00A3FF" strokeWidth="2" opacity="0.8" />
                      {/* Sidebar */}
                      <rect x="0" y="0" width="80" height="210" rx="12" fill="white" stroke="#00A3FF" strokeWidth="1.5" opacity="0.6" />
                      <circle cx="40" cy="30" r="15" fill="#00A3FF" opacity="0.2" />
                      <rect x="20" y="70" width="40" height="6" rx="3" fill="#00A3FF" opacity="0.3" />
                      <rect x="20" y="90" width="40" height="6" rx="3" fill="#00A3FF" opacity="0.3" />
                      <rect x="20" y="110" width="40" height="6" rx="3" fill="#00A3FF" opacity="0.3" />
                      {/* Header */}
                      <rect x="95" y="15" width="250" height="30" rx="8" fill="white" stroke="#00A3FF" strokeWidth="1.5" opacity="0.5" />
                      <rect x="110" y="27" width="60" height="6" rx="3" fill="#00A3FF" opacity="0.4" />
                      {/* Charts / Content */}
                      <rect x="95" y="60" width="150" height="80" rx="8" fill="white" stroke="#00A3FF" strokeWidth="1.5" opacity="0.5" />
                      <path d="M 110 120 L 140 80 L 170 100 L 200 70 L 230 110" fill="none" stroke="#00A3FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      
                      <rect x="255" y="60" width="90" height="80" rx="8" fill="white" stroke="#00A3FF" strokeWidth="1.5" opacity="0.5" />
                      <circle cx="300" cy="100" r="20" fill="none" stroke="#00A3FF" strokeWidth="6" opacity="0.2" />
                      <circle cx="300" cy="100" r="20" fill="none" stroke="#00A3FF" strokeWidth="6" strokeDasharray="100" strokeDashoffset="40" />

                      <rect x="95" y="155" width="250" height="40" rx="8" fill="white" stroke="#00A3FF" strokeWidth="1.5" opacity="0.5" />
                      <rect x="110" y="172" width="200" height="6" rx="3" fill="#00A3FF" opacity="0.1" />
                      <rect x="110" y="172" width="120" height="6" rx="3" fill="#00A3FF" opacity="0.4" />
                    </g>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Control Panel</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.5 }}>Gestiona cada aspecto de tu hosting, correos y bases de datos desde un panel centralizado y fácil de usar.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid var(--border)", aspectRatio: "16/10" }}>
                  <img src="/infra-network.png" alt="Global Network" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Red Global</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.5 }}>Nuestra arquitectura está distribuida globalmente para asegurar que tu contenido esté siempre cerca de tus clientes.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <div style={{ 
                  borderRadius: "20px", 
                  padding: "2rem", 
                  background: "var(--text-1)", 
                  color: "white", 
                  flex: 1, 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{ position: "absolute", top: "-20%", right: "-20%", width: "60%", height: "60%", background: "var(--accent)", filter: "blur(60px)", opacity: 0.3 }} />
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "white", position: "relative" }}>¿Listo para el siguiente nivel?</h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", marginBottom: "2rem", position: "relative" }}>Únete a los más de 5,000 proyectos que confían en nuestra infraestructura.</p>
                  <a href="#pricing" className="btn-primary" style={{ alignSelf: "flex-start", position: "relative" }}>Comenzar Ahora <ArrowRight size={16} /></a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>


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

          {/* Tab Description moved below plans */}
          <div className="service-tab-desc" style={{ marginTop: "2rem" }}>
            <p>{currentTab.tagline}</p>
            {(activeTab === "web-design" || activeTab === "web-system") && (
              <span className="service-tab-note">Los precios son referenciales. El costo final se define tras la reunión de requerimientos.</span>
            )}
          </div>
        </section>

        {/* ── Contact Form ── */}
        <section id="contact" style={{ padding: "8rem 2rem", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
           <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
             <div style={{ textAlign: "center", marginBottom: "4rem" }}>
               <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>Hablemos de tu proyecto</h2>
               <p style={{ color: "var(--text-2)", fontSize: "1.1rem" }}>¿Tienes dudas o necesitas un presupuesto a medida? Escríbenos.</p>
             </div>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "start" }}>
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="contact-info"
               >
                 <h4 style={{ marginBottom: "2rem", fontSize: "1.25rem" }}>Información de contacto</h4>
                 <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                   <div style={{ display: "flex", gap: "1rem" }}>
                     <div className="service-card-icon" style={{ flexShrink: 0 }}><Mail size={20} /></div>
                     <div>
                       <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Email de Ventas</div>
                       <div style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>ventas@odiseacloud.com</div>
                     </div>
                   </div>
                   <div style={{ display: "flex", gap: "1rem" }}>
                     <div className="service-card-icon" style={{ flexShrink: 0 }}><MessageSquare size={20} /></div>
                     <div>
                       <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>WhatsApp Ventas</div>
                       <div style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>Respuesta inmediata en horario comercial.</div>
                     </div>
                   </div>
                   <div style={{ display: "flex", gap: "1rem" }}>
                     <div className="service-card-icon" style={{ flexShrink: 0 }}><Shield size={20} /></div>
                     <div>
                       <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Soporte Técnico</div>
                       <div style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>soporte@odiseacloud.com</div>
                     </div>
                   </div>
                 </div>

                 <div style={{ marginTop: "3rem", padding: "2rem", background: "var(--accent-dim)", borderRadius: "20px", border: "1px solid var(--accent-border)" }}>
                   <h5 style={{ color: "var(--accent)", marginBottom: "0.5rem" }}>¿Buscas algo específico?</h5>
                   <p style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>Si necesitas una solución enterprise o infraestructura dedicada, menciona los detalles y un especialista te contactará.</p>
                 </div>
               </motion.div>

               <motion.form 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 onSubmit={handleFormSubmit}
                 className="contact-form" 
                 style={{ 
                   background: "white", 
                   padding: "3rem", 
                   borderRadius: "32px", 
                   border: "1px solid var(--border)", 
                   boxShadow: "var(--shadow-lg)",
                   position: "relative",
                   overflow: "hidden"
                 }}
               >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                    <div className="form-group">
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-3)" }}>Nombre o Empresa</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Tu nombre o razón social" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg-raised)", outline: "none", transition: "all 0.2s" }} 
                        onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
                        onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-3)" }}>Correo electrónico</label>
                      <input 
                        required
                        type="email" 
                        placeholder="Correo electrónico" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg-raised)", outline: "none", transition: "all 0.2s" }} 
                        onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
                        onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-3)" }}>¿En qué podemos ayudarte?</label>
                    <select 
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg-raised)", outline: "none", cursor: "pointer" }}
                    >
                      <option>Cotización de Hosting</option>
                      <option>Desarrollo Web / Sistema</option>
                      <option>Soporte Técnico</option>
                      <option>Otro asunto</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-3)" }}>Mensaje</label>
                    <textarea 
                      required
                      placeholder="Cuéntanos brevemente qué necesitas..." 
                      rows={4} 
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg-raised)", outline: "none", resize: "none", transition: "all 0.2s" }} 
                      onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
                      onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                    />
                  </div>
                  
                  <button 
                    disabled={formStatus !== "idle"}
                    className={`btn-primary ${formStatus === "sent" ? "success" : ""}`} 
                    style={{ width: "100%", padding: "1rem", borderRadius: "12px", justifyContent: "center", position: "relative" }}
                  >
                    {formStatus === "idle" && <>Enviar mensaje <ArrowRight size={18} /></>}
                    {formStatus === "sending" && <span className="dh-spinner" />}
                    {formStatus === "sent" && <>¡Mensaje enviado con éxito! <Check size={18} /></>}
                  </button>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-3)", textAlign: "center", marginTop: "1.25rem" }}>
                    Al enviar este formulario, aceptas nuestros términos de privacidad.
                  </p>

                  <AnimatePresence>
                    {formStatus === "sent" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}
                      >
                        <div style={{ width: "64px", height: "64px", background: "var(--success)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                          <Check size={32} strokeWidth={3} />
                        </div>
                        <h3 style={{ marginBottom: "0.5rem" }}>¡Gracias por escribirnos!</h3>
                        <p style={{ color: "var(--text-2)", fontSize: "0.95rem" }}>Hemos recibido tu mensaje. Un especialista se pondrá en contacto contigo a la brevedad.</p>
                        <button 
                          onClick={() => setFormStatus("idle")}
                          style={{ marginTop: "2rem", background: "none", border: "none", color: "var(--accent)", fontWeight: 700, cursor: "pointer" }}
                        >
                          Enviar otro mensaje
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </motion.form>
             </div>
           </div>
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
              <div className="footer-col">
                <h5>Contacto</h5>
                <ul>
                  <li>
                    <a href="mailto:ventas@odiseacloud.com" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Mail size={14} /> ventas@odiseacloud.com
                    </a>
                  </li>
                  <li>
                    <a href="mailto:soporte@odiseacloud.com" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Shield size={14} /> soporte@odiseacloud.com
                    </a>
                  </li>
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
        domain={selectedItem.domain}
        planType={selectedItem.type}
      />
    </main>
  );
}


