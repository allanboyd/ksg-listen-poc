"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, AlertTriangle, MessageSquare, Calendar, Globe, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

type ChatItem = { id: string; me: string; ai?: string };

const PROMPTS = [
  "Find upcoming trainings this month",
  "Ask about venue or trainer for a course",
  "Share feedback about a completed training",
  "How do I register via USSD (*727#)?",
  "Is there a course on leadership next quarter?",
];

export default function AssistantPage() {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [items, setItems] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<"ok"|"fail"|"">("");
  const [anonymous, setAnonymous] = useState(true);
  const suggestions = useMemo(() => PROMPTS.filter(p=>p.toLowerCase().includes(text.toLowerCase()) || !text).slice(0,5), [text]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    fetch("/api/ai/health").then(r=>r.json()).then(d=>setHealth(d.ok?"ok":"fail")).catch(()=>setHealth("fail"));
  },[]);

  useEffect(()=>{
    // Auto-scroll to bottom when new messages arrive
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [items, loading]);

  async function send() {
    if (!text.trim()) return;
    const me = text;
    const id = crypto.randomUUID();
    setText("");
    setItems((arr) => [...arr, { id, me }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: me }) });
      const data = await res.json().catch(()=>({}));
      const ai = data.reply || data.error || (!res.ok ? `API error: ${res.status}` : "No response received");
      setItems((arr) => arr.map(m => m.id === id ? { ...m, ai } : m));
      // Auto alert admins on urgent text
      if (/\burgent\b|\bemergency\b|\bcritical\b/i.test(me)) {
        fetch("/api/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Urgent user message", message: me, priority: "urgent" }) });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setItems((arr) => arr.map(m => m.id === id ? { ...m, ai: error instanceof Error ? error.message : "Failed to send message" } : m));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-teal-50 to-white flex flex-col">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-[360px] h-[360px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.6),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.55),transparent_60%)]" />

      {/* Back button (no navbar) */}
      <Link href="/" className="absolute top-4 left-4 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md bg-gradient-to-tr from-[#7F632C] to-[#f59e0b] hover:opacity-95">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      {/* Floating title and auth buttons */}
      <div className="pointer-events-none absolute top-4 left-0 right-0 z-50 flex items-center justify-center">
        <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border shadow-sm">
          <span className="text-sm font-semibold text-gray-900">KSG Assistant</span>
        </div>
      </div>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {session?.user ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#7F632C] text-white flex items-center justify-center text-xs font-bold">
              {(session.user.name || session.user.email || 'U').slice(0,1).toUpperCase()}
            </div>
            <div className="hidden sm:block text-xs text-gray-800 max-w-[160px] truncate">{session.user.name || session.user.email}</div>
          </div>
        ) : (
          <>
            <Link href="/signin" className="px-3 py-1.5 rounded-md text-white text-xs bg-[#7F632C] hover:bg-[#6a5425]">Sign in</Link>
            <Link href="/signup" className="px-3 py-1.5 rounded-md text-[#7F632C] text-xs border border-[#7F632C] bg-white hover:bg-[#7F632C]/5">Sign up</Link>
          </>
        )}
      </div>

      {/* Content area: messages */}
      <div className="w-full flex-1 px-4 pt-6 pb-28 flex justify-center">
      <div className="max-w-6xl w-full">
      {/* Greeting */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Hello, {`Guest`}</h1>
        <p className="text-gray-600">How can I help you today?</p>
      </div>

      {/* Explore ideas and messages */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <div className="text-xs uppercase tracking-wide text-gray-500">Explore new ideas</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {PROMPTS.slice(0,3).map((p,i)=> (
              <motion.button key={i} whileHover={{y:-3}} onClick={()=>setText(p)} className="rounded-xl border bg-white p-3 text-left shadow-sm">
                <div className="text-sm font-medium mb-2">{p}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><MessageSquare className="w-4 h-4"/>Prompt</div>
              </motion.button>
            ))}
          </div>

          {/* Messages scroller */}
          <div ref={scrollerRef} className="mt-6 space-y-3 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-1">
            {items.map((it, i) => (
              <div key={i} className="rounded-xl border bg-white p-3">
                <div className="text-sm"><span className="font-medium">You:</span> {it.me}</div>
                {it.ai && <div className="text-sm mt-2"><span className="font-medium">Assistant:</span> {it.ai}</div>}
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Thinking…</div>}
          </div>
        </div>
        <aside className="space-y-3">
          <div className="rounded-xl border p-3 bg-white text-sm flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-red-500 mt-0.5"/> Mark messages as urgent to alert admins automatically.</div>
          <div className="rounded-xl border p-3 bg-white text-sm flex items-start gap-2"><Calendar className="w-4 h-4 text-[#7F632C] mt-0.5"/> Pulls details from the training calendar PDF and the KSG site when available.</div>
          <div className="rounded-xl border p-3 bg-white text-sm flex items-start gap-2"><Globe className="w-4 h-4 text-[#7F632C] mt-0.5"/> Try: “Find a leadership course next month in Nairobi”.</div>
        </aside>
      </div>
      </div>
      </div>

      {/* Floating input and suggestions at bottom (not fixed) */}
      <div className="w-full px-4 pb-10 flex justify-center">
        <div className="max-w-6xl w-full">
        {/* Brand-styled input (no card wrapper) */}
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 bg-[#7F632C]/5 border border-[#7F632C]/30 shadow-sm">
          <MessageSquare className="w-5 h-5 text-[#7F632C]" />
          <input className="flex-1 outline-none py-3 text-base bg-transparent placeholder:text-[#7F632C]/60" placeholder="Type a message and press Enter" value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); send(); }}} />
          <span className={`text-xs px-2 py-1 rounded-full ${health==='ok'?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>{health==='ok'? 'Gemini · Ready' : 'AI · Error'}</span>
          <button onClick={send} disabled={loading} className="ml-2 inline-flex items-center gap-1 px-5 py-3 rounded-md text-white bg-gradient-to-r from-[#7F632C] to-[#f59e0b] hover:from-[#6a5425] hover:to-[#d97706] disabled:opacity-50"><Send className="w-4 h-4"/>Send</button>
        </div>

        {/* Suggestions row with brand colors; center highlighted */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {[
            { text: "Upcoming trainings", cls: "bg-amber-100 text-amber-800" },
            { text: "Venue/trainer info", cls: "bg-teal-100 text-teal-800" },
            { text: "Share feedback", cls: "bg-gradient-to-r from-[#7F632C] to-[#f59e0b] text-white px-4 py-2" },
            { text: "Register via USSD", cls: "bg-emerald-100 text-emerald-800" },
            { text: "Leadership courses", cls: "bg-orange-100 text-orange-800" },
          ].map((chip, i) => (
            <button key={i} onClick={()=>setText(chip.text)} className={`text-sm px-3 py-1 rounded-full hover:opacity-90 ${chip.cls}`}>{chip.text}</button>
          ))}
        </div>
        </div>
      </div>
    </main>
  );
}


