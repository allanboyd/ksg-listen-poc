import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from "recharts";
import { campuses, trafficSeries } from "../data/mockData";

// Section Title Component
export function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  const now = () => new Date().toLocaleTimeString();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-2xl bg-blue-50">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="text-xs text-muted-foreground hidden md:block">Updated: {now()}</div>
    </div>
  );
}

// Stat Component
export function Stat({ icon: Icon, label, value, hint, tone = "blue" }: { 
  icon: any; 
  label: string; 
  value: string; 
  hint?: string; 
  tone?: "blue" | "green" | "amber" | "red" | "violet" 
}) {
  const toneMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-800",
    red: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
  };
  
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow border-0 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${toneMap[tone]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
            <div className="text-3xl font-bold text-gray-900 leading-tight">{value}</div>
            {hint && <div className="text-sm text-gray-500 mt-1">{hint}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Ticket Row Component
export function TicketRow({ t }: { t: any }) {
  return (
    <div className="grid grid-cols-12 gap-3 text-sm items-center py-2 hover:bg-muted/50 rounded-xl px-2">
      <div className="col-span-2 font-medium">{t.id}</div>
      <div className="col-span-2"><Badge variant="secondary">{t.campus}</Badge></div>
      <div className="col-span-2 flex items-center gap-1"><MessageCircle className="w-4 h-4" />{t.channel}</div>
      <div className="col-span-2">
        <Badge className={t.priority === "Critical" ? "bg-rose-600" : t.priority === "High" ? "bg-amber-500" : "bg-emerald-600"}>
          {t.priority}
        </Badge>
      </div>
      <div className="col-span-2">{t.status}</div>
      <div className="col-span-2">{t.title}</div>
    </div>
  );
}

// Heat Map Component
export function HeatMap() {
  const criticals = { Nairobi: 2, Mombasa: 0, Baringo: 1, Embu: 1, Matuga: 0 };
  
  return (
    <div className="grid grid-cols-5 gap-4">
      {campuses.map((c, i) => (
        <div key={c.id} className="rounded-2xl p-4 border bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">{c.name}</div>
            <Badge variant="outline" className="flex items-center gap-1"><MapPin className="w-3 h-3" />{i + 1}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className={`w-3 h-3 rounded ${criticals[c.name as keyof typeof criticals] ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
            <div className="text-xs">{criticals[c.name as keyof typeof criticals] || 0}</div>
          </div>
          <div className="mt-3">
            <button className="w-full px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-xl">Open Dashboard</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Channel Traffic Chart Component
export function ChannelTrafficChart() {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trafficSeries} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <RTooltip />
          <Area type="monotone" dataKey="whatsapp" stackId="1" fill="#22c55e66" stroke="#22c55e" />
          <Area type="monotone" dataKey="ussd" stackId="1" fill="#0ea5e966" stroke="#0ea5e9" />
          <Area type="monotone" dataKey="web" stackId="1" fill="#f9731666" stroke="#f97316" />
          <Area type="monotone" dataKey="kiosk" stackId="1" fill="#a78bfa66" stroke="#8b5cf6" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Sentiment Pie Component
export function SentimentPie({ data }: { data: any }) {
  const total = data.positive + data.neutral + data.negative;
  const pie = [
    { name: "Positive", value: data.positive },
    { name: "Neutral", value: data.neutral },
    { name: "Negative", value: data.negative },
  ];
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-44 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pie} dataKey="value" nameKey="name" outerRadius={80} label>
              <Cell fill="#22c55e" />
              <Cell fill="#94a3b8" />
              <Cell fill="#ef4444" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm">
        <div className="font-medium">Total Mentions: {total}</div>
        <div className="text-muted-foreground">Across X, Facebook, Instagram, forums, and campus pages</div>
      </div>
    </div>
  );
}
