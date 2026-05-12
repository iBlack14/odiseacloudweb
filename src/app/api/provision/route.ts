import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, username, password, email, planId, isReseller } = body;

    const coreApiUrl = process.env.NEXT_PUBLIC_ODISEA_API_URL || 'http://localhost:3001/api/v1';
    const coreApiKey = process.env.ODISEA_API_KEY || 'odisea_master_key_secret';

    const payload = {
      domain,
      username,
      password,
      email,
      planId,
      isReseller: !!isReseller,
      nameservers: {
        inheritRoot: true
      },
      settings: {
        phpVersion: "8.2",
        shellAccess: !!isReseller,
        nodejsEnabled: true,
        dockerEnabled: false
      }
    };

    console.log(`[provision:request] Enviando al Core:`, JSON.stringify(payload, null, 2));

    const response = await fetch(`${coreApiUrl}/public/register-hosting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': coreApiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[provision:core:error] Respuesta fallida del Core:", data);
      return NextResponse.json({ 
        success: false, 
        error: data.error || { message: 'Error en el aprovisionamiento del core' } 
      }, { status: response.status });
    }

    console.log(`[provision:success] Core confirmó creación para ${username}:`, data);
    return NextResponse.json({ success: true, data: data.data });
  } catch (err: any) {
    console.error("[api:provision:error] Fallo fatal:", err);
    return NextResponse.json({ 
      success: false, 
      error: { message: err.message } 
    }, { status: 500 });
  }
}
