"use client";
import { useEffect, useState } from "react";

export default function AlertsWidget(){
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{ fetch('/api/alerts').then(r=>r.json()).then(d=>setItems(d.items||[])); },[]);
  return (
    <div className="rounded-2xl border p-3 bg-white">
      <div className="font-semibold mb-2">Urgent queue</div>
      <div className="space-y-2 text-sm">
        {items.length===0 && <div className="text-gray-500">No urgent alerts.</div>}
        {items.map(i=> (
          <div key={i.id} className="flex items-center justify-between px-2 py-1 rounded bg-rose-50">
            <div className="truncate max-w-[70%]">{i.title || i.message || 'Urgent event'}</div>
            <div className="text-xs text-rose-700">{new Date(i.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}




