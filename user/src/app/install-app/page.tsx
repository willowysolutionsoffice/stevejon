'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Smartphone,
  QrCode,
  Download,
  Sparkles,
  ShieldCheck,
  Bell,
  Ticket,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function InstallAppPage() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install the JudesCart Web App, tap "Share" (iOS Safari) or the 3-dot menu (Chrome) and select "Add to Home Screen".');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-6">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">Install App</span>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden mb-12">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#DF9F28_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official JudesCart Progressive Web App</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Shop Faster.<br />
              <span className="text-[#DF9F28]">Never Miss a Lucky Draw.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
              Install JudesCart directly on your iPhone, iPad, Android, or Desktop. Enjoy ultra-fast load times, instant push alerts for weekly draw numbers, and exclusive app discounts.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-8 py-4 rounded-full bg-[#DF9F28] hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-500/20 active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Install JudesCart App</span>
              </button>

              <Link
                href="/product"
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <span>Browse Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 bg-amber-50 text-[#DF9F28] rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Instant 0.2s Loads</h3>
            <p className="text-xs text-stone-500">Cached offline catalogs with smooth transitions and instant search.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Lucky Draw Alerts</h3>
            <p className="text-xs text-stone-500">Real-time alerts when weekly winning numbers are drawn live.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Price Drop Alerts</h3>
            <p className="text-xs text-stone-500">Get notified the instant items in your wishlist go on limited sale.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Zero App Store Bloat</h3>
            <p className="text-xs text-stone-500">Lightweight installation without taking up phone storage.</p>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-6">How to Install on Mobile Devices</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-5 h-5 text-slate-900" />
                <h3 className="text-sm font-bold text-slate-900">Apple iOS (Safari)</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-xs text-stone-600 leading-relaxed">
                <li>Open <strong className="text-slate-800">judescart.com</strong> in Safari.</li>
                <li>Tap the <strong className="text-slate-800">Share</strong> button at the bottom of the screen.</li>
                <li>Scroll down and tap <strong className="text-slate-800">&quot;Add to Home Screen&quot;</strong>.</li>
                <li>Tap <strong className="text-slate-800">Add</strong> to launch JudesCart like a native app.</li>
              </ol>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-5 h-5 text-[#DF9F28]" />
                <h3 className="text-sm font-bold text-slate-900">Android (Chrome / Brave)</h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-xs text-stone-600 leading-relaxed">
                <li>Open <strong className="text-slate-800">judescart.com</strong> in Google Chrome.</li>
                <li>Tap the <strong className="text-slate-800">three dots (⋮)</strong> menu on the top-right.</li>
                <li>Select <strong className="text-slate-800">&quot;Install app&quot;</strong> or <strong className="text-slate-800">&quot;Add to Home screen&quot;</strong>.</li>
                <li>Confirm to install the high-speed PWA.</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
