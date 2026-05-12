import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, username, password, email, planId } = body;

    const coreApiUrl = process.env.ODISEA_API_URL || 'http://localhost:3001/api';
    const coreApiKey = process.env.ODISEA_API_KEY || 'odisea_master_key_secret';

    const response = await fetch(`${coreApiUrl}/public/register-hosting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': coreApiKey,
      },
      body: JSON.stringify({
        domain,
        username,
        password,
        email,
        planId,
        isReseller: false,
        nameservers: {
          inheritRoot: true
        },
        settings: {
          phpVersion: "8.2",
          shellAccess: false,
          nodejsEnabled: true,
          dockerEnabled: false
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: data.error || { message: 'Error en el aprovisionamiento del core' } 
      }, { status: response.status });
    }

    return NextResponse.json({ success: true, data: data.data });
  } catch (err: any) {
    console.error("[api:provision:error]", err);
    return NextResponse.json({ 
      success: false, 
      error: { message: err.message } 
    }, { status: 500 });
  }
}
