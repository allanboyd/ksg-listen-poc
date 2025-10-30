import fs from "node:fs";
import path from "node:path";
import { chatGemini } from "@/lib/ai";

export type IndexItem = {
  id: string;
  sourceType: "doc" | "website";
  source: string; // filepath or URL
  title: string;
  content: string; // sanitized markdown/text
  summary?: string;
  keywords?: string[];
  updatedAt: number;
};

function ensureDir(p: string) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitize(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^\s*#+\s*/gm, "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function parsePdf(filePath: string): Promise<string> {
  try {
    const mod: any = await import("pdf-parse");
    const pdfParse = mod.default ?? mod;
    const buf = fs.readFileSync(filePath);
    const parsed = await pdfParse(buf);
    return sanitize(parsed.text || "");
  } catch {
    return "";
  }
}

async function parseText(filePath: string): Promise<string> {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return sanitize(raw);
  } catch {
    return "";
  }
}

export async function parseDocs(root: string): Promise<IndexItem[]> {
  const items: IndexItem[] = [];
  if (!fs.existsSync(root)) return items;
  const walk = (dir: string) => {
    const ents = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of ents) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.(pdf|md|markdown|txt)$/i.test(e.name)) {
        const ext = path.extname(e.name).toLowerCase();
        const title = path.basename(e.name, ext);
        items.push({
          id: `doc:${full}`,
          sourceType: "doc",
          source: full,
          title,
          content: "", // fill after read
          updatedAt: Date.now(),
        });
      }
    }
  };
  walk(root);
  for (const it of items) {
    const ext = path.extname(it.source).toLowerCase();
    it.content = /\.pdf$/.test(ext) ? await parsePdf(it.source) : await parseText(it.source);
  }
  return items.filter(i => i.content);
}

export async function fetchWebsite(urls: string[]): Promise<IndexItem[]> {
  const items: IndexItem[] = [];
  for (const u of urls) {
    try {
      const html = await fetch(u).then(r=>r.text());
      const content = sanitize(html).slice(0, 100_000);
      const title = u.replace(/^https?:\/\//, "");
      items.push({ id: `web:${u}`, sourceType: "website", source: u, title, content, updatedAt: Date.now() });
    } catch {}
  }
  return items;
}

export async function enrichWithGemini(items: IndexItem[], apiEnabled: boolean): Promise<IndexItem[]> {
  if (!apiEnabled) return items;
  const out: IndexItem[] = [];
  for (const it of items) {
    try {
      const prompt = `Summarize and extract keywords for KSG knowledge base. Return concise summary (<=120 words) and 5-12 keywords.\n\nTitle: ${it.title}\nContent:\n${it.content.slice(0, 6000)}`;
      const raw = await chatGemini(prompt);
      // naive parse: expect lines like Summary: ... Keywords: a, b, c
      const summaryMatch = /summary\s*[:\-]\s*([\s\S]*?)\bkeywords\b/i.exec(raw) || /([\s\S]{20,300})/i.exec(raw);
      const keywordsMatch = /keywords\s*[:\-]\s*([\s\S]*)$/i.exec(raw);
      const summary = summaryMatch ? summaryMatch[1].trim().slice(0, 800) : undefined;
      const keywords = keywordsMatch ? keywordsMatch[1].split(/[,\n]/).map(s=>s.trim()).filter(Boolean).slice(0, 15) : undefined;
      out.push({ ...it, summary, keywords });
    } catch {
      out.push(it);
    }
  }
  return out;
}

export async function buildIndex(): Promise<IndexItem[]> {
  const docsRoot = path.join(process.cwd(), "public", "docs", "ksg");
  const websiteUrls = ["https://www.ksg.ac.ke/", "https://www.ksg.ac.ke/training/"];
  const [docItems, webItems] = await Promise.all([
    parseDocs(docsRoot),
    fetchWebsite(websiteUrls),
  ]);
  const all = [...docItems, ...webItems];
  const apiEnabled = Boolean(process.env.GEMINI_API_KEY);
  const enriched = await enrichWithGemini(all, apiEnabled);
  const outPath = process.env.KSG_INDEX_PATH || path.join(process.cwd(), "data", "ksg_index.json");
  ensureDir(outPath);
  fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2), "utf8");
  return enriched;
}


