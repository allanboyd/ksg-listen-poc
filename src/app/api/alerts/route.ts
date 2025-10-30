import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

// Simple in-memory queue for dev; replace with KV/DB in prod
const queue: any[] = [];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const role = (session as any)?.role;
  if (role !== "administrator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(()=>({}));
  const item = { id: crypto.randomUUID(), createdAt: Date.now(), ...body };
  queue.unshift(item);
  // Email (optional)
  const { title, message, priority } = body || {};
  const mailHost = process.env.MAIL_HOST;
  if (mailHost && (priority === 'urgent' || priority === 'high')) {
    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: parseInt(process.env.MAIL_PORT || '465'),
      secure: process.env.MAIL_SCHEME === 'smtps',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM_ADDRESS,
      to: process.env.ALERT_TO || process.env.MAIL_FROM_ADDRESS,
      subject: `[KSG Listen] ${String(priority).toUpperCase()}: ${title || 'Alert'}`,
      text: message || 'New alert',
    });
  }
  return NextResponse.json({ ok: true, id: item.id });
}

export async function GET() {
  return NextResponse.json({ items: queue.slice(0, 100) });
}


