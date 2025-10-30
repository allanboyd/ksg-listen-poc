import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { tickets } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    const body = await req.json().catch(()=>({}));
    const title = String(body.title || '').trim();
    const campus = String(body.campus || '').trim();
    const priority = String(body.priority || '').trim();
    const location = String(body.location || '').trim();
    const anonymous = Boolean(body.anonymous);
    if (!title || !campus || !priority) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const createdBy = (!anonymous && session?.user?.id) ? Number((session as any).user.id || 0) : null;
    await db.insert(tickets).values({
      title,
      campus,
      category: "feedback",
      priority,
      status: "Open",
      location,
      createdBy: createdBy as any,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


