import { NextRequest, NextResponse } from "next/server";
import { buildIndex } from "@/lib/indexer";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  try {
    const items = await buildIndex();
    return NextResponse.json({ ok: true, count: items.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}


