import { NextResponse } from "next/server";
import { fetchUsdToPenRate } from "@/lib/exchange-rate";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchUsdToPenRate();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("[api:exchange-rate]", error);
    return NextResponse.json(
      { success: false, error: "No se pudo obtener el tipo de cambio" },
      { status: 500 },
    );
  }
}