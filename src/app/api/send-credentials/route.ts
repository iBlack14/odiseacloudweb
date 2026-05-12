import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, username, password, planName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Odisea Cloud <notificaciones@odiseacloud.com>',
      to: [email],
      subject: '🔑 Tus credenciales de Odisea Cloud están listas',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00A3FF; margin-bottom: 10px;">¡Bienvenido a Odisea Cloud!</h1>
            <p style="font-size: 16px; color: #4a5568;">Hola ${name}, tu infraestructura está lista para usarse.</p>
          </div>
          
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="font-size: 14px; color: #718096; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0;">Detalles del Plan</h2>
            <p style="font-size: 18px; font-weight: bold; margin: 5px 0;">${planName}</p>
          </div>

          <div style="background-color: #ebf8ff; border-left: 4px solid #00A3FF; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
            <h2 style="font-size: 14px; color: #2b6cb0; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0;">Tus Credenciales</h2>
            <p style="margin: 10px 0;"><strong>Usuario:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${username}</code></p>
            <p style="margin: 10px 0;"><strong>Contraseña:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${password}</code></p>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 14px; color: #718096; text-transform: uppercase; letter-spacing: 0.1em;">Accesos Rápidos</h2>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <a href="https://odin.odisea.cloud" style="background-color: #00A3FF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">Acceder al Odin Panel</a>
            </div>
            <p style="font-size: 12px; color: #718096; margin-top: 15px;">También puedes entrar a tu área de clientes en <a href="https://odisea.cloud/login" style="color: #00A3FF;">odisea.cloud/login</a></p>
          </div>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
          
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">
            Este es un correo automático. Por favor, guarda estas credenciales en un lugar seguro.
            <br>© 2026 Odisea Cloud. Todos los derechos reservados.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
