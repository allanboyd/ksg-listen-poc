import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { roles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    const roleName = String(body.role || "participants");
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    const roleRows = await db.select().from(roles).where(eq(roles.name, roleName));
    if (roleRows.length === 0) {
      return NextResponse.json({ error: "Role not found" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(users).values({ name, email, passwordHash, roleId: roleRows[0].id as number });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}


