import { NextRequest, NextResponse } from "next/server";
import { chatGemini } from "@/lib/ai";
// pdf-parse ships CJS; import dynamically to access default
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

async function loadCalendarText(): Promise<string> {
  try {
    const pdfMod: any = await import("pdf-parse");
    const pdfParse = pdfMod.default ?? pdfMod; // support both ESM/CJS typings
    const p = path.join(process.cwd(), "public", "docs", "ksg_training_calender.pdf");
    const buf = fs.readFileSync(p);
    const parsed = await pdfParse(buf);
    return parsed.text.slice(0, 50_000); // trim to keep request small
  } catch {
    return "";
  }
}

async function fetchWebsiteText(): Promise<string> {
  try {
    const urls = [
      "https://www.ksg.ac.ke/",
      "https://www.ksg.ac.ke/training/",
    ];
    const texts: string[] = [];
    for (const u of urls) {
      try {
        const html = await fetch(u).then((r) => r.text());
        const plain = html
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        texts.push(plain.slice(0, 10_000));
      } catch {}
    }
    return texts.join("\n\n").slice(0, 30_000);
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message } = body as { message: string };
    if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });
    // If AI key is not configured, return a helpful message instead of 500
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply:
          "KSG Assistant is not fully configured. Please set GEMINI_API_KEY in your environment to enable AI answers. You can still submit feedback or ask general questions.",
      });
    }
    const [calendar, website] = await Promise.all([
      loadCalendarText(),
      fetchWebsiteText(),
    ]);
    const context = `${website}\n\n${calendar}`.trim();
    const reply = await chatGemini(message, context);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


