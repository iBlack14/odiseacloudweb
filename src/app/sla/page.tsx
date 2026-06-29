import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Acuerdo de Nivel de Servicio (SLA) | Odisea Cloud",
  description:
    "Compromisos de disponibilidad, tiempos de respuesta y créditos de servicio de Odisea Cloud.",
};

const SECTIONS = [
  { id: "introduccion", title: "1. Introducción" },
  { id: "alcance", title: "2. Alcance del SLA" },
  { id: "uptime", title: "3. Compromiso de disponibilidad" },
  { id: "medicion", title: "4. Medición del uptime" },
  { id: "exclusiones", title: "5. Exclusiones" },
  { id: "soporte", title: "6. Tiempos de respuesta de soporte" },
  { id: "creditos", title: "7. Créditos de servicio" },
  { id: "reporte", title: "8. Cómo reportar una incidencia" },
  { id: "mantenimiento", title: "9. Mantenimiento programado" },
  { id: "limites", title: "10. Límites de responsabilidad" },
  { id: "contacto", title: "11. Contacto" },
] as const;

export default function SlaPage() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="legal-header-inner">
          <Link href="/" className="legal-back">
            <ChevronLeft size={18} />
            <span>Volver al inicio</span>
          </Link>
          <Link href="/" className="legal-brand">
            <img src="/logo.png" alt="Odisea Cloud" />
            ODISEA<span>.CLOUD</span>
          </Link>
        </div>
      </header>

      <main className="legal-main">
        <article className="legal-doc">
          <div className="legal-doc-hero">
            <div className="legal-doc-eyebrow">
              <Activity size={14} />
              <span>Nivel de servicio</span>
            </div>
            <h1>Acuerdo de Nivel de Servicio (SLA)</h1>
            <p className="legal-doc-intro">
              Este documento describe los compromisos de disponibilidad y soporte que Odisea Cloud
              ofrece según el tipo de plan contratado. Aplica a servicios de hosting y
              infraestructura gestionada por nosotros.
            </p>
            <p className="legal-doc-meta">Última actualización: 28 de junio de 2026</p>
          </div>

          <nav className="legal-toc" aria-label="Índice de contenidos">
            <p className="legal-toc-label">Contenido</p>
            <ol>
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-sections">
            <section id="introduccion" className="legal-section">
              <h2>1. Introducción</h2>
              <p>
                El presente Acuerdo de Nivel de Servicio (&quot;SLA&quot;) complementa los{" "}
                <Link href="/terminos-y-condiciones">Términos y Condiciones</Link> de Odisea Cloud.
                Su objetivo es establecer de forma transparente los niveles de disponibilidad de
                la infraestructura y los tiempos de atención de soporte.
              </p>
            </section>

            <section id="alcance" className="legal-section">
              <h2>2. Alcance del SLA</h2>
              <p>Este SLA cubre:</p>
              <ul>
                <li>Hosting compartido y planes reseller con infraestructura administrada por Odisea Cloud.</li>
                <li>Servidores web, paneles de control (cPanel/WHM) y conectividad de red del datacenter.</li>
                <li>Servicios DNS gestionados por nuestra plataforma.</li>
              </ul>
              <p>No cubre:</p>
              <ul>
                <li>Proyectos de desarrollo web o sistemas a medida (sujetos a propuesta comercial).</li>
                <li>Contenido, código o configuraciones introducidas por el cliente.</li>
                <li>Servicios de terceros (registros de dominio upstream, CDN externos, etc.).</li>
                <li>Planes gratuitos, pruebas o promociones que indiquen lo contrario.</li>
              </ul>
            </section>

            <section id="uptime" className="legal-section">
              <h2>3. Compromiso de disponibilidad</h2>
              <p>
                Odisea Cloud garantiza los siguientes niveles de uptime mensual sobre la
                infraestructura incluida en cada categoría de plan:
              </p>

              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th>Planes</th>
                      <th>Uptime mensual</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Estándar</strong></td>
                      <td>Hosting compartido (Starter, Business, Pro, Unlimited) y Reseller Bronze/Silver</td>
                      <td><strong>99.9%</strong></td>
                    </tr>
                    <tr>
                      <td><strong>Premium</strong></td>
                      <td>Reseller Gold y planes enterprise con SLA dedicado</td>
                      <td><strong>99.99%</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Un uptime del <strong>99.9%</strong> equivale a un máximo de ~43 minutos de
                inactividad no planificada al mes. Un <strong>99.99%</strong> equivale a ~4 minutos.
              </p>
            </section>

            <section id="medicion" className="legal-section">
              <h2>4. Medición del uptime</h2>
              <p>
                La disponibilidad se mide mensualmente mediante monitoreo externo e interno de
                los servicios críticos (HTTP/HTTPS, panel de control y conectividad del servidor).
              </p>
              <p>
                Solo se considera tiempo de inactividad cuando el servicio principal del plan
                contratado no responde de forma verificable y la causa es atribuible a
                infraestructura bajo responsabilidad de Odisea Cloud.
              </p>
            </section>

            <section id="exclusiones" className="legal-section">
              <h2>5. Exclusiones</h2>
              <p>No computan como incumplimiento del SLA:</p>
              <ul>
                <li>Mantenimientos programados comunicados con al menos 24 horas de anticipación.</li>
                <li>Interrupciones causadas por el cliente (código defectuoso, plugins, sobrecarga de recursos, configuración incorrecta).</li>
                <li>Ataques DDoS de gran escala, eventos de fuerza mayor o fallas de proveedores upstream fuera de nuestro control.</li>
                <li>Suspensiones por impago, abuso de recursos o violación de la política de uso aceptable.</li>
                <li>Problemas en el equipo, red o software del usuario final.</li>
                <li>Indisponibilidad de dominios por vencimiento, bloqueo WHOIS o DNS gestionado externamente.</li>
              </ul>
            </section>

            <section id="soporte" className="legal-section">
              <h2>6. Tiempos de respuesta de soporte</h2>
              <p>
                Los tiempos indicados representan la primera respuesta humana o automatizada
                confirmando recepción del ticket, en horario laboral (L–V, 9:00–18:00 PET):
              </p>

              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Prioridad</th>
                      <th>Estándar</th>
                      <th>Premium / VIP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Crítica (servicio caído)</td>
                      <td>≤ 2 horas</td>
                      <td>≤ 1 hora</td>
                    </tr>
                    <tr>
                      <td>Alta (degradación severa)</td>
                      <td>≤ 4 horas</td>
                      <td>≤ 2 horas</td>
                    </tr>
                    <tr>
                      <td>Media (consulta técnica)</td>
                      <td>≤ 8 horas</td>
                      <td>≤ 4 horas</td>
                    </tr>
                    <tr>
                      <td>Baja (consulta general)</td>
                      <td>≤ 24 horas</td>
                      <td>≤ 12 horas</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Planes con <strong>Soporte VIP 24/7</strong> o <strong>soporte prioritario</strong>
                incluyen atención extendida según lo indicado en la ficha del plan contratado.
              </p>
            </section>

            <section id="creditos" className="legal-section">
              <h2>7. Créditos de servicio</h2>
              <p>
                Si el uptime mensual cae por debajo del compromiso aplicable y la causa es
                responsabilidad de Odisea Cloud, el cliente puede solicitar un crédito de
                servicio (no reembolso en efectivo) sobre la renovación del mes siguiente:
              </p>

              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Uptime alcanzado</th>
                      <th>SLA Estándar (99.9%)</th>
                      <th>SLA Premium (99.99%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>99.0% – 99.89%</td>
                      <td>10% de crédito</td>
                      <td>15% de crédito</td>
                    </tr>
                    <tr>
                      <td>95.0% – 98.99%</td>
                      <td>25% de crédito</td>
                      <td>30% de crédito</td>
                    </tr>
                    <tr>
                      <td>&lt; 95.0%</td>
                      <td>50% de crédito</td>
                      <td>50% de crédito</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                El crédito máximo acumulable por mes es del <strong>50%</strong> del valor del
                plan afectado. La solicitud debe presentarse dentro de los <strong>7 días</strong>{" "}
                posteriores al fin del mes en que ocurrió la incidencia.
              </p>
            </section>

            <section id="reporte" className="legal-section">
              <h2>8. Cómo reportar una incidencia</h2>
              <p>Para reportar caídas o degradación del servicio:</p>
              <ul>
                <li>Abre un ticket desde el área de clientes con prioridad adecuada.</li>
                <li>O escribe a <a href="mailto:soporte@odiseacloud.com">soporte@odiseacloud.com</a> indicando dominio, plan y hora de inicio de la incidencia.</li>
                <li>Incluye capturas, mensajes de error o logs si los tienes disponibles.</li>
              </ul>
              <p>
                Consulta el estado general de la red en la sección &quot;Estado de Red&quot; del sitio
                o mediante nuestros canales oficiales de comunicación.
              </p>
            </section>

            <section id="mantenimiento" className="legal-section">
              <h2>9. Mantenimiento programado</h2>
              <p>
                Realizamos actualizaciones de seguridad, parches y mejoras de infraestructura
                de forma periódica. Los mantenimientos planificados se anuncian con al menos{" "}
                <strong>24 horas</strong> de anticipación por correo o panel de clientes.
              </p>
              <p>
                Preferimos ejecutar ventanas de mantenimiento en horarios de baja demanda
                (madrugada, hora de Perú) para minimizar el impacto.
              </p>
            </section>

            <section id="limites" className="legal-section">
              <h2>10. Límites de responsabilidad</h2>
              <p>
                Los créditos de servicio constituyen la compensación principal por
                incumplimiento de este SLA. Para más información sobre limitaciones generales
                de responsabilidad, consulta los{" "}
                <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>.
              </p>
            </section>

            <section id="contacto" className="legal-section">
              <h2>11. Contacto</h2>
              <p>Para consultas sobre disponibilidad y SLA:</p>
              <ul>
                <li>
                  <a href="mailto:soporte@odiseacloud.com">soporte@odiseacloud.com</a>
                </li>
                <li>
                  <a href="mailto:ventas@odiseacloud.com">ventas@odiseacloud.com</a>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </main>

      <footer className="legal-footer">
        <p>© 2026 Odisea Cloud. Todos los derechos reservados.</p>
        <div className="legal-footer-links">
          <Link href="/terminos-y-condiciones">Términos</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/">Inicio</Link>
        </div>
      </footer>
    </div>
  );
}