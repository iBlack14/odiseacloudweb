"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, Search, Server, Shield, Globe,
  Zap, Monitor, Code2, Package, PlusCircle, Twitter, Linkedin, Instagram, Facebook,
  Star, Users, Clock, ChevronRight, ChevronLeft, Mail, MessageSquare
} from "lucide-react";
import { searchDomain, DomainAvailability } from "@/lib/domains";
import CheckoutModal from "@/components/CheckoutModal";
import { calculateFinalPrice, formatPrice, Currency } from "@/lib/pricing";
import { usdToPen, FALLBACK_USD_TO_PEN, ExchangeRateResult } from "@/lib/exchange-rate";
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
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
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
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
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
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
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
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
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
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
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
      <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
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

function planPenAmount(plan: HostingPlan, penRate: number): number {
  return plan.price_pen ?? usdToPen(plan.price, penRate);
}

function PricingSection({
  plans,
  type,
  currency,
  penRate,
  onCheckout,
}: {
  plans: HostingPlan[];
  type: ServiceTab;
  currency: Currency;
  penRate: number;
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
    <div className="pricing-grid-container">
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
              const penValue = planPenAmount(plan, penRate);
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
                        ? planPenAmount(plan, penRate)
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
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");

    try {
      // Reemplaza 'TU_ID_DE_FORMSPREE' con el ID que obtengas en formspree.io
      const response = await fetch("https://formspree.io/f/mkoyazbo", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: JSON.stringify({
          Nombre: formData.name,
          Email: formData.email,
          Asunto: formData.subject,
          Mensaje: formData.message
        }),
      });

      if (response.ok) {
        setFormStatus("sent");
        setFormData({ name: "", email: "", subject: "Cotización de Hosting", message: "" });
        setTimeout(() => setFormStatus("idle"), 6000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 4000);
      }
    } catch (err) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 4000);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    document.documentElement.style.overflowX = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflowX = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900 && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMenuOpen]);

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchOdiseaPlans,
  });

  const { data: exchangeRate } = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: async (): Promise<ExchangeRateResult> => {
      const response = await fetch("/api/exchange-rate");
      if (!response.ok) throw new Error("Error al obtener tipo de cambio");
      const json = await response.json();
      return {
        rate: json.rate ?? FALLBACK_USD_TO_PEN,
        source: json.source ?? "fallback",
        date: json.date ?? new Date().toISOString().slice(0, 10),
        base: "USD",
        quote: "PEN",
      };
    },
    staleTime: 60 * 60 * 1000,
    retry: 2,
  });

  const penRate = exchangeRate?.rate ?? FALLBACK_USD_TO_PEN;

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

  return (
    <main>
      <div className="site-grid" />
      <div className="site-glow" />

      {/* ── Nav ── */}
      {/* ── Nav ── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}>
        {isMenuOpen && (
          <button
            type="button"
            className="nav-backdrop"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => window.scrollTo(0, 0)} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Odisea Cloud" />
            ODISEA<span>.CLOUD</span>
          </div>

          <div className={`nav-links ${isMenuOpen ? "active" : ""}`} aria-hidden={!isMenuOpen}>
          <div className="mobile-menu-shell">
            <div className="mobile-menu-decor" aria-hidden="true">
              <div className="mobile-menu-orb mobile-menu-orb--1" />
              <div className="mobile-menu-orb mobile-menu-orb--2" />
            </div>

            <div className="mobile-menu-header">
              <span className="mobile-menu-eyebrow">Odisea Cloud</span>
              <p className="mobile-menu-tagline">Hosting, dominios y desarrollo web</p>
            </div>

            <div className="mobile-menu-list">
              {[
                { href: "#services", label: "Servicios", icon: <Server size={18} /> },
                { href: "#domains", label: "Dominios", icon: <Globe size={18} /> },
                { href: "#pricing", label: "Planes", icon: <Package size={18} /> },
                { href: "#contact", label: "Soporte", icon: <MessageSquare size={18} /> },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="mobile-menu-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mobile-menu-item-icon">{item.icon}</span>
                  <span className="mobile-menu-item-label">{item.label}</span>
                  <ChevronRight size={16} className="mobile-menu-item-chevron" />
                </a>
              ))}
            </div>

            <div className="mobile-menu-actions">
              <div className="mobile-menu-currency">
                <span className="mobile-menu-currency-label">Moneda</span>
                <div className="currency-toggle">
                  <button type="button" className={`currency-btn ${currency === "USD" ? "active" : ""}`} onClick={() => setCurrency("USD")}>USD</button>
                  <button type="button" className={`currency-btn ${currency === "PEN" ? "active" : ""}`} onClick={() => setCurrency("PEN")}>PEN</button>
                </div>
                {currency === "PEN" && exchangeRate && (
                  <span className="mobile-menu-fx">1 USD = S/ {penRate.toFixed(2)}</span>
                )}
              </div>
              <a href="#pricing" className="mobile-menu-cta" onClick={() => setIsMenuOpen(false)}>
                Empezar ahora <ArrowRight size={16} />
              </a>
              <a href="/login" className="mobile-menu-login" onClick={() => setIsMenuOpen(false)}>
                Área de Clientes
              </a>
              <div className="mobile-menu-trust">
                <Shield size={13} />
                <span>SSL gratis · Soporte 24/7 · 99.9% uptime</span>
              </div>
            </div>
          </div>
          </div>

          <div className="nav-right">
            <div className="currency-toggle-wrap nav-currency-desktop">
              <div className="currency-toggle">
                <button type="button" className={`currency-btn ${currency === "USD" ? "active" : ""}`} onClick={() => setCurrency("USD")}>USD</button>
                <button type="button" className={`currency-btn ${currency === "PEN" ? "active" : ""}`} onClick={() => setCurrency("PEN")}>PEN</button>
              </div>
              {currency === "PEN" && exchangeRate && (
                <span className="fx-rate-hint" title={`Fuente: ${exchangeRate.source} · ${exchangeRate.date}`}>
                  1 USD = S/ {penRate.toFixed(2)}
                </span>
              )}
            </div>
            <div className="desktop-only-nav">
              <a href="/login" className="btn-ghost" style={{ border: 'none' }}>Acceder</a>
            </div>
            <a href="#pricing" className="btn-primary desktop-only-nav" style={{ padding: '0.6rem 1.5rem', borderRadius: '100px' }}>Empezar <ArrowRight size={14} /></a>

            <button
              className="burger"
              type="button"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
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
        <section className="domain-hero domain-hero-gradient" id="home">
          <div className="domain-hero-bg" aria-hidden="true">
            <div className="hero-cloud-art">
              <img src="/hero-cloud.png" alt="" />
            </div>
            <div className="domain-hero-orb domain-hero-orb--left" />
            <div className="domain-hero-orb domain-hero-orb--right" />
          </div>

          <motion.div
            className="domain-hero-inner domain-hero-inner-layer"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="domain-hero-copy"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-eyebrow domain-hero-eyebrow">
                <Zap size={12} fill="currentColor" />
                <span>Infraestructura de próxima generación</span>
              </div>

              <h1 className="domain-hero-h1">
                Tu proyecto merece
                <span className="gradient-text"> el mejor espacio.</span>
              </h1>

              <p className="domain-hero-sub">
                Hosting de alto rendimiento, dominios globales y soluciones tecnológicas diseñadas para escalar tu visión digital.
              </p>
            </motion.div>

            <motion.div
              className="dh-search-card dh-search-card-glass"
              id="domains"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="dh-search-card-pattern" />

              <div className="dh-tabs">
                <button
                  type="button"
                  className={`dh-tab ${domainMode === "register" ? "active" : ""}`}
                  onClick={() => { setDomainMode("register"); setResults([]); setSearchQuery(""); }}
                >
                  <Globe size={14} /> Registrar
                </button>
                <button
                  type="button"
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
                    className="domain-results domain-results--hero"
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
                    <span className="dh-tld-price">{formatPrice(currency === 'PEN' ? usdToPen(price, penRate) : price, currency)}<small>/año</small></span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="dh-stats dh-stats--polished"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {TRUST_STATS.map((stat) => (
                <div className="dh-stat" key={stat.label}>
                  <div className="dh-stat-icon">{stat.icon}</div>
                  <div className="dh-stat-value">{stat.value}</div>
                  <div className="dh-stat-label">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="dh-secondary-ctas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <a href="#pricing" className="dh-secondary-pill">Ver planes de hosting <ChevronRight size={14} /></a>
              <a href="#services" className="dh-secondary-pill">Desarrollo web <ChevronRight size={14} /></a>
              <a href="/login" className="dh-secondary-pill">Área de clientes <ChevronRight size={14} /></a>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Services Overview ── */}
        <section id="services" className="services-section">
          <div className="services-section-glow" aria-hidden="true" />
          <div className="section-container services-section-inner">
            <motion.div
              className="services-section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="services-eyebrow">
                <Package size={12} />
                <span>Catálogo completo</span>
              </div>
              <h2>Nuestros <span className="gradient-text">servicios</span></h2>
              <p>Seis categorías estratégicas. Cada una con sus planes y precios claros.</p>
            </motion.div>
            <div className="services-cards-grid">
              {SERVICE_TABS.map((tab, index) => (
                <motion.a
                  key={tab.id}
                  href="#pricing"
                  className={`service-card service-card-modern svc-${tab.id}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {tab.illustration && (
                    <div className="svc-img-wrapper">
                      {tab.illustration}
                    </div>
                  )}
                  <div className="service-card-body">
                    <div className="service-card-top">
                      <div className="service-card-icon">{tab.icon}</div>
                      <h3>{tab.label}</h3>
                    </div>
                    <p>{tab.tagline}</p>
                    <span className="service-card-link">
                      Ver planes <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>


        {/* ── Infrastructure & Control Panel ── */}
        <section id="infrastructure" className="infra-section">
          {/* Background decoration */}
          <div className="infra-section-glow" />
          
          <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
            <div className="infra-hero-grid">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="section-head section-head--left" style={{ marginBottom: "1.25rem" }}>
                  <div className="section-eyebrow">
                    <Shield size={12} fill="currentColor" />
                    <span>Tecnología de vanguardia</span>
                  </div>
                  <h2>Infraestructura para la <span className="gradient-text">máxima potencia</span></h2>
                  <p>
                    No solo vendemos hosting, operamos una red global de servidores NVMe optimizados para ofrecer tiempos de respuesta instantáneos y una disponibilidad del 99.9%.
                  </p>
                </div>
                <div className="infra-feature-grid">
                  <div className="infra-feature-card">
                    <div className="icon"><Zap size={24} /></div>
                    <h4>Baja Latencia</h4>
                    <p>Nodos estratégicos en Latam y USA para conexiones ultra rápidas.</p>
                  </div>
                  <div className="infra-feature-card">
                    <div className="icon"><Shield size={24} /></div>
                    <h4>Seguridad Nivel 4</h4>
                    <p>Protección DDoS avanzada y redundancia de datos en tiempo real.</p>
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
                <div className="infra-image-frame">
                  <img src="/infra-datacenter.png" alt="Data Center Odisea" />
                </div>
                {/* Floating badge */}
                <div className="infra-status-badge">
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

            <div className="infra-cards-grid">
              <motion.div
                className="infra-card-stack"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="infra-media-frame">
                  <svg width="100%" height="100%" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.9 }}>
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
                className="infra-card-stack"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="infra-media-frame">
                  <img src="/infra-network.png" alt="Global Network" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Red Global</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.5 }}>Nuestra arquitectura está distribuida globalmente para asegurar que tu contenido esté siempre cerca de tus clientes.</p>
                </div>
              </motion.div>

              <motion.div
                className="infra-card-stack"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="infra-cta-card">
                  <div className="infra-cta-glow" />
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "white", position: "relative" }}>¿Listo para el siguiente nivel?</h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", marginBottom: "2rem", position: "relative" }}>Únete a los más de 5,000 proyectos que confían en nuestra infraestructura.</p>
                  <a href="#pricing" className="btn-primary" style={{ alignSelf: "flex-start", position: "relative" }}>Comenzar Ahora <ArrowRight size={16} /></a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        <section className="pricing-section" id="pricing">
          <div className="pricing-section-glow" aria-hidden="true" />
          <div className="section-container pricing-section-inner">
            <motion.div
              className="section-head"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-eyebrow">
                <Package size={12} />
                <span>Planes y precios</span>
              </div>
              <h2>Elige el plan perfecto para <span className="gradient-text">tu proyecto</span></h2>
              <p>Sin letra chica ni costos ocultos. Cambia de categoría y compara en segundos.</p>
            </motion.div>

            <div className="service-tabs-panel">
              <div className="service-tabs-scroll">
                <div className="service-tabs">
                  {SERVICE_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`service-tab ${activeTab === tab.id ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
              </div>
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
                penRate={penRate}
                onCheckout={openCheckout}
              />
            </motion.div>
          </AnimatePresence>

            <div className="service-tab-desc service-tab-desc-card">
              <p>{currentTab.tagline}</p>
              {(activeTab === "web-design" || activeTab === "web-system") && (
                <span className="service-tab-note">Los precios son referenciales. El costo final se define tras la reunión de requerimientos.</span>
              )}
            </div>
          </div>
        </section>

        {/* ── Contact Form ── */}
        <section id="contact" className="contact-section">
          <div className="contact-section-glow" aria-hidden="true" />
          <div className="section-container contact-section-inner" style={{ maxWidth: "1000px" }}>
            <motion.div
              className="section-head"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <div className="section-eyebrow">
                <MessageSquare size={12} />
                <span>Contacto</span>
              </div>
              <h2>Hablemos de <span className="gradient-text">tu proyecto</span></h2>
              <p>¿Tienes dudas o necesitas un presupuesto a medida? Escríbenos y te respondemos pronto.</p>
            </motion.div>

            <div className="contact-grid">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="contact-info-panel"
              >
                <h4>Información de contacto</h4>
                <div className="contact-channels">
                  <div className="contact-channel">
                    <div className="contact-channel-icon"><Mail size={20} /></div>
                    <div>
                      <div className="contact-channel-title">Email de Ventas</div>
                      <div className="contact-channel-text">ventas@odiseacloud.com</div>
                    </div>
                  </div>
                  <div className="contact-channel">
                    <div className="contact-channel-icon"><MessageSquare size={20} /></div>
                    <div>
                      <div className="contact-channel-title">WhatsApp Ventas</div>
                      <div className="contact-channel-text">Respuesta inmediata en horario comercial.</div>
                    </div>
                  </div>
                  <div className="contact-channel">
                    <div className="contact-channel-icon"><Shield size={20} /></div>
                    <div>
                      <div className="contact-channel-title">Soporte Técnico</div>
                      <div className="contact-channel-text">soporte@odiseacloud.com</div>
                    </div>
                  </div>
                </div>

                <div className="contact-highlight">
                  <h5>¿Buscas algo específico?</h5>
                  <p>Si necesitas una solución enterprise o infraestructura dedicada, menciona los detalles y un especialista te contactará.</p>
                </div>
              </motion.div>

               <motion.form 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 onSubmit={handleFormSubmit}
                 className="contact-form contact-form-card"
               >
                  <div className="contact-form-grid">
                    <div className="form-field">
                      <label>Nombre o Empresa</label>
                      <input
                        required
                        type="text"
                        placeholder="Tu nombre o razón social"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Correo electrónico</label>
                      <input
                        required
                        type="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-field" style={{ marginBottom: "1.5rem" }}>
                    <label>¿En qué podemos ayudarte?</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option>Cotización de Hosting</option>
                      <option>Desarrollo Web / Sistema</option>
                      <option>Soporte Técnico</option>
                      <option>Otro asunto</option>
                    </select>
                  </div>
                  <div className="form-field" style={{ marginBottom: "2rem" }}>
                    <label>Mensaje</label>
                    <textarea
                      required
                      placeholder="Cuéntanos brevemente qué necesitas..."
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    disabled={formStatus !== "idle"}
                    className={`btn-primary ${formStatus === "sent" ? "success" : ""} ${formStatus === "error" ? "error" : ""}`}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "12px",
                      position: "relative",
                      background: formStatus === "error" ? "var(--danger)" : undefined,
                    }}
                  >
                    {formStatus === "idle" && <>Enviar mensaje <ArrowRight size={18} /></>}
                    {formStatus === "sending" && <span className="dh-spinner" />}
                    {formStatus === "sent" && <>¡Mensaje enviado con éxito! <Check size={18} /></>}
                    {formStatus === "error" && <>Error al enviar, intenta de nuevo</>}
                  </button>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-3)", textAlign: "center", marginTop: "1.25rem" }}>
                    Al enviar este formulario, aceptas nuestros{" "}
                    <Link href="/terminos-y-condiciones" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
                      Términos y Condiciones
                    </Link>.
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
            <div className="footer-main">
              <div className="footer-brand-col">
                <div className="footer-brand">
                  <img src="/logo.png" alt="Odisea Cloud" />
                  ODISEA<span>.CLOUD</span>
                </div>
                <p className="footer-desc">
                  Hosting, desarrollo web y sistemas. Todo en un solo proveedor para tu negocio digital en Latinoamérica.
                </p>
                <div className="footer-socials">
                  <a href="#" className="footer-social" aria-label="Twitter"><Twitter size={16} /></a>
                  <a href="#" className="footer-social" aria-label="LinkedIn"><Linkedin size={16} /></a>
                  <a href="#" className="footer-social" aria-label="Instagram"><Instagram size={16} /></a>
                  <a href="#" className="footer-social" aria-label="Facebook"><Facebook size={16} /></a>
                </div>
              </div>

              <nav className="footer-nav" aria-label="Enlaces del sitio">
                <div className="footer-col footer-col--hosting">
                  <h5 className="footer-col-title">Hosting</h5>
                  <ul>
                    <li><a href="#pricing" onClick={() => setActiveTab('shared')}>Hosting Compartido</a></li>
                    <li><a href="#pricing" onClick={() => setActiveTab('reseller')}>Reseller WHM</a></li>
                    <li><a href="#domains">Registro de Dominios</a></li>
                    <li><a href="#pricing" onClick={() => setActiveTab('addon')}>Certificados SSL</a></li>
                    <li><a href="#pricing" onClick={() => setActiveTab('addon')}>Complementos</a></li>
                    <li><a href="#pricing" onClick={() => setActiveTab('combo')}>Combos Especiales</a></li>
                  </ul>
                </div>
                <div className="footer-col footer-col--desarrollo">
                  <h5 className="footer-col-title">Desarrollo</h5>
                  <ul>
                    <li><a href="#pricing" onClick={() => setActiveTab('web-design')}>Webs Corporativas</a></li>
                    <li><a href="#pricing" onClick={() => setActiveTab('web-design')}>E-commerce</a></li>
                    <li><a href="#pricing" onClick={() => setActiveTab('web-system')}>Sistemas de Gestión</a></li>
                    <li><a href="#pricing" onClick={() => setActiveTab('web-system')}>CRM y ERP</a></li>
                    <li><a href="#contact">Integraciones API</a></li>
                  </ul>
                </div>
                <div className="footer-col footer-col--soporte">
                  <h5 className="footer-col-title">Soporte</h5>
                  <ul>
                    <li><a href="#contact">Base de Conocimiento</a></li>
                    <li><a href="#infrastructure">Estado de Red</a></li>
                    <li><a href="#contact">Tickets</a></li>
                    <li><a href="/login">Área de Clientes</a></li>
                  </ul>
                </div>
                <div className="footer-col footer-col--contacto">
                  <h5 className="footer-col-title">Contacto</h5>
                  <ul>
                    <li>
                      <a href="mailto:ventas@odiseacloud.com" className="footer-contact-link">
                        <Mail size={14} />
                        <span>ventas@odiseacloud.com</span>
                      </a>
                    </li>
                    <li>
                      <a href="mailto:soporte@odiseacloud.com" className="footer-contact-link">
                        <Shield size={14} />
                        <span>soporte@odiseacloud.com</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>

            <div className="footer-trust">
              <div className="footer-trust-label">
                <Shield size={14} />
                <span>Pagos 100% seguros</span>
              </div>
              <div className="footer-trust-methods">
                <div className="payment-method-item payment-method-item--card">
                  <img src="/visa.svg" alt="Visa" />
                </div>
                <div className="payment-method-item payment-method-item--card">
                  <img src="/mastercard.svg" alt="Mastercard" />
                </div>
                <div className="payment-method-item">
                  <img src="/yape.png" alt="Yape" />
                </div>
                <div className="payment-method-item">
                  <img src="/plin.png" alt="Plin" />
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <span className="footer-copyright">© 2026 Odisea Cloud. Todos los derechos reservados.</span>
              <div className="footer-bottom-links">
                <Link href="/terminos-y-condiciones">Términos</Link>
                <Link href="/privacidad">Privacidad</Link>
                <Link href="/sla">SLA</Link>
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

