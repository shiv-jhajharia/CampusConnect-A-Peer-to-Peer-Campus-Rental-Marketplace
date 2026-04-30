import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./config";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const token = credentialResponse.credential;
      const res = await fetch(`${API_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, role: isAdmin ? "admin" : "user" })
      });
      const data = await res.json();

      if (!res.ok) {
        let errorText = data.detail || "Login Failed";
        if (isAdmin && errorText === "Not an admin") {
          errorText = "❌ You are not authorized as Admin";
        }
        setErrorMsg(errorText);
        setTimeout(() => setErrorMsg(""), 5000);
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMsg("Server not reachable");
      setTimeout(() => setErrorMsg(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/30 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/30 blur-[100px] pointer-events-none"></div>

      <div className="glass-dark w-full max-w-5xl rounded-3xl flex flex-col md:flex-row overflow-hidden z-10 m-4 shadow-2xl relative">
        {/* Left Side: Branding / Graphic */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center relative bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-r border-white/5">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4 text-shadow">
            CampusRent
          </h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-md leading-relaxed">
            The secure, peer-to-peer rental marketplace designed exclusively for verified students.
          </p>
          <div className="space-y-4">
             <div className="flex items-center text-blue-100/80">
               <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
               Strictly verified college emails
             </div>
             <div className="flex items-center text-blue-100/80">
               <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
               Escrow-backed secure payments
             </div>
             <div className="flex items-center text-blue-100/80">
               <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
               No double bookings allowed
             </div>
          </div>
        </div>

        {/* Right Side: Login Panel */}
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-slate-900/50">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to continue to your dashboard.</p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm shadow-xl flex items-center">
              <span className="mr-2">⚠️</span> {errorMsg}
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-xl mb-8 text-sm backdrop-blur-sm">
            <p className="flex items-center justify-center md:justify-start">
              <span>🔒 Use your <b>college email only</b></span>
            </p>
          </div>

          <div className="flex justify-center md:justify-start min-h-[70px] items-center">
            {loading ? (
              <div className="w-12 h-12 flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="relative z-20 group cursor-pointer w-full max-w-[340px]">
                {/* Outer animated glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full blur-md opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
                
                {/* Inner button wrapper */}
                <div className="relative bg-slate-900 rounded-full p-[2px] shadow-[0_0_40px_-10px_rgba(79,70,229,0.4)]">
                  <div className="bg-slate-950 rounded-full p-1.5 border border-white/5 group-hover:border-white/20 transition-all flex justify-center">
                    <GoogleLogin
                      onSuccess={handleSuccess}
                      onError={() => setErrorMsg("Login failed locally.")}
                      theme="filled_black"
                      shape="pill"
                      size="large"
                      width="320"
                      text="continue_with"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 border ${
                isAdmin 
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30" 
                  : "bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {isAdmin ? "🔒 ADMIN MODE ACTIVE" : "🛡️ LOGIN AS ADMIN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}