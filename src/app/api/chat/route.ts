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
    // Try root location first, then the ksg subfolder
    const p1 = path.join(process.cwd(), "public", "docs", "ksg_training_calender.pdf");
    const p2 = path.join(process.cwd(), "public", "docs", "ksg", "ksg_training_calender.pdf");
    const p = fs.existsSync(p1) ? p1 : p2;
    const buf = fs.readFileSync(p);
    const parsed = await pdfParse(buf);
    return parsed.text.slice(0, 50_000); // trim to keep request small
  } catch {
    return "";
  }
}

async function loadKsgDocsText(): Promise<string> {
  try {
    const root = path.join(process.cwd(), "public", "docs", "ksg");
    if (!fs.existsSync(root)) return "";
    const entries: string[] = [];

    const walk = (dir: string) => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const it of items) {
        const full = path.join(dir, it.name);
        if (it.isDirectory()) {
          walk(full);
        } else if (/\.(pdf|md|markdown|txt)$/i.test(it.name)) {
          entries.push(full);
        }
      }
    };
    walk(root);

    const chunks: string[] = [];
    for (const file of entries) {
      try {
        if (/\.pdf$/i.test(file)) {
          const pdfMod: any = await import("pdf-parse");
          const pdfParse = pdfMod.default ?? pdfMod;
          const buf = fs.readFileSync(file);
          const parsed = await pdfParse(buf);
          chunks.push(parsed.text.slice(0, 30_000));
        } else {
          const raw = fs.readFileSync(file, "utf8");
          const plain = raw
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/^\s*#+\s*/gm, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          chunks.push(plain.slice(0, 20_000));
        }
      } catch {}
    }
    return chunks.join("\n\n").slice(0, 60_000);
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
    const { message, mode } = body as { message: string; mode?: "docs"|"website"|"combined" };
    if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });
    const trimmed = message.trim();
    // 0) Immediate responses for greetings and feedback intent
    if (/^(hello|hi)\b/i.test(trimmed)) {
      return NextResponse.json({ reply: "welcome I am ksg assistnt and i am ready to listen how may i make of help today ?" });
    }
    if (/\bfeedback\b/i.test(trimmed)) {
      return NextResponse.json({ reply: "Please share your feedback details. Would you like to submit anonymously or as a user?" });
    }
    // If AI key is not configured, return a helpful message instead of 500
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply:
          "KSG Assistant is not fully configured. Please set AI_KEY in your environment to enable AI answers. You can still submit feedback or ask general questions.",
      });
    }
    // Mode control: if none provided, default combined (docs + website)
    const useMode = mode || "combined";
    const [calendar, docs, website] = await Promise.all([
      useMode !== "website" ? loadCalendarText() : Promise.resolve(""),
      useMode !== "website" ? loadKsgDocsText() : Promise.resolve("") ,
      useMode !== "docs" ? fetchWebsiteText() : Promise.resolve(""),
    ]);
    const modeHeader = `Mode: ${useMode}\n- docs => use ONLY public/docs/ksg and training calendar\n- website => use ONLY ksg.ac.ke\n- combined => use both`; 
    const labeled: string[] = [modeHeader];
    if (website) labeled.push(`WEBSITE CONTEXT (ksg.ac.ke):\n${website}`);
    if (calendar) labeled.push(`CALENDAR CONTEXT (training calendar):\n${calendar}`);
    if (docs) labeled.push(`KSG DOCS CONTEXT (public/docs/ksg):\n${docs}`);
    const rawContext = labeled.join("\n\n").trim();
    const context = rawContext.slice(0, 40_000);
    try {
      const reply = await chatGemini(message, context);
      const greeting = /^(hi|hello|hey)\b/i.test(message.trim());
      const menu = "Hello, what would you like my help with? 1) Make inquiry 2) General information 3) Make feedback";
      // Build content-based fallback: first page-like snippet from docs/calendar, else random website snippet
      const firstDocSource = (docs || calendar || "").trim();
      const firstDocSnippet = firstDocSource ? firstDocSource.slice(0, 1400) : "";
      let websiteSnippet = "";
      if (website) {
        const sentences = website.split(/(?<=[.!?])\s+/).filter(s=>s && s.length > 40);
        if (sentences.length) {
          const pick = sentences[Math.floor(Math.random() * sentences.length)];
          websiteSnippet = pick.slice(0, 600);
        }
      }
      const contentFallback = firstDocSnippet || websiteSnippet || "";
      const fallback = greeting
        ? menu
        : (contentFallback || "I couldn't find a good answer right now. You can choose: 1) Make inquiry (docs), 2) General information (website), or 3) Make feedback.");
      const finalReply = (reply && reply.trim().length > 0) ? reply : fallback;
      return NextResponse.json({ reply: finalReply });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({
        reply:
          "KSG Assistant could not reach the AI service right now. Your message was received. Please try again shortly.",
        error: msg,
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


