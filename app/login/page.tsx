'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useRoadVision();
  const [email, setEmail] = useState('harsh.rathod@nhai-audit.gov.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Signed In', 'Welcome back, Er. Harsh Rathod.');
    router.push('/dashboard');
  };

  const handleDemoLogin = () => {
    showToast('Demo Access Granted', 'Logged in as Chief Pavement Specialist.');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/30">
          <svg
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19L9 5" />
            <path d="M20 19L15 5" />
            <line x1="12" y1="7" x2="12" y2="9" />
            <line x1="12" y1="13" x2="12" y2="15" />
            <line x1="12" y1="19" x2="12" y2="21" />
          </svg>
        </div>

        <div className="text-center mt-3">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              ROADVISION
            </span>
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              AI
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-500 tracking-wide uppercase">
            AI-Powered Road Infrastructure Intelligence
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl sm:px-10 border border-slate-200">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Enterprise Portal Sign In</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized highway engineering & survey inspection access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official Government / Agency Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember Workstation</span>
              </label>
              <span className="text-blue-600 hover:underline cursor-pointer">
                Forgot Credentials?
              </span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-blue-200 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Demo Login (Instant Access)</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Encrypted Ministry & NHAI Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
