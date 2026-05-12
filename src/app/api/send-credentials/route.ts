import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, username, password, planName, type } = await request.json();

    const panelUrl = process.env.NEXT_PUBLIC_PANEL_URL || 'https://odin.odisea.cloud';
    const clientAreaUrl = process.env.NEXT_PUBLIC_CLIENT_AREA_URL || 'https://odisea.cloud/login';
    
    const panelLabel = type === 'reseller' ? 'Panel WHM Reseller' : 'Panel de Control Odin';

    const { data, error } = await resend.emails.send({
      from: 'Odisea Cloud <notificaciones@odiseacloud.com>',
      to: [email],
      subject: `🚀 Tu servicio de ${type === 'reseller' ? 'Reseller' : 'Hosting'} está listo`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a202c; background-color: #fcfcfc;">
          <div style="text-align: center; margin-bottom: 40px;">
            <img src="https://odisea.cloud/logo.png" alt="Odisea Cloud" style="height: 40px; margin-bottom: 20px;">
            <h1 style="color: #00A3FF; font-size: 28px; margin: 0;">¡Hola ${name}!</h1>
            <p style="font-size: 16px; color: #718096; margin-top: 10px;">Tu infraestructura ha sido activada con éxito.</p>
          </div>
          
          <div style="background: white; border: 1px solid #edf2f7; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); margin-bottom: 24px;">
            <h2 style="font-size: 13px; color: #00A3FF; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0; margin-bottom: 20px;">1. Acceso al Servicio (${type === 'reseller' ? 'Reseller' : 'Hosting'})</h2>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #4a5568;"><strong>Plan:</strong> ${planName}</p>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #4a5568;"><strong>Usuario:</strong> <code style="color: #00A3FF; font-weight: bold;">${username}</code></p>
              <p style="margin: 0; font-size: 14px; color: #4a5568;"><strong>Contraseña:</strong> <code style="color: #00A3FF; font-weight: bold;">${password}</code></p>
            </div>

            <a href="${panelUrl}" style="display: block; text-align: center; background-color: #00A3FF; color: white; padding: 14px 20px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px;">
              Entrar al ${panelLabel}
            </a>
          </div>

          <div style="background: white; border: 1px solid #edf2f7; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            <h2 style="font-size: 13px; color: #4a5568; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0; margin-bottom: 20px;">2. Área de Clientes (Facturación y Soporte)</h2>
            
            <p style="font-size: 14px; color: #4a5568; margin-bottom: 20px;">Gestiona tus pagos, descarga facturas y solicita soporte técnico.</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #4a5568;"><strong>Email:</strong> <span style="color: #4a5568;">${email}</span></p>
              <p style="margin: 0; font-size: 14px; color: #4a5568;"><strong>Contraseña:</strong> <code style="color: #4a5568; font-weight: bold;">${password}</code></p>
            </div>

            <a href="${clientAreaUrl}" style="display: block; text-align: center; border: 2px solid #edf2f7; color: #4a5568; padding: 12px 20px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px;">
              Ir al Área de Clientes
            </a>
            <p style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 15px;">(Usa la misma contraseña temporal para ambos accesos)</p>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #edf2f7;">
            <p style="font-size: 12px; color: #a0aec0; line-height: 1.6;">
              ¿Necesitas ayuda? Responde a este correo o abre un ticket desde tu área de clientes.
              <br><br>
              <strong>© 2026 Odisea Cloud</strong><br>
              Infraestructura de alto rendimiento.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[resend:error]", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("[api:send-credentials:error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
