"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignIn(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const params = useSearchParams();
  const error = params?.get("error");
  const errorMsg = error === "CredentialsSignin" ? "Invalid email or password" : error ? "Authentication error. Please try again." : "";
  async function submit(e:React.FormEvent){
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  }
  return (
    <main className="relative h-screen overflow-hidden flex items-center justify-center bg-gradient-to-b from-amber-50 via-teal-50 to-white px-4">
      <Link href="/" className="absolute top-4 left-4 inline-flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md bg-gradient-to-tr from-[#7F632C] to-[#f59e0b] hover:opacity-95">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div className="pointer-events-none absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.6),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.55),transparent_60%)]" />
      <Link href="/assistant" className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-xs bg-[#7F632C] hover:bg-[#6a5425]">KSG Assistant</Link>
      <form onSubmit={submit} className="relative w-full max-w-md space-y-5 bg-white rounded-2xl p-6 shadow-sm">
          {errorMsg && <div className="text-sm rounded-md px-3 py-2 bg-red-50 border border-red-200 text-red-700">{errorMsg}</div>}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-8 w-8 rounded bg-gradient-to-tr from-[#7F632C] to-[#f28224]" />
              <div className="text-lg font-semibold text-gray-900">Sign in to your account</div>
            </div>
            <p className="text-sm text-gray-500">Use your email and password</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7F632C]/30" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7F632C]/30" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
          </div>
          <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-tr from-[#7F632C] to-[#f28224] text-white hover:opacity-95 transition">Sign in</button>
          <div className="text-sm text-gray-500">Don&apos;t have an account? <a href="/signup" className="text-[#7F632C] underline">Create one</a></div>
      </form>
    </main>
  );
}




