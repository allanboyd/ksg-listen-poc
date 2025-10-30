import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  try {
    const p = path.join(process.cwd(), "data", "ksg_index.json");
    if (!fs.existsSync(p)) return NextResponse.json([]);
    const raw = fs.readFileSync(p, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return NextResponse.json([]);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}


