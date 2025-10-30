"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, AlertTriangle, BarChart3, Bell, TrendingUp, Smartphone, Globe, QrCode, Phone, Shield, Users, Clock, CheckCircle, ArrowRight, Zap, Target, Lock, FileText } from "lucide-react";

export default function Landing(){
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7F632C] to-[#f28224] flex items-center justify-center text-white font-bold text-lg">KL</div>
            <span className="text-xl font-bold text-gray-900">KSG LISTEN</span>
          </div>
          <div className="flex gap-2">
            <Link href="/assistant" className="px-3 py-2 rounded-md border border-[#7F632C] text-[#7F632C]">KSG Assistant</Link>
            <Link href="/dashboard" className="px-3 py-2 rounded-md text-white bg-[#7F632C]">View Dashboard</Link>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{opacity:0,x:-50}} animate={{opacity:1,x:0}} transition={{duration:0.8}}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7F632C]/10 text-[#7F632C] text-sm font-medium mb-6"><Zap className="w-4 h-4"/>Digital Feedback & Engagement</div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">Turn every comment into <span className="text-[#7F632C]">action</span></h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">KSG LISTEN captures and routes feedback across channels with AI prioritization.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signin" className="px-6 py-4 rounded-md text-white bg-[#7F632C]">Get started</Link>
                <Link href="/assistant" className="px-6 py-4 rounded-md border border-[#7F632C] text-[#7F632C]">KSG Assistant</Link>
              </div>
            </motion.div>
            <div className="rounded-2xl p-6 bg-white shadow">Live dashboard preview coming soon…</div>
          </div>
        </div>
      </section>
    </div>
  );
}


