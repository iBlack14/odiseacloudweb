import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad | Odisea Cloud",
  description:
    "Política de privacidad y tratamiento de datos personales de Odisea Cloud conforme a la legislación peruana.",
};

const SECTIONS = [
  { id: "responsable", title: "1. Responsable del tratamiento" },
  { id: "alcance", title: "2. Alcance" },
  { id: "datos", title: "3. Datos que recopilamos" },
  { id: "finalidades", title: "4. Finalidades del tratamiento" },
  { id: "base-legal", title: "5. Base legal" },
  { id: "comparticion", title: "6. Compartición con terceros" },
  { id: "transferencias", title: "7. Transferencias internacionales" },
  { id: "conservacion", title: "8. Plazo de conservación" },
  { id: "derechos", title: "9. Derechos del titular" },
  { id: "cookies", title: "10. Cookies y tecnologías similares" },
  { id: "seguridad", title: "11. Seguridad de la información" },
  { id: "menores", title: "12. Menores de edad" },
  { id: "cambios", title: "13. Cambios a esta política" },
  { id: "contacto", title: "14. Contacto" },
] as const;

export default function PrivacidadPage() {
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
              <Shield size={14} />
              <span>Protección de datos</span>
            </div>
            <h1>Política de Privacidad</h1>
            <p className="legal-doc-intro">
              En Odisea Cloud valoramos tu privacidad. Esta política describe cómo recopilamos,
              usamos, almacenamos y protegemos tus datos personales cuando utilizas nuestro sitio,
              contratas servicios o te comunicas con nosotros.
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
            <section id="responsable" className="legal-section">
              <h2>1. Responsable del tratamiento</h2>
              <p>
                El responsable del tratamiento de los datos personales es <strong>Odisea Cloud</strong>,
                marca bajo la cual se comercializan servicios de hosting, dominios y desarrollo web
                en Perú y Latinoamérica.
              </p>
              <p>
                Correo de contacto para privacidad:{" "}
                <a href="mailto:soporte@odiseacloud.com">soporte@odiseacloud.com</a>
              </p>
            </section>

            <section id="alcance" className="legal-section">
              <h2>2. Alcance</h2>
              <p>Esta política aplica a:</p>
              <ul>
                <li>Visitantes del sitio web odiseacloud.com y subdominios asociados.</li>
                <li>Clientes que contratan hosting, dominios, complementos o desarrollo.</li>
                <li>Usuarios del área de clientes, formularios de contacto y checkout.</li>
                <li>Personas que se comunican con nosotros por correo o canales de soporte.</li>
              </ul>
              <p>
                El uso de nuestros servicios también se rige por los{" "}
                <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>.
              </p>
            </section>

            <section id="datos" className="legal-section">
              <h2>3. Datos que recopilamos</h2>
              <p>Podemos tratar las siguientes categorías de datos:</p>
              <ul>
                <li>
                  <strong>Identificación y contacto:</strong> nombre, correo electrónico, teléfono,
                  empresa, dirección y documento de identidad cuando sea necesario para facturación.
                </li>
                <li>
                  <strong>Datos de cuenta:</strong> usuario, historial de servicios, tickets de
                  soporte y preferencias de configuración.
                </li>
                <li>
                  <strong>Datos de pago:</strong> método de pago, moneda y referencias de
                  transacción. Los datos sensibles de tarjeta son procesados por pasarelas
                  certificadas (Izipay); Odisea Cloud no almacena números completos de tarjeta.
                </li>
                <li>
                  <strong>Datos técnicos:</strong> dirección IP, navegador, dispositivo, logs de
                  acceso, registros DNS y métricas de uso de infraestructura.
                </li>
                <li>
                  <strong>Datos de dominio:</strong> información WHOIS requerida por registros
                  oficiales para registrar o transferir nombres de dominio.
                </li>
                <li>
                  <strong>Comunicaciones:</strong> mensajes enviados mediante formularios de
                  contacto o correo electrónico.
                </li>
              </ul>
            </section>

            <section id="finalidades" className="legal-section">
              <h2>4. Finalidades del tratamiento</h2>
              <p>Utilizamos tus datos para:</p>
              <ul>
                <li>Prestar, activar, renovar y dar soporte a los servicios contratados.</li>
                <li>Procesar pagos, emitir comprobantes y gestionar la relación comercial.</li>
                <li>Registrar dominios y cumplir obligaciones con registros upstream.</li>
                <li>Enviar notificaciones operativas, de seguridad y de facturación.</li>
                <li>Responder consultas, tickets y solicitudes de soporte técnico.</li>
                <li>Mejorar la plataforma, prevenir fraude y garantizar la seguridad de la red.</li>
                <li>Enviar información comercial solo si has dado tu consentimiento o existe relación vigente permitida por ley.</li>
              </ul>
            </section>

            <section id="base-legal" className="legal-section">
              <h2>5. Base legal</h2>
              <p>
                El tratamiento de datos se fundamenta en la Ley N.° 29733 — Ley de Protección de
                Datos Personales — y su reglamento, así como en:
              </p>
              <ul>
                <li>La ejecución del contrato o medidas precontractuales solicitadas por el titular.</li>
                <li>El cumplimiento de obligaciones legales (tributarias, registrales, etc.).</li>
                <li>El interés legítimo en seguridad, mejora del servicio y prevención de abuso.</li>
                <li>El consentimiento del titular, cuando sea requerido (por ejemplo, ciertas comunicaciones comerciales).</li>
              </ul>
            </section>

            <section id="comparticion" className="legal-section">
              <h2>6. Compartición con terceros</h2>
              <p>
                No vendemos tus datos personales. Podemos compartirlos únicamente con:
              </p>
              <ul>
                <li>Proveedores de infraestructura, registros de dominio y pasarelas de pago.</li>
                <li>Plataformas de correo, monitoreo y herramientas de soporte necesarias para operar el servicio.</li>
                <li>Asesores legales, contables o auditoría cuando sea estrictamente necesario.</li>
                <li>Autoridades competentes, si existe requerimiento legal válido.</li>
              </ul>
              <p>
                Estos terceros actúan como encargados de tratamiento o proveedores independientes
                y deben aplicar medidas de seguridad acordes a la naturaleza de los datos.
              </p>
            </section>

            <section id="transferencias" className="legal-section">
              <h2>7. Transferencias internacionales</h2>
              <p>
                Dado el carácter global de la infraestructura de internet, algunos datos pueden
                ser procesados o almacenados en servidores ubicados fuera del Perú. En esos casos,
                adoptamos salvaguardas razonables para garantizar un nivel adecuado de protección,
                conforme a la normativa aplicable.
              </p>
            </section>

            <section id="conservacion" className="legal-section">
              <h2>8. Plazo de conservación</h2>
              <p>
                Conservamos los datos mientras exista una relación contractual activa o sea
                necesario para cumplir obligaciones legales, resolver disputas o hacer valer
                nuestros derechos.
              </p>
              <p>
                Tras la cancelación del servicio, ciertos registros (facturación, logs de
                seguridad, historial de dominios) pueden mantenerse por los plazos exigidos por
                ley o por motivos legítimos de auditoría y prevención de fraude.
              </p>
            </section>

            <section id="derechos" className="legal-section">
              <h2>9. Derechos del titular</h2>
              <p>Como titular de datos personales, puedes ejercer los siguientes derechos:</p>
              <ul>
                <li><strong>Acceso:</strong> conocer qué datos tratamos sobre ti.</li>
                <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                <li><strong>Cancelación:</strong> solicitar la supresión cuando corresponda.</li>
                <li><strong>Oposición:</strong> oponerte a ciertos tratamientos basados en interés legítimo.</li>
                <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado, cuando aplique.</li>
                <li><strong>Revocación del consentimiento:</strong> cuando el tratamiento se base en consentimiento.</li>
              </ul>
              <p>
                Para ejercer estos derechos, escribe a{" "}
                <a href="mailto:soporte@odiseacloud.com">soporte@odiseacloud.com</a> indicando tu
                solicitud y un medio de verificación de identidad. Responderemos en los plazos
                previstos por la normativa vigente.
              </p>
            </section>

            <section id="cookies" className="legal-section">
              <h2>10. Cookies y tecnologías similares</h2>
              <p>
                Nuestro sitio puede utilizar cookies y tecnologías similares para recordar
                preferencias (como moneda seleccionada), mantener sesiones de usuario y analizar
                el rendimiento del sitio.
              </p>
              <p>
                Puedes configurar tu navegador para rechazar cookies; sin embargo, algunas
                funciones del sitio o del área de clientes podrían dejar de operar correctamente.
              </p>
            </section>

            <section id="seguridad" className="legal-section">
              <h2>11. Seguridad de la información</h2>
              <p>
                Implementamos medidas técnicas y organizativas para proteger los datos contra
                acceso no autorizado, pérdida, alteración o divulgación, incluyendo cifrado en
                tránsito (SSL/TLS), controles de acceso, respaldos y monitoreo de infraestructura.
              </p>
              <p>
                Ningún sistema es 100% invulnerable. Si detectas una incidencia de seguridad
                relacionada con nuestros servicios, repórtala de inmediato a{" "}
                <a href="mailto:soporte@odiseacloud.com">soporte@odiseacloud.com</a>.
              </p>
            </section>

            <section id="menores" className="legal-section">
              <h2>12. Menores de edad</h2>
              <p>
                Nuestros servicios están dirigidos a personas mayores de 18 años o a menores
                que actúen con autorización de sus padres o tutores. No recopilamos
                intencionalmente datos de menores sin el consentimiento correspondiente.
              </p>
            </section>

            <section id="cambios" className="legal-section">
              <h2>13. Cambios a esta política</h2>
              <p>
                Podemos actualizar esta Política de Privacidad para reflejar cambios legales,
                técnicos u operativos. Publicaremos la versión vigente en esta página con su
                fecha de actualización.
              </p>
            </section>

            <section id="contacto" className="legal-section">
              <h2>14. Contacto</h2>
              <p>Para consultas sobre privacidad y protección de datos:</p>
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
          <Link href="/sla">SLA</Link>
          <Link href="/">Inicio</Link>
        </div>
      </footer>
    </div>
  );
}