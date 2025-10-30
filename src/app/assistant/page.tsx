"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, AlertTriangle, MessageSquare, Calendar, Globe, ArrowLeft, Menu, Mic } from "lucide-react";
import { useSession } from "next-auth/react";

type ChatItem = { id: string; me: string; ai?: string };
type Mode = "menu" | "inquiry" | "info" | "feedback";

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
  const [mode, setMode] = useState<Mode>("menu");
  const [feedback, setFeedback] = useState({ title: "", campus: "", priority: "Normal", location: "" });
  const [feedbackFlow, setFeedbackFlow] = useState<{ active: boolean; step: "idle"|"askFeedback"|"askCampus"|"askAnonymous"; pending: { title: string; campus: string } }>({ active: false, step: "idle", pending: { title: "", campus: "" } });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const suggestions = useMemo(() => PROMPTS.filter(p=>p.toLowerCase().includes(text.toLowerCase()) || !text).slice(0,5), [text]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [centerMessages, setCenterMessages] = useState(true);

  useEffect(()=>{
    fetch("/api/ai/health").then(r=>r.json()).then(d=>setHealth(d.ok?"ok":"fail")).catch(()=>setHealth("fail"));
  },[]);

  useEffect(()=>{
    // Auto-scroll to bottom when new messages arrive
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [items, loading]);

  useEffect(()=>{
    const el = scrollerRef.current;
    if (!el) return;
    const check = () => {
      const client = el.clientHeight || 1;
      const scroll = el.scrollHeight || 1;
      setCenterMessages(scroll < client * 0.8);
    };
    check();
    const RO = (window as any).ResizeObserver;
    const ro = RO ? new RO(check) : null;
    if (ro) ro.observe(el);
    const id = window.setInterval(check, 300);
    return () => { if (ro) ro.disconnect(); window.clearInterval(id); };
  }, [items]);

  async function send() {
    if (!text.trim()) return;
    const me = text;
    const id = crypto.randomUUID();
    // Feedback keyword quick-start: trigger conversational wizard
    if (!feedbackFlow.active && /\bfeedback\b/i.test(me)) {
      setMode("feedback");
      setFeedbackFlow({ active: true, step: "askFeedback", pending: { title: "", campus: "" } });
      setItems(arr=>[...arr, { id, me }, { id: crypto.randomUUID(), me: "", ai: "Please provide your feedback details." }]);
      setText("");
      return;
    }

    // Conversational feedback flow handling
    if (feedbackFlow.active) {
      // capture current answer and prompt next
      if (feedbackFlow.step === "askFeedback") {
        const title = me.trim();
        // detect campus keywords
        const campusMap: Record<string,string> = { nairobi: "nairobi", mombasa: "mombasa", baringo: "baringo", embu: "embu", matuga: "matuga" };
        const found = Object.keys(campusMap).find(k => new RegExp(`\\b${k}\\b`, 'i').test(title));
        const campus = found ? campusMap[found] : "";
        const msgs: ChatItem[] = [{ id, me }];
        if (!campus) {
          msgs.push({ id: crypto.randomUUID(), me: "", ai: "Please provide the campus (Nairobi, Mombasa, Baringo, Embu, or Matuga)." });
          setItems(arr=>[...arr, ...msgs]);
          setFeedbackFlow({ active: true, step: "askCampus", pending: { title, campus: "" } });
          setText("");
          return;
        } else {
          msgs.push({ id: crypto.randomUUID(), me: "", ai: "Would you like to submit the feedback anonymously? (yes/no)" });
          setItems(arr=>[...arr, ...msgs]);
          setFeedbackFlow({ active: true, step: "askAnonymous", pending: { title, campus } });
          setText("");
          return;
        }
      }

      if (feedbackFlow.step === "askCampus") {
        const campus = me.trim();
        setItems(arr=>[...arr, { id, me }, { id: crypto.randomUUID(), me: "", ai: "Would you like to submit the feedback anonymously? (yes/no)" }]);
        setFeedbackFlow(prev => ({ active: true, step: "askAnonymous", pending: { title: prev.pending.title, campus } }));
        setText("");
        return;
      }

      if (feedbackFlow.step === "askAnonymous") {
        const yes = /\b(yes|y)\b/i.test(me);
        const no = /\b(no|n)\b/i.test(me);
        setItems(arr=>[...arr, { id, me }]);
        setLoading(true);
        try {
          if (!yes && !no) {
            setItems(arr=>[...arr, { id: crypto.randomUUID(), me: "", ai: "Please answer yes or no. Would you like to submit anonymously?" }]);
            return;
          }
          const doAnon = yes;
          const payload = { title: feedbackFlow.pending.title, campus: feedbackFlow.pending.campus, priority: "Normal", location: "", anonymous: doAnon };
          const res = await fetch('/api/assistant/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const ok = res.ok;
          setItems(arr=>[...arr, { id: crypto.randomUUID(), me: "", ai: ok ? (doAnon ? "Your ticket has been saved successfully (anonymous)." : "Your ticket has been saved successfully.") : "Failed to submit feedback. Please try again." }]);
          // Reset flow
          setFeedbackFlow({ active: false, step: "idle", pending: { title: "", campus: "" } });
          if (ok) setFeedbackSubmitted(true);
        } finally {
          setLoading(false);
          setText("");
        }
        return;
      }
    }

    // (Numeric menu inputs removed)
    setText("");
    setItems((arr) => [...arr, { id, me }]);
    setLoading(true);
    try {
      const modeParam = mode === "inquiry" ? "docs" : mode === "info" ? "website" : "combined";
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: me, mode: modeParam }) });
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

      {/* Top header toolbar */}
      <div className="z-50 w-full px-4 pt-4 relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md bg-gradient-to-tr from-[#7F632C] to-[#f59e0b] hover:opacity-95">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border shadow-sm">
              <span className="text-sm font-semibold text-gray-900">KSG Assistant</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-xs bg-gradient-to-r from-[#7F632C] to-[#f59e0b] hover:opacity-95">Dashboard</Link>
            {session?.user ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#7F632C] text-white flex items-center justify-center text-xs font-bold">
                  {(session.user.name || session.user.email || 'U').slice(0,1).toUpperCase()}
                </div>
                <div className="hidden sm:block text-xs text-gray-800 max-w-[160px] truncate">{session.user.name || session.user.email}</div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/signin" className="px-3 py-1.5 rounded-md text-white text-xs bg-[#7F632C] hover:bg-[#6a5425]">Sign in</Link>
                <Link href="/signup" className="px-3 py-1.5 rounded-md text-[#7F632C] text-xs border border-[#7F632C] bg-white hover:bg-[#7F632C]/5">Sign up</Link>
              </div>
            )}
            {/* Mobile menu toggle */}
            <button
              aria-label="Open menu"
              onClick={()=>setMenuOpen(v=>!v)}
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md bg-gradient-to-tr from-[#7F632C] to-[#f59e0b] hover:opacity-95"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="sm:hidden absolute left-0 right-0 top-16 px-4">
            <div className="max-w-6xl mx-auto rounded-xl border bg-white shadow-md overflow-hidden">
              <a href="/dashboard" onClick={()=>setMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50">Dashboard</a>
              {session?.user ? (
                <div className="border-t px-4 py-3 space-y-1 text-sm">
                  <div className="font-medium">{session.user.name || session.user.email}</div>
                  <div className="text-gray-500">{session.user.email}</div>
                </div>
              ) : (
                <>
                  <a href="/signin" onClick={()=>setMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 border-t">Sign in</a>
                  <a href="/signup" onClick={()=>setMenuOpen(false)} className="block px-4 py-3 hover:bg-gray-50 border-t">Sign up</a>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content area: messages (scrolls within the screen) */}
      <div className="w-full flex-1 px-4 pt-6 pb-4 flex justify-center overflow-y-auto">
      <div className="max-w-6xl w-full">
      {/* Greeting */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Hello, {`Guest`}</h1>
        <p className="text-gray-600">How can I help you today?</p>
      </div>

      {/* Explore ideas and messages */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3 flex flex-col min-h-[60vh]">
          <div className="hidden sm:block">
            <div className="text-xs uppercase tracking-wide text-gray-500">Explore new ideas</div>
            <div className="grid sm:grid-cols-3 gap-3 mt-2">
              {PROMPTS.slice(0,3).map((p,i)=> (
                <motion.button key={i} whileHover={{y:-3}} onClick={()=>setText(p)} className="rounded-xl border bg-white p-3 text-left shadow-sm">
                  <div className="text-sm font-medium mb-2">{p}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1"><MessageSquare className="w-4 h-4"/>Prompt</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Messages scroller (centers when short; pushes up as it grows) */}
          <div
            ref={scrollerRef}
            className={`mt-6 pr-1 ${centerMessages ? 'flex flex-col justify-center space-y-3' : 'space-y-3'}`}
          >
            {items.map((it, i) => (
              <div key={i} className="space-y-2">
                {it.me && (
                  <div className="relative rounded-xl border p-5 min-h-16 bg-[#7F632C]/5">
                    <div className="text-sm"><span className="font-medium">You:</span> {it.me}</div>
                  </div>
                )}
                {it.ai && (
                  <div className="relative rounded-xl border p-5 min-h-16 bg-white">
                    <div className="text-sm"><span className="font-medium">Assistant:</span> {it.ai}</div>
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Thinking…</div>}
          </div>
          {mode === "feedback" && !feedbackSubmitted && (
            <div className="mt-6 rounded-xl border bg-white p-5 space-y-3">
              <div className="text-sm font-medium">Create feedback ticket</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="border rounded-md px-3 py-2 text-sm" placeholder="Feedback" value={feedback.title} onChange={(e)=>setFeedback(f=>({...f,title:e.target.value}))} />
                <input className="border rounded-md px-3 py-2 text-sm" placeholder="Campus" value={feedback.campus} onChange={(e)=>setFeedback(f=>({...f,campus:e.target.value}))} />
                <select className="border rounded-md px-3 py-2 text-sm" value={feedback.priority} onChange={(e)=>setFeedback(f=>({...f,priority:e.target.value}))}>
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
                <input className="border rounded-md px-3 py-2 text-sm" placeholder="Location (optional)" value={feedback.location} onChange={(e)=>setFeedback(f=>({...f,location:e.target.value}))} />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm inline-flex items-center gap-2">
                  <input type="checkbox" checked={anonymous} onChange={(e)=>setAnonymous(e.target.checked)} /> Submit anonymously
                </label>
                {!anonymous && !session?.user && (
                  <span className="text-xs text-red-600">Sign in required to submit as a user.</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async ()=>{
                    if (!feedback.title || !feedback.campus || !feedback.priority) return;
                    setLoading(true);
                    try {
                      const res = await fetch('/api/assistant/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...feedback, anonymous }) });
                      const ok = res.ok;
                      setItems(arr=>[...arr, { id: crypto.randomUUID(), me: 'Create feedback ticket', ai: ok ? 'Your feedback was submitted. Thank you.' : 'Failed to submit feedback.' }]);
                      if (ok) { setFeedback({ title: '', campus: '', priority: 'Normal', location: '' }); setFeedbackSubmitted(true); }
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-[#7F632C] to-[#f59e0b] disabled:opacity-50"
                  disabled={loading || (!anonymous && !session?.user)}
                >Submit</button>
                <button onClick={()=>setMode('menu')} className="px-4 py-2 rounded-md border">Back</button>
              </div>
            </div>
          )}
        </div>
        <aside className="space-y-3 hidden sm:block">
          <div className="rounded-xl border p-3 bg-white text-sm flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-red-500 mt-0.5"/> Mark messages as urgent to alert admins automatically.</div>
          <div className="rounded-xl border p-3 bg-white text-sm flex items-start gap-2"><Calendar className="w-4 h-4 text-[#7F632C] mt-0.5"/> Pulls details from the training calendar PDF and the KSG site when available.</div>
          <div className="rounded-xl border p-3 bg-white text-sm flex items-start gap-2"><Globe className="w-4 h-4 text-[#7F632C] mt-0.5"/> Try: “Find a leadership course next month in Nairobi”.</div>
        </aside>
      </div>
      </div>
      </div>

      {/* Bottom input: pinned by flex layout (does not scroll out) */}
      <div className="w-full px-4 pb-4 flex justify-center">
        <div className="max-w-6xl w-full">
        {/* Brand-styled input (no card wrapper) */}
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 bg-[#7F632C]/5 border border-[#7F632C]/30 shadow-sm">
          <MessageSquare className="w-5 h-5 text-[#7F632C]" />
          <input className="flex-1 outline-none py-3 text-base bg-transparent placeholder:text-[#7F632C]/60" placeholder={'Feedback'} value={text} onChange={(e)=>{
            const v = e.target.value;
            setText(v);
            if (/^\s*hi\s*$/i.test(v) || /^\s*hello\s*$/i.test(v)) setMode('menu');
          }} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); send(); }}} />
          <button type="button" aria-label="Voice input" className="inline-flex items-center justify-center w-10 h-10 rounded-md text-[#7F632C] hover:bg-[#7F632C]/10">
            <Mic className="w-5 h-5" />
          </button>
          <button onClick={send} disabled={loading} className="ml-2 inline-flex items-center gap-1 px-5 py-3 rounded-md text-white bg-gradient-to-r from-[#7F632C] to-[#f59e0b] hover:from-[#6a5425] hover:to-[#d97706] disabled:opacity-50"><Send className="w-4 h-4"/>Send</button>
        </div>

        {/* Suggestions row with brand colors; center highlighted (hidden on mobile) */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 mt-4">
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


