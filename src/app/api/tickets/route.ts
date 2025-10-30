import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { tickets, users, roles } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const role = (session as any)?.role;
  if (!role || (role !== "administrator" && role !== "staff")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(()=>({}));
  const title = String(body.title || '').trim();
  const campus = String(body.campus || '').trim();
  const category = String(body.category || '').trim().toLowerCase();
  const priority = String(body.priority || '').trim();
  const description = String(body.description || '').trim();
  const location = String(body.location || '').trim();
  if (!title || !campus || !category || !priority) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!['feedback','inquiry','question'].includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  await db.insert(tickets).values({ title, campus, category, priority, status: "Open", location, createdBy: session?.user ? Number((session as any).user.id || 0) : null as any });
  return NextResponse.json({ ok: true });
}


