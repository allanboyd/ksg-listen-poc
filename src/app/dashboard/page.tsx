"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Headphones, Bot, Globe2, MapPin, Clock, Radar, Shield, PlusCircle, Sparkles, Wifi, Users, Settings, Bell, ChevronDown, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { campuses, sampleTickets, currentUser, sentimentByCampus } from "@/data/mockData";
import { SectionTitle, Stat, TicketRow, HeatMap, ChannelTrafficChart, SentimentPie } from "@/components";
import AlertsWidget from "./AlertsWidget";

export default function Dashboard() {
  const { data: session } = useSession();
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("overview");
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [enterpriseMode, setEnterpriseMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [engagementMode] = useState("Proactive");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketItems, setTicketItems] = useState<any[]>([]);
  const [tTitle, setTTitle] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tCampus, setTCampus] = useState("Nairobi");
  const [tCategory, setTCategory] = useState("feedback");
  const [tPriority, setTPriority] = useState("Medium");
  const [tLocation, setTLocation] = useState("");

  const L = useMemo(() => {
    const t: Record<string, any> = {
      en: {
        title: "KSG LISTEN — Conversation & Listening Command",
        sub: "Unified student feedback, omni-channel intake, AI routing, and social listening for Kenya School of Government.",
        search: "Search tickets, agents, knowledge...",
        actions: { newTicket: "Log Ticket", simulate: "Simulate Spike", connect: "Connect Channel" },
      },
      sw: {
        title: "KSG LISTEN — Dawati la Mazungumzo & Usikilizaji",
        sub: "Mawasiliano ya wanafunzi, njia nyingi za kupokea ujumbe, upangaji wa AI, na usikilizaji wa mitandao ya kijamii.",
        search: "Tafuta tiketi, mawakala, maarifa...",
        actions: { newTicket: "Ongeza Tiketi", simulate: "Jaribu Msongamano", connect: "Unganisha Njia" },
      },
    };
    return t[lang];
  }, [lang]);

  React.useEffect(()=>{
    fetch("/api/tickets").then(r=>r.json()).then(d=>{
      if (Array.isArray(d.items)) setTicketItems(d.items);
    }).catch(()=>{});
  },[]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50 via-teal-50 to-white">
      {/* ambient blobs to match Assistant */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.6),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.55),transparent_60%)]" />
      <header className="sticky top-0 z-40 border-b bg-gradient-to-r from-[#fffaf3] via-[#f7f7f7] to-[#f4fbfb] backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7F632C] to-[#f28224] flex items-center justify-center text-white font-bold text-lg">KL</div>
            <div>
              <div className="font-semibold text-gray-900">{L.title}</div>
              <div className="text-xs text-gray-500">{L.sub}</div>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#7F632C]/10 text-[#7F632C] hover:bg-[#7F632C]/15">
              <Bell className="w-4 h-4" />
            </button>
            <a href="/assistant" className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#7F632C] to-[#f59e0b] text-white hover:opacity-95" title="KSG Assistant">
              <MessageSquare className="w-4 h-4" />
            </a>
            <button className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#7F632C]/10 text-[#7F632C] hover:bg-[#7F632C]/15">
              <Settings className="w-4 h-4" />
            </button>
            <div className="relative">
              <button onClick={()=>setMenuOpen(v=>!v)} className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border bg-white hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-[#7F632C] text-white flex items-center justify-center font-bold">
                  {(session?.user?.name || session?.user?.email || 'U').slice(0,1).toUpperCase()}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-lg p-3">
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <div className="w-10 h-10 rounded-full bg-[#7F632C] text-white flex items-center justify-center font-bold">
                      {(session?.user?.name || session?.user?.email || 'U').slice(0,1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{session?.user?.name || 'User'}</div>
                      <div className="text-xs text-gray-500 truncate">{session?.user?.email || '—'}</div>
                    </div>
                  </div>
                  <div className="py-2 space-y-1">
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm">Profile</button>
                    <button onClick={()=>signOut({ callbackUrl: '/signin' })} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm text-red-600">Logout</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Stat icon={MessageSquare} label="Open Tickets" value="42" hint="Across 5 campuses" tone="blue" />
          <Stat icon={Clock} label="Avg. SLA" value="3h 12m" hint="Down 18% WoW" tone="amber" />
          <Stat icon={Radar} label="Live Mentions (social)" value="127" hint="Last 60 min" tone="violet" />
          <Stat icon={Shield} label="Escalations (24h)" value="3" hint="All resolved" tone="green" />
        </div>

        <Card className="rounded-2xl shadow-lg border border-[#7F632C]/20 bg-white/90 backdrop-blur">
          <CardContent className="p-0">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full p-2 bg-white/80 backdrop-blur border-b rounded-t-2xl flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                <TabsTrigger className="text-[#7F632C] data-[state=active]:bg-[#7F632C] data-[state=active]:text-white" value="overview">Overview</TabsTrigger>
                <TabsTrigger className="text-[#7F632C] data-[state=active]:bg-[#7F632C] data-[state=active]:text-white" value="tickets">Tickets</TabsTrigger>
                <TabsTrigger className="text-[#7F632C] data-[state=active]:bg-[#7F632C] data-[state=active]:text-white" value="channels">Channels</TabsTrigger>
                <TabsTrigger className="text-[#7F632C] data-[state=active]:bg-[#7F632C] data-[state=active]:text-white" value="staff">Staff</TabsTrigger>
                <TabsTrigger className="text-[#7F632C] data-[state=active]:bg-[#7F632C] data-[state=active]:text-white" value="listening">Social Listening</TabsTrigger>
                <TabsTrigger className="text-[#7F632C] data-[state=active]:bg-[#7F632C] data-[state=active]:text-white" value="analytics">Analytics</TabsTrigger>
                <TabsTrigger className="text-[#7F632C] data-[state=active]:bg-[#7F632C] data-[state=active]:text-white" value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6 grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-6">
                  <SectionTitle icon={Globe2} title="Omni-Channel Traffic" subtitle="Real-time intake across WhatsApp, USSD, Web, and Kiosks" />
                  <Card className="rounded-2xl"><CardContent className="p-4"><ChannelTrafficChart /></CardContent></Card>
                  <SectionTitle icon={MapPin} title="Campus Heatmap" subtitle="Critical incidents pulsing by location" />
                  <Card className="rounded-2xl"><CardContent className="p-4"><HeatMap /></CardContent></Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <SectionTitle icon={Bot} title="Conversational Brain" subtitle="Learning & recommendations" />
                  <Card className="rounded-2xl">
                    <CardContent className="p-4 space-y-3">
                      <div className="text-sm text-muted-foreground">The agent learns from resolved tickets and social posts to recommend faster fixes and proactive notices.</div>
                      <div className="flex items-center justify-between text-sm"><div>Auto-escalation</div><Switch checked={autoEscalate} onCheckedChange={setAutoEscalate} /></div>
                      <div className="flex items-center justify-between text-sm"><div>Enterprise mode</div><Switch checked={enterpriseMode} onCheckedChange={setEnterpriseMode} /></div>
                      <Separator className="my-2" />
                      <div className="text-xs font-medium">Next best actions</div>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>Send cafeteria notice to Nairobi (veg options update)</li>
                        <li>Dispatch technician: Hall A AC unit</li>
                        <li>Safety drill SMS to Embu due to recent spike</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <SectionTitle icon={Headphones} title="Live Queue" subtitle="Newest issues across campuses" />
                  <Card className="rounded-2xl"><CardContent className="p-2">{sampleTickets.map((t:any)=>(<TicketRow key={t.id} t={t}/>))}</CardContent></Card>
                  <AlertsWidget />
                </div>
              </TabsContent>

              <TabsContent value="tickets" className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <SectionTitle icon={MessageSquare} title="Tickets & SLAs" subtitle="Assign, triage, collaborate" />
                  <Button onClick={()=>setShowTicketModal(true)} className="bg-[#7F632C] hover:bg-[#6b5424] text-white"><PlusCircle className="w-4 h-4 mr-2"/>Create Ticket</Button>
                </div>
                <Card className="rounded-2xl border border-[#7F632C]/20">
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#7F632C]/5 text-[#7F632C]">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">ID</th>
                          <th className="text-left px-4 py-3 font-medium">Title</th>
                          <th className="text-left px-4 py-3 font-medium">Location</th>
                          <th className="text-left px-4 py-3 font-medium">Campus</th>
                          <th className="text-left px-4 py-3 font-medium">Category</th>
                          <th className="text-left px-4 py-3 font-medium">Priority</th>
                          <th className="text-left px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(ticketItems.length? ticketItems : sampleTickets).map((t:any)=> (
                          <tr key={t.id} className="border-t">
                            <td className="px-4 py-3">{t.id}</td>
                            <td className="px-4 py-3">{t.title}</td>
                            <td className="px-4 py-3">{t.location || '-'}</td>
                            <td className="px-4 py-3">{t.campus}</td>
                            <td className="px-4 py-3">{t.category}</td>
                            <td className="px-4 py-3"><Badge className="bg-amber-600">{t.priority}</Badge></td>
                            <td className="px-4 py-3"><Badge className="bg-emerald-600">{t.status || 'Open'}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {showTicketModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg">
                      <div className="flex items-center justify-between px-5 py-4 border-b">
                        <div className="text-lg font-semibold">Create Ticket</div>
                        <button onClick={()=>setShowTicketModal(false)} className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-4 h-4"/></button>
                      </div>
                      <div className="p-5 space-y-3">
                        <Input className="bg-white text-gray-900 placeholder:text-gray-400" placeholder="Title" value={tTitle} onChange={e=>setTTitle(e.target.value)} />
                        <Input className="bg-white text-gray-900 placeholder:text-gray-400" placeholder="Location (e.g., Nairobi Campus, Hall A)" value={tLocation} onChange={e=>setTLocation(e.target.value)} />
                        <Select value={tCampus} onValueChange={setTCampus}><SelectTrigger className="bg-white text-gray-900"><SelectValue placeholder="Campus" /></SelectTrigger><SelectContent>{campuses.map((c:any)=>(<SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>))}</SelectContent></Select>
                        <Select value={tCategory} onValueChange={setTCategory}><SelectTrigger className="bg-white text-gray-900"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{['feedback','inquiry','question'].map(x=>(<SelectItem key={x} value={x}>{x}</SelectItem>))}</SelectContent></Select>
                        <Select value={tPriority} onValueChange={setTPriority}><SelectTrigger className="bg-white text-gray-900"><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent>{['Low','Medium','High','Critical'].map(x=>(<SelectItem key={x} value={x}>{x}</SelectItem>))}</SelectContent></Select>
                        <Textarea className="bg-white text-gray-900 placeholder:text-gray-400" placeholder="Describe the issue..." value={tDesc} onChange={e=>setTDesc(e.target.value)} />
                      </div>
                      <div className="px-5 py-4 border-t flex items-center justify-end gap-2">
                        <Button variant="outline" onClick={()=>setShowTicketModal(false)}>Cancel</Button>
                        <Button onClick={async()=>{
                          const res = await fetch('/api/tickets', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: tTitle, campus: tCampus, category: tCategory, priority: tPriority, description: tDesc, location: tLocation }) });
                          if(res.ok){ setShowTicketModal(false); setTTitle(''); setTDesc(''); setTLocation(''); const d = await fetch('/api/tickets').then(r=>r.json()).catch(()=>({items:[]})); setTicketItems(d.items||[]);}  
                        }} className="bg-[#7F632C] hover:bg-[#6b5424] text-white">Create</Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="channels" className="p-6 space-y-4">
                <SectionTitle icon={Globe2} title="Channel Management" subtitle="Configure communication channels" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="rounded-2xl"><CardHeader><CardTitle>Connected Channels</CardTitle></CardHeader><CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><Wifi className="w-4 h-4" />WhatsApp API</div><Badge className="bg-emerald-600">Active</Badge></div>
                    <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><Wifi className="w-4 h-4" />USSD Gateway</div><Badge className="bg-emerald-600">Active</Badge></div>
                    <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><Wifi className="w-4 h-4" />Web Portal</div><Badge className="bg-emerald-600">Active</Badge></div>
                    <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><Wifi className="w-4 h-4" />Kiosk System</div><Badge className="bg-emerald-600">Active</Badge></div>
                  </CardContent></Card>
                  <Card className="rounded-2xl"><CardHeader><CardTitle>Channel Stats (24h)</CardTitle></CardHeader><CardContent className="space-y-2">
                    <div className="text-sm">WhatsApp: 1,234 messages</div>
                    <div className="text-sm">USSD: 567 sessions</div>
                    <div className="text-sm">Web: 890 tickets</div>
                    <div className="text-sm">Kiosk: 234 interactions</div>
                  </CardContent></Card>
                </div>
              </TabsContent>

              <TabsContent value="staff" className="p-6 space-y-4">
                <SectionTitle icon={Users} title="Staff Management" subtitle="Monitor and manage KSG staff" />
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Amina E.", role: "Supervisor", active: true, tickets: 12 },
                    { name: "J. Mwangi", role: "Technician", active: true, tickets: 8 },
                    { name: "A. Otieno", role: "Support", active: true, tickets: 15 }
                  ].map((agent: any, i: number) => (
                    <Card key={i} className="rounded-2xl border border-[#7F632C]/20"><CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7F632C] to-[#f28224] text-white flex items-center justify-center font-bold">{agent.name.split(' ').map((n: string) => n[0]).join('')}</div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">{agent.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Active Tickets</span>
                        <Badge className="bg-[#7F632C] text-white">{agent.tickets}</Badge>
                      </div>
                    </CardContent></Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="listening" className="p-6 space-y-4">
                <SectionTitle icon={Radar} title="Social Listening" subtitle="Monitor campus sentiment across platforms" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="rounded-2xl"><CardHeader><CardTitle>Sentiment Overview</CardTitle></CardHeader><CardContent>
                    <SentimentPie data={sentimentByCampus[0]} />
                  </CardContent></Card>
                  <Card className="rounded-2xl"><CardHeader><CardTitle>By Campus</CardTitle></CardHeader><CardContent className="space-y-3">
                    {sentimentByCampus.map((s: any) => (
                      <div key={s.name} className="flex items-center justify-between text-sm">
                        <div className="font-medium">{s.name}</div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-emerald-600">+{s.positive}%</Badge>
                          <Badge variant="outline" className="text-rose-600">-{s.negative}%</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent></Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="p-6 space-y-4">
                <SectionTitle icon={Radar} title="Analytics & Reporting" subtitle="Performance metrics and insights" />
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="rounded-2xl"><CardHeader><CardTitle>Response Time</CardTitle></CardHeader><CardContent>
                    <div className="text-3xl font-bold text-emerald-600">2h 15m</div>
                    <div className="text-sm text-muted-foreground mt-2">Avg response time (↓ 12% vs last week)</div>
                  </CardContent></Card>
                  <Card className="rounded-2xl"><CardHeader><CardTitle>Resolution Rate</CardTitle></CardHeader><CardContent>
                    <div className="text-3xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-muted-foreground mt-2">Tickets resolved within SLA</div>
                  </CardContent></Card>
                  <Card className="rounded-2xl"><CardHeader><CardTitle>CSAT Score</CardTitle></CardHeader><CardContent>
                    <div className="text-3xl font-bold text-amber-600">4.6</div>
                    <div className="text-sm text-muted-foreground mt-2">Out of 5 stars</div>
                  </CardContent></Card>
                </div>
                <Card className="rounded-2xl"><CardHeader><CardTitle>Performance Trends</CardTitle></CardHeader><CardContent>
                  <div className="h-56 text-center text-muted-foreground flex items-center justify-center">Chart visualization coming soon</div>
                </CardContent></Card>
              </TabsContent>

              

              <TabsContent value="settings" className="p-6 space-y-4">
                <SectionTitle icon={Settings} title="Settings" subtitle="System and application preferences" />
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-1"><CardTitle>General</CardTitle></CardHeader>
                    <CardContent className="space-y-3 p-4">
                      <div className="text-sm">Default Language</div>
                      <Select defaultValue={lang} onValueChange={setLang}><SelectTrigger className="bg-white text-gray-900"><SelectValue /></SelectTrigger><SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                      </SelectContent></Select>
                      <Separator />
                      <div className="text-sm">Theme</div>
                      <Select defaultValue="system"><SelectTrigger className="bg-white text-gray-900"><SelectValue /></SelectTrigger><SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent></Select>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-1"><CardTitle>Notifications</CardTitle></CardHeader>
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between text-sm"><div>Email Notifications</div><Switch className="data-[state=checked]:bg-[#7F632C] data-[state=unchecked]:bg-gray-300" defaultChecked /></div>
                      <div className="text-sm">Alert Recipients</div>
                      <Input className="bg-white text-gray-900 placeholder:text-gray-400" placeholder="emails separated by commas" />
                      <div className="text-xs text-muted-foreground">Used for high priority alerts.</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-1"><CardTitle>Data & Privacy</CardTitle></CardHeader>
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between text-sm"><div>Maintenance Mode</div><Switch className="data-[state=checked]:bg-[#7F632C] data-[state=unchecked]:bg-gray-300" /></div>
                      <div className="text-sm">Data Retention</div>
                      <Select defaultValue="180"><SelectTrigger className="bg-white text-gray-900"><SelectValue /></SelectTrigger><SelectContent>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent></Select>
                      <Separator />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-xs mt-8 text-gray-500 text-center py-4 border-t border-gray-200">© {new Date().getFullYear()} KSG Listen • Digital Feedback & Customer-Engagement Platform</div>
      </main>
    </div>
  );
}


