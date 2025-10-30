import { NextResponse } from "next/server";
import { chatGemini } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const reply = await chatGemini("Respond with OK only.");
    const ok = String(reply || "").toUpperCase().includes("OK");
    return NextResponse.json({ ok, reply });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}



