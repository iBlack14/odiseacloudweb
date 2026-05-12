import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, email, name } = await request.json();

    // PEN para Izipay Perú. USD se maneja por otro medio.
    const amountInCents = Math.max(100, Math.round(amount * 100));

    const clientId = process.env.IZIPAY_CLIENT_ID;
    const clientSecret = process.env.IZIPAY_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log(`[izipay:token] amount=${amountInCents} PEN, shop=${clientId}`);

    const response = await fetch(`${process.env.IZIPAY_REST_SERVER}/api-payment/V4/Charge/CreatePayment`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'PEN',
        customer: {
          email: email,
          billingDetails: {
            firstName: name.split(' ')[0] || 'Cliente',
            lastName: name.split(' ').slice(1).join(' ') || 'Odisea',
          }
        },
        orderId: `OD-${Date.now()}`,
      }),
    });

    const data = await response.json();

    if (data.status !== 'SUCCESS') {
      console.error("[izipay:error_response]", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: data.answer || 'Error al generar token de pago' }, { status: 400 });
    }

    // Retornamos el formToken que necesita el cliente JS
    return NextResponse.json({ formToken: data.answer.formToken });
  } catch (err: any) {
    console.error("[api:izipay:token]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
