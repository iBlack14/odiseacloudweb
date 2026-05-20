import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await request.text().catch(() => "");
  return NextResponse.redirect(new URL("/?payment=success", request.url), 303);
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/?payment=success", request.url), 303);
}
