"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, LogIn, MessageSquare, Mail, Smartphone, Globe, QrCode, Phone, ArrowRight, Users, TrendingUp, Clock, Award, Star, Facebook, Twitter, Linkedin, Instagram, Youtube, CheckCircle, Calendar, AlertTriangle, BarChart3 } from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-teal-50 to-white">
      <header className="sticky top-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div
            className={`transition-all duration-300 ${
              scrolled
                ? "bg-white/70 backdrop-blur-md shadow-sm border border-white/40 rounded-full"
                : "bg-white/40 backdrop-blur-md shadow-sm border border-white/30 rounded-2xl"
            }`}
          >
            <div className="px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#7F632C] to-[#f28224] flex items-center justify-center text-white font-bold text-xl">KL</div>
            <span className="text-2xl font-bold text-gray-900">KSG LISTEN</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#why" className="text-gray-700 hover:text-[#7F632C] transition">About</Link>
            <Link href="#features" className="text-gray-700 hover:text-[#7F632C] transition">Features</Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-[#7F632C] transition">How it works</Link>
            <Link href="/assistant" className="text-gray-700 hover:text-[#7F632C] transition">KSG Assistant</Link>
            <Link href="#footer" className="text-gray-700 hover:text-[#7F632C] transition">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin" className="p-2 text-gray-700 hover:text-[#7F632C] transition" title="Sign in">
              <LogIn className="w-5 h-5" />
            </Link>
            <Link href="/assistant" className="px-4 py-2 rounded-md text-white bg-[#7F632C] hover:bg-[#6a5425] transition">Add Feedback</Link>
          </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-b from-amber-50 via-teal-50 to-white relative overflow-hidden">
        {/* Kenya map background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/kenya.jpg"
            alt="Kenya map background"
            fill
            priority
            className="object-contain object-right lg:object-center opacity-50 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-transparent" />
        </div>
        {/* colorful ambient blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.6),transparent_60%)]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.55),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7F632C]/10 text-[#7F632C] text-sm font-medium mb-6 shadow-sm">
                <Award className="w-4 h-4" /> Smart Feedback & Inquiry Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Turn every training inquiry and feedback into <span className="text-[#7F632C]">insight-driven action</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                KSG LISTEN is an AI-powered, mobile-first platform that enables participants, staff, and students to send feedback or make inquiries about upcoming, ongoing, or completed training programs — all through WhatsApp, web, USSD, or kiosk. It auto-categorizes, prioritizes, and routes inquiries to the right department in seconds, ensuring rapid, transparent responses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/assistant" className="px-6 py-3 rounded-md text-white bg-gradient-to-r from-[#7F632C] to-[#f59e0b] hover:from-[#6a5425] hover:to-[#d97706] transition inline-flex items-center gap-2 shadow">
                  Try the KSG Assistant <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/signin" className="px-6 py-3 rounded-md border-2 border-[#7F632C] text-[#7F632C] hover:bg-[#7F632C]/10 transition">
                  Get started
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="grid grid-cols-2 gap-4 relative">
                <div className="col-span-1 space-y-4">
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                    <Image 
                      src="/images/ksg_training_1.jpeg" 
                      alt="KSG Training" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                  </div>
                </div>
                <div className="col-span-1 space-y-4">
                  <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg">
                    <Image 
                      src="/images/ksg_training_2.jpeg" 
                      alt="KSG Training" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                  </div>
                  <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg">
                    <Image 
                      src="/images/ksg_training_3.jpeg" 
                      alt="KSG Training" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" id="why">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Collage with badge */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl h-[420px]">
                <Image src="/images/ksg_training_4.png" alt="KSG team" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-4 bg-teal-600 text-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold leading-none">5+</div>
                  <div className="text-xs opacity-90">Channels Supported</div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-10 w-48 h-40 rounded-2xl overflow-hidden shadow-xl border border-white/60 bg-white">
                <Image src="/images/ksg_training_5.png" alt="KSG discussion" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
              </div>
            </div>

            {/* Right: Title + feature list */}
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why KSG LISTEN</h2>
              <p className="text-gray-700 mb-8">Centralize feedback and inquiries across campuses, respond faster with AI routing, and build trust with transparent communication.</p>

              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-cyan-600 text-white grid place-items-center shrink-0"><MessageSquare className="w-5 h-5"/></div>
                  <div>
                    <div className="font-semibold text-gray-900">Unified Conversations</div>
                    <div className="text-sm text-gray-700">Chats and feedback from WhatsApp, Web, USSD, SMS, and kiosks in one place.</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white grid place-items-center shrink-0"><CheckCircle className="w-5 h-5"/></div>
                  <div>
                    <div className="font-semibold text-gray-900">Accountability & SLAs</div>
                    <div className="text-sm text-gray-700">Auto-routing with timers ensures nothing is missed and responses stay timely.</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white grid place-items-center shrink-0"><BarChart3 className="w-5 h-5"/></div>
                  <div>
                    <div className="font-semibold text-gray-900">Insights that Improve Training</div>
                    <div className="text-sm text-gray-700">Live charts and trends turn feedback into action for better delivery.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features (moved above How It Works) */}
      <section className="py-20 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Tracking training insights made <span className="text-[#7F632C]">simple</span>.</h2>
            <p className="text-gray-600 mt-3">Monitor conversations, reach, and results from one intuitive analytics view.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Multi-Channel Access", desc: "Submit feedback or inquiries via WhatsApp, Web, USSD (*727#), SMS, or on-campus kiosks — accessible to all users.", delay: 0, Icon: Globe },
              { title: "Smart AI Routing", desc: "Powered by Gemini Flash, the system understands messages in Kiswahili & English, detects type and urgency, and routes them instantly to the right office.", delay: 0.05, Icon: Search },
              { title: "Training-Linked Context", desc: "Connected to the KSG Training Calendar so users can ask about specific courses or share feedback on ongoing and completed programs.", delay: 0.1, Icon: Calendar },
              { title: "KSG Assistant (AI Chat)", desc: "An intuitive chat interface — like ChatGPT — for staff and participants to send feedback or inquiries, anonymously or logged in.", delay: 0.15, Icon: MessageSquare },
              { title: "Urgent Issue Alerts", desc: "Critical messages such as 'trainer absent' or 'safety issue' trigger instant alerts and escalate automatically if unresolved.", delay: 0.2, Icon: AlertTriangle },
              { title: "Real-Time Dashboard", desc: "Displays live feedback trends, response rates, and sentiment analytics across campuses — giving administrators full visibility.", delay: 0.25, Icon: BarChart3 },
              { title: "Predictive Insights", desc: "AI uncovers patterns to highlight training gaps, emerging needs, and efficiency opportunities for proactive improvement.", delay: 0.3, Icon: Star },
            ].map((card, idx) => (
              <motion.div key={idx} initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:0.2}} transition={{duration:0.6, delay: card.delay}} className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 hover:shadow-md transition relative last:md:col-span-2 last:lg:col-span-3">
                {/* Brand icon badge in place of the previous dot */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#7F632C] text-white grid place-items-center shadow-sm">
                  <card.Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-700 mb-5">{card.desc}</p>
                <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden border border-gray-100">
                  {(() => { const imgs = ["/images/feature_feedback.png","/images/feature_assistant.png","/images/feature_dashboard.png"]; const img = imgs[idx % imgs.length];
                  return (
                    <>
                      <Image src={img} alt={card.title} fill className="object-cover p-1" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                    </>
                  ); })()}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7F632C] text-white hover:bg-[#6a5425] transition">Explore the dashboard <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">How it All Works</h2>
            <p className="text-gray-600">From inquiry to resolution in five clear steps.</p>
          </div>

          {/* Alternating timeline layout (1L,2R,3L,4R,5L) with staggered spacing */}
          <div className="relative">
            {/* central guide line on lg+ */}
            <div className="hidden lg:block absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

            <div className="grid md:grid-cols-2 gap-y-16 md:gap-y-24 gap-x-8">
              {/* 1 - left */}
              <motion.div initial={{opacity:0,x:-24,y:12}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:0.6}} className="md:pr-10">
                <div className="flex md:justify-end">
                  <div className="max-w-md w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#7F632C] text-white grid place-items-center font-semibold">1</div>
                      <h3 className="font-semibold text-gray-900">Capture</h3>
                    </div>
                    <div className="rounded-2xl p-6 bg-gray-50 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2"><MessageSquare className="w-5 h-5 text-[#7F632C]"/><span className="font-medium text-gray-900">Message Received</span></div>
                      <p className="text-sm text-gray-700">Participants or staff send messages via WhatsApp, Web, or USSD.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2 - right (offset to avoid straight alignment) */}
              <motion.div initial={{opacity:0,x:24,y:0}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:0.6, delay:0.05}} className="md:pl-10 md:mt-10">
                <div className="flex">
                  <div className="max-w-md w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#7F632C] text-white grid place-items-center font-semibold">2</div>
                      <h3 className="font-semibold text-gray-900">Analyse</h3>
                    </div>
                    <div className="rounded-2xl p-6 bg-gray-50 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2"><Search className="w-5 h-5 text-[#7F632C]"/><span className="font-medium text-gray-900">AI Understanding</span></div>
                      <p className="text-sm text-gray-700">AI tags by type, campus, and urgency for quick action.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 3 - left (extra offset) */}
              <motion.div initial={{opacity:0,x:-24,y:0}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:0.6, delay:0.1}} className="md:pr-10 md:mt-4">
                <div className="flex md:justify-end">
                  <div className="max-w-md w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#7F632C] text-white grid place-items-center font-semibold">3</div>
                      <h3 className="font-semibold text-gray-900">Route</h3>
                    </div>
                    <div className="rounded-2xl p-6 bg-gray-50 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2"><ArrowRight className="w-5 h-5 text-[#7F632C]"/><span className="font-medium text-gray-900">Assignment</span></div>
                      <p className="text-sm text-gray-700">Sent to the right office or coordinator with SLA timers.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 4 - right (higher offset) */}
              <motion.div initial={{opacity:0,x:24,y:8}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:0.6, delay:0.15}} className="md:pl-10 md:mt-16">
                <div className="flex">
                  <div className="max-w-md w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#7F632C] text-white grid place-items-center font-semibold">4</div>
                      <h3 className="font-semibold text-gray-900">Collaborate</h3>
                    </div>
                    <div className="rounded-2xl p-6 bg-gray-50 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5 text-[#7F632C]"/><span className="font-medium text-gray-900">Internal Chat</span></div>
                      <p className="text-sm text-gray-700">Teams coordinate responses and solutions in-platform.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 5 - left (final) */}
              <motion.div initial={{opacity:0,x:-24,y:8}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:0.6, delay:0.2}} className="md:pr-10 md:mt-8">
                <div className="flex md:justify-end">
                  <div className="max-w-md w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#7F632C] text-white grid place-items-center font-semibold">5</div>
                      <h3 className="font-semibold text-gray-900">Close the Loop</h3>
                    </div>
                    <div className="rounded-2xl p-6 bg-gray-50 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2"><CheckCircle className="w-5 h-5 text-[#7F632C]"/><span className="font-medium text-gray-900">Resolved</span></div>
                      <p className="text-sm text-gray-700">Automated updates notify the sender once resolved.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features (old section removed in favor of the new one above) */}

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Multi-Channel Intake</h2>
            <p className="text-lg text-gray-700">Seamlessly capture inquiries from every channel</p>
          </div>

          {/* Hub diagram */}
          <div className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200 p-10">
            {/* Connection lines removed for a cleaner look */}

            {/* center hub */}
            <div className="relative grid place-items-center">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative w-56 h-56 rounded-full bg-[#7F632C]/10 border-4 border-[#7F632C]/20 grid place-items-center shadow-inner">
                <div className="w-36 h-36 rounded-full bg-white border-2 border-[#7F632C]/20 grid place-items-center shadow">
                  <div className="text-2xl font-extrabold text-[#7F632C]">KSG LISTEN</div>
                </div>
              </motion.div>
            </div>

            {/* left badges */}
            <div className="absolute left-4 top-24 flex flex-col gap-16">
              <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-green-600 text-white grid place-items-center shadow"><MessageSquare className="w-7 h-7"/></div>
                <div className="font-semibold text-gray-900">WhatsApp</div>
              </motion.div>
              <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-purple-600 text-white grid place-items-center shadow"><Phone className="w-7 h-7"/></div>
                <div className="font-semibold text-gray-900">USSD (*727#)</div>
            </motion.div>
              <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-orange-600 text-white grid place-items-center shadow"><QrCode className="w-7 h-7"/></div>
                <div className="font-semibold text-gray-900">SMS & Kiosks</div>
            </motion.div>
            </div>

            {/* right badges */}
            <div className="absolute right-4 top-24 flex flex-col gap-16 items-end">
              <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }} className="flex items-center gap-3">
                <div className="font-semibold text-gray-900">Web Portal</div>
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white grid place-items-center shadow"><Globe className="w-7 h-7"/></div>
            </motion.div>
              <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="flex items-center gap-3">
                <div className="font-semibold text-gray-900">Mobile Web</div>
                <div className="w-16 h-16 rounded-full bg-cyan-600 text-white grid place-items-center shadow"><Smartphone className="w-7 h-7"/></div>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Get Your Training Updates Straight to Your Inbox
            </h2>
            <p className="text-gray-300 mb-8">
              Stay informed about upcoming training programs, success stories, and platform updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 rounded-md text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-[#7F632C]"
              />
              <button className="px-8 py-3 rounded-md text-white bg-[#7F632C] hover:bg-[#6a5425] transition">
                Subscribe
              </button>
          </div>
            <p className="text-xs text-gray-400 mt-4">
              By subscribing, you agree to our Privacy Policy and Terms & Conditions
            </p>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#7F632C] to-[#f28224] flex items-center justify-center text-white font-bold">KL</div>
                <span className="text-lg font-bold text-gray-900">KSG LISTEN</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Follow us on</p>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center hover:bg-[#7F632C] hover:text-white transition">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded bg-gray-100 flex items-center justify-centerhover:bg-[#7F632<｜place▁holder▁no▁41｜> hover:text-white transition">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center hover:bg-[#7F632C] hover:text-white transition">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center hover:bg-[#7F632C] hover:text-white transition">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center hover:bg-[#7F632C] hover:text-white transition">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">About KSG</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">About KSG LISTEN</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Our Team</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Press & Media</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Training Areas</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Leadership</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Management</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Public Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Professional Development</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Skills Training</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Capacity Building</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Training Programs</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Short Courses</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Certificate Programs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Diploma Programs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Executive Programs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Custom Training</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Online Learning</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">FAQs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Support Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Live Chat</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#7F632C] transition">Training Guides</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 text-center">
              © {new Date().getFullYear()} KSG LISTEN • Smart Feedback & Inquiry Platform for Training Excellence • All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
