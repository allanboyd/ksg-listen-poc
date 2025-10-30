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

function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function scoreChunk(qTokens: string[], text: string): number {
  const t = tokenize(text);
  let score = 0;
  for (const qt of qTokens) {
    // bonus for exact presence; naive
    if (t.includes(qt)) score += 2;
  }
  // small boost for length to avoid empty
  return score + Math.min(t.length / 200, 5);
}

type RetrievedItem = { title: string; source: string; summary?: string; keywords?: string[]; content?: string };

function retrieveTopChunks(indexPath: string, query: string, mode: "docs"|"website"|"combined"): { text: string; items: RetrievedItem[] } {
  try {
    if (!fs.existsSync(indexPath)) return { text: "", items: [] };
    const arr = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    if (!Array.isArray(arr)) return { text: "", items: [] };
    const qTokens = tokenize(query).slice(0, 24);
    const filtered = arr.filter((it:any)=> mode==='combined' ? true : (mode==='docs' ? it.sourceType==='doc' : it.sourceType==='website'));
    const scored = filtered.map((it:any)=> ({ it, s: scoreChunk(qTokens, `${it.title}\n${it.summary||''}\n${it.content}`) }));
    scored.sort((a:any,b:any)=> b.s - a.s);
    const top12 = scored.slice(0, 12);
    const items: RetrievedItem[] = top12.map((x:any)=> ({
      title: x.it.title,
      source: x.it.source,
      summary: x.it.summary,
      keywords: Array.isArray(x.it.keywords) ? x.it.keywords.slice(0, 12) : [],
      content: String(x.it.content||'').slice(0, 2000),
    }));
    const text = top12.map((x:any)=> `TITLE: ${x.it.title}\nSOURCE: ${x.it.source}\nSUMMARY: ${x.it.summary||''}\nCONTENT:\n${String(x.it.content||'').slice(0, 2000)}`).join("\n\n---\n\n");
    return { text, items };
  } catch { return { text: "", items: [] }; }
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
    // Retrieve top chunks from prebuilt index for precision
    const indexPath = path.join(process.cwd(), 'data', 'ksg_index.json');
    const retrieved = retrieveTopChunks(indexPath, message, useMode);
    const modeHeader = `Mode: ${useMode}\n- docs => use ONLY public/docs/ksg and training calendar\n- website => use ONLY ksg.ac.ke\n- combined => use both`; 
    const labeled: string[] = [modeHeader];
    if (website) labeled.push(`WEBSITE CONTEXT (ksg.ac.ke):\n${website}`);
    if (calendar) labeled.push(`CALENDAR CONTEXT (training calendar):\n${calendar}`);
    if (docs) labeled.push(`KSG DOCS CONTEXT (public/docs/ksg):\n${docs}`);
    if (retrieved.text) labeled.unshift(`RETRIEVED CONTEXT (top chunks from index):\n${retrieved.text}`);
    const rawContext = labeled.join("\n\n").trim();
    const context = rawContext.slice(0, 40_000);
    try {
      const reply = await chatGemini(message, context);
      const greeting = /^(hi|hello|hey)\b/i.test(message.trim());
      const menu = "Hello, what would you like my help with? 1) Make inquiry 2) General information 3) Make feedback";
      // Build content-based fallback: prefer retrieved chunks, then docs/calendar, else random website snippet
      let retrievedSnippet = "";
      if (retrieved.text) {
        // take first chunk's content lines
        const parts = retrieved.text.split("\n\n---\n\n");
        if (parts.length) {
          const first = parts[0];
          // try SUMMARY then CONTENT
          const sumMatch = /SUMMARY:\n?([^]*?)\nCONTENT:/i.exec(first);
          const contentMatch = /CONTENT:\n([^]*$)/i.exec(first);
          retrievedSnippet = (sumMatch?.[1] || contentMatch?.[1] || first).trim().slice(0, 1200);
        }
      }
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
      const contentFallback = retrievedSnippet || firstDocSnippet || websiteSnippet || "";
      const fallback = greeting
        ? menu
        : (contentFallback || "I couldn't find a good answer right now. You can choose: 1) Make inquiry (docs), 2) General information (website), or 3) Make feedback.");
      const finalReply = (reply && reply.trim().length > 0) ? reply : fallback;
      // Build suggestions from top item keywords and titles
      const suggestionSet = new Set<string>();
      for (const it of retrieved.items.slice(0, 6)) {
        if (it.title) suggestionSet.add(it.title);
        for (const k of it.keywords || []) {
          if (suggestionSet.size >= 12) break;
          suggestionSet.add(k);
        }
        if (suggestionSet.size >= 12) break;
      }
      const suggestions = Array.from(suggestionSet).slice(0, 12);
      return NextResponse.json({ reply: finalReply, results: retrieved.items.slice(0, 6), suggestions });
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


