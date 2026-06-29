import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Odisea Cloud",
  description:
    "Términos y condiciones de uso de los servicios de hosting, dominios y desarrollo web de Odisea Cloud.",
};

const SECTIONS = [
  { id: "identificacion", title: "1. Identificación del proveedor" },
  { id: "aceptacion", title: "2. Aceptación de los términos" },
  { id: "servicios", title: "3. Descripción de los servicios" },
  { id: "registro", title: "4. Registro y cuenta de cliente" },
  { id: "pagos", title: "5. Precios, facturación y pagos" },
  { id: "uso", title: "6. Uso aceptable del servicio" },
  { id: "dominios", title: "7. Registro y gestión de dominios" },
  { id: "disponibilidad", title: "8. Disponibilidad y soporte" },
  { id: "propiedad", title: "9. Propiedad intelectual y contenido" },
  { id: "datos", title: "10. Protección de datos personales" },
  { id: "responsabilidad", title: "11. Limitación de responsabilidad" },
  { id: "cancelacion", title: "12. Cancelación, suspensión y reembolsos" },
  { id: "modificaciones", title: "13. Modificaciones" },
  { id: "ley", title: "14. Ley aplicable y jurisdicción" },
  { id: "contacto", title: "15. Contacto" },
] as const;

export default function TerminosYCondicionesPage() {
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
              <FileText size={14} />
              <span>Documento legal</span>
            </div>
            <h1>Términos y Condiciones</h1>
            <p className="legal-doc-intro">
              Estos términos regulan el acceso y uso de los servicios ofrecidos por Odisea Cloud.
              Al contratar, registrarte o utilizar nuestra plataforma, aceptas las condiciones
              descritas en este documento.
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
            <section id="identificacion" className="legal-section">
              <h2>1. Identificación del proveedor</h2>
              <p>
                Los servicios comercializados bajo la marca <strong>Odisea Cloud</strong> son
                prestados por un proveedor de infraestructura digital con operaciones en Perú y
                Latinoamérica. Para consultas comerciales o legales puedes escribir a{" "}
                <a href="mailto:ventas@odiseacloud.com">ventas@odiseacloud.com</a> o a{" "}
                <a href="mailto:soporte@odiseacloud.com">soporte@odiseacloud.com</a>.
              </p>
            </section>

            <section id="aceptacion" className="legal-section">
              <h2>2. Aceptación de los términos</h2>
              <p>
                El uso del sitio web, la contratación de planes, el registro de dominios, el
                proceso de checkout, el envío de formularios de contacto y el acceso al área de
                clientes implican la aceptación plena de estos Términos y Condiciones.
              </p>
              <p>
                Si no estás de acuerdo con alguna disposición, debes abstenerte de utilizar
                nuestros servicios.
              </p>
            </section>

            <section id="servicios" className="legal-section">
              <h2>3. Descripción de los servicios</h2>
              <p>Odisea Cloud ofrece, entre otros, los siguientes servicios digitales:</p>
              <ul>
                <li>Hosting compartido, reseller y complementos de infraestructura.</li>
                <li>Registro, renovación y transferencia de nombres de dominio.</li>
                <li>Certificados SSL y servicios adicionales asociados al hosting.</li>
                <li>Desarrollo web, sistemas de gestión, e-commerce e integraciones.</li>
                <li>Soporte técnico y gestión de cuentas a través del área de clientes.</li>
              </ul>
              <p>
                Las características específicas de cada plan (espacio, ancho de banda, cuentas,
                SLA, etc.) son las publicadas en el sitio al momento de la contratación.
              </p>
            </section>

            <section id="registro" className="legal-section">
              <h2>4. Registro y cuenta de cliente</h2>
              <p>
                Para contratar ciertos servicios deberás proporcionar información veraz, actual
                y completa. Eres responsable de mantener la confidencialidad de tus credenciales
                y de todas las actividades realizadas desde tu cuenta.
              </p>
              <p>
                Odisea Cloud podrá suspender o cancelar cuentas que presenten datos falsos,
                actividad fraudulenta, incumplimiento de estos términos o riesgo para la
                infraestructura o terceros.
              </p>
            </section>

            <section id="pagos" className="legal-section">
              <h2>5. Precios, facturación y pagos</h2>
              <p>
                Los precios se muestran en dólares estadounidenses (USD) o soles peruanos (PEN),
                según la moneda seleccionada. En PEN, el tipo de cambio aplicable puede
                actualizarse periódicamente con base en referencias de mercado.
              </p>
              <p>Aceptamos, según disponibilidad:</p>
              <ul>
                <li>Tarjetas de crédito y débito a través de pasarelas seguras (Izipay).</li>
                <li>Transferencias y pagos móviles (Yape, Plin u otros medios indicados).</li>
                <li>Otros métodos habilitados expresamente en el checkout.</li>
              </ul>
              <p>
                Los servicios de suscripción (hosting, dominios, complementos) se renuevan según
                el ciclo contratado salvo cancelación previa dentro de los plazos indicados. El
                impago puede derivar en suspensión temporal o eliminación de datos tras el
                período de gracia correspondiente.
              </p>
            </section>

            <section id="uso" className="legal-section">
              <h2>6. Uso aceptable del servicio</h2>
              <p>Queda prohibido utilizar la infraestructura de Odisea Cloud para:</p>
              <ul>
                <li>Actividades ilegales, fraudulentas o que vulneren derechos de terceros.</li>
                <li>Envío de spam, phishing, malware o contenido abusivo.</li>
                <li>Ataques de red, escaneo no autorizado o sobrecarga intencional de recursos.</li>
                <li>Almacenar o distribuir material que infrinja propiedad intelectual.</li>
                <li>Revender recursos sin un plan reseller autorizado.</li>
              </ul>
              <p>
                El incumplimiento de esta política puede conllevar suspensión inmediata del
                servicio sin derecho a reembolso, sin perjuicio de acciones legales.
              </p>
            </section>

            <section id="dominios" className="legal-section">
              <h2>7. Registro y gestión de dominios</h2>
              <p>
                El registro de dominios está sujeto a las políticas de los registros y
                proveedores upstream correspondientes a cada extensión (TLD). El cliente es
                responsable de la exactitud de los datos WHOIS y del cumplimiento de requisitos
                locales, incluidos dominios <strong>.pe</strong> y otras extensiones
                territoriales.
              </p>
              <p>
                Las renovaciones deben realizarse antes de la fecha de vencimiento. Odisea Cloud
                no garantiza la recuperación de dominios expirados si el registro upstream ya los
                liberó.
              </p>
            </section>

            <section id="disponibilidad" className="legal-section">
              <h2>8. Disponibilidad y soporte</h2>
              <p>
                Nos esforzamos por mantener alta disponibilidad en la infraestructura. Los niveles
                de servicio (SLA) específicos, si aplican a tu plan, se detallan en nuestro{" "}
                <Link href="/sla">Acuerdo de Nivel de Servicio</Link>.
              </p>
              <p>
                El soporte técnico se presta por los canales habilitados (tickets, correo,
                área de clientes) en horarios y tiempos de respuesta acordes al plan contratado.
                Mantenimientos programados serán comunicados cuando sea posible.
              </p>
            </section>

            <section id="propiedad" className="legal-section">
              <h2>9. Propiedad intelectual y contenido</h2>
              <p>
                La marca Odisea Cloud, el sitio web, interfaces, documentación y elementos
                gráficos son propiedad del proveedor o de sus licenciantes. El cliente conserva
                la titularidad del contenido que aloje o desarrolle, otorgando únicamente las
                licencias necesarias para la prestación del servicio.
              </p>
              <p>
                En proyectos de desarrollo web, la entrega de archivos, código y derechos de uso
                se regirá por el alcance y condiciones acordadas en la propuesta comercial
                específica.
              </p>
            </section>

            <section id="datos" className="legal-section">
              <h2>10. Protección de datos personales</h2>
              <p>
                El tratamiento de datos personales se realiza conforme a la legislación
                peruana vigente, incluida la Ley N.° 29733 y su reglamento. Recopilamos y
                utilizamos datos únicamente para gestionar contratos, pagos, soporte,
                comunicaciones comerciales autorizadas y cumplimiento legal.
              </p>
              <p>
                Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición
                escribiendo a <a href="mailto:soporte@odiseacloud.com">soporte@odiseacloud.com</a>.
                Consulta el detalle completo en nuestra{" "}
                <Link href="/privacidad">Política de Privacidad</Link>.
              </p>
            </section>

            <section id="responsabilidad" className="legal-section">
              <h2>11. Limitación de responsabilidad</h2>
              <p>
                Odisea Cloud no será responsable por daños indirectos, lucro cesante o pérdida
                de datos derivados de causas fuera de su control razonable, tales como fallas de
                proveedores upstream, desastres naturales, actos de terceros o configuraciones
                incorrectas del cliente.
              </p>
              <p>
                La responsabilidad máxima acumulada, cuando corresponda, se limitará al monto
                pagado por el cliente por el servicio específico en los últimos doce (12) meses,
                salvo disposición legal imperativa en contrario.
              </p>
            </section>

            <section id="cancelacion" className="legal-section">
              <h2>12. Cancelación, suspensión y reembolsos</h2>
              <p>
                El cliente puede solicitar la cancelación de servicios recurrentes conforme a
                los procedimientos del área de clientes o por correo a soporte. Los dominios
                registrados y servicios ya consumidos o activados pueden no ser reembolsables.
              </p>
              <p>
                Odisea Cloud podrá suspender servicios por impago, abuso, orden judicial o
                riesgo de seguridad. En caso de reembolso aprobado, el procesamiento se
                realizará por el mismo medio de pago cuando sea técnicamente posible, dentro de
                plazos bancarios habituales.
              </p>
            </section>

            <section id="modificaciones" className="legal-section">
              <h2>13. Modificaciones</h2>
              <p>
                Podemos actualizar estos Términos y Condiciones para reflejar cambios legales,
                operativos o en nuestros servicios. La versión vigente estará siempre publicada
                en esta página con su fecha de actualización.
              </p>
              <p>
                El uso continuado de los servicios tras una modificación implica la aceptación
                de los nuevos términos, salvo que la ley exija consentimiento adicional.
              </p>
            </section>

            <section id="ley" className="legal-section">
              <h2>14. Ley aplicable y jurisdicción</h2>
              <p>
                Estos términos se rigen por las leyes de la República del Perú. Cualquier
                controversia se someterá a los tribunales competentes de Lima, Perú, salvo
                que las partes acuerden un mecanismo alternativo de resolución.
              </p>
            </section>

            <section id="contacto" className="legal-section">
              <h2>15. Contacto</h2>
              <p>Para consultas sobre estos términos:</p>
              <ul>
                <li>
                  Comercial:{" "}
                  <a href="mailto:ventas@odiseacloud.com">ventas@odiseacloud.com</a>
                </li>
                <li>
                  Soporte:{" "}
                  <a href="mailto:soporte@odiseacloud.com">soporte@odiseacloud.com</a>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </main>

      <footer className="legal-footer">
        <p>© 2026 Odisea Cloud. Todos los derechos reservados.</p>
        <div className="legal-footer-links">
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/sla">SLA</Link>
          <Link href="/">Inicio</Link>
        </div>
      </footer>
    </div>
  );
}