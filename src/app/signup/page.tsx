"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function SignUp(){
  const router = useRouter();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("participants");
  const [error,setError]=useState<string | null>(null);
  const [loading,setLoading]=useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setError(null);
    setLoading(true);
    try{
      const res = await fetch("/api/auth/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if(!res.ok){
        setError(data?.error || "Failed to sign up");
      }else{
        router.push("/signin");
      }
    }finally{
      setLoading(false);
    }
  }

  return (
    <main className="relative h-screen overflow-hidden flex items-center justify-center bg-gradient-to-b from-amber-50 via-teal-50 to-white px-4">
      <Link href="/" className="absolute top-4 left-4 inline-flex items-center justify-center w-10 h-10 rounded-full text-white shadow-md bg-gradient-to-tr from-[#7F632C] to-[#f59e0b] hover:opacity-95">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div className="pointer-events-none absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.6),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.55),transparent_60%)]" />
      <Link href="/assistant" className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-xs bg-[#7F632C] hover:bg-[#7F632C]">KSG Assistant</Link>
      <form onSubmit={submit} className="relative w-full max-w-md space-y-5 bg-white rounded-2xl p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-8 w-8 rounded bg-gradient-to-tr from-[#7F632C] to-[#f28224]" />
              <div className="text-lg font-semibold text-gray-900">Create your account</div>
            </div>
            <p className="text-sm text-gray-500">Fill in your details to get started</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7F632C]/30" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7F632C]/30" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7F632C]/30"
                  placeholder="••••••••"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={()=>setShowPassword(v=>!v)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-[#7F632C] transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7F632C]/30" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="participants">participants</option>
              <option value="student">student</option>
              <option value="staff">staff</option>
              <option value="administrator">administrator</option>
              </select>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-tr from-[#7F632C] to-[#f28224] text-white hover:opacity-95 transition">{loading?"Creating...":"Sign up"}</button>
          <div className="text-sm text-gray-500">Already have an account? <a href="/signin" className="text-[#7F632C] underline">Sign in</a></div>
      </form>
    </main>
  );
}


