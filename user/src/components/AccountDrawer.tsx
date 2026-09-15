'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Coins,
  Gift,
  Package,
  Heart,
  MapPin,
  Settings,
  Sparkles,
  Ticket,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenDailyGift: () => void;
}

export default function AccountDrawer({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenDailyGift,
}: AccountDrawerProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<'orders' | 'perks' | 'addresses' | 'preferences'>('orders');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      onClose();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-[#DF9F28] flex items-center justify-center font-bold text-base shrink-0">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">
                    {session?.user?.name || 'Guest Customer'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    🏆 Gold VIP
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {session?.user?.email || 'Browsing as visitor'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close account drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Guest Sign In Callout */}
            {!session?.user && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-300/60">
                <h4 className="text-xs font-bold text-slate-900">Sign in to JudesCart</h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  View your order history, delivery radar, & unlock 200 free coins.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth('signin');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#DF9F28] hover:text-slate-950 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth('signup');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-slate-800 border border-stone-200 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}

            {/* JudesCoins & Lucky Rewards Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#DF9F28]" />
                  <span className="text-lg font-black tracking-tight text-white">0 JudesCoins</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Tier 1
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDailyGift();
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-colors flex items-center gap-2"
                >
                  <Gift className="w-4 h-4 text-[#DF9F28] shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-white leading-none">🎁 Day 1</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Claim Reward</p>
                  </div>
                </button>

                <Link
                  href="/lucky-draw"
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-colors flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-white leading-none">Lucky Draws</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Live Sunday 8PM</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Tabbed Navigation Filter */}
            <div>
              <div className="flex border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-all ${
                    activeTab === 'orders'
                      ? 'text-[#DF9F28] border-b-2 border-[#DF9F28]'
                      : 'text-stone-500 hover:text-slate-800'
                  }`}
                >
                  Orders (0)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('perks')}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-all ${
                    activeTab === 'perks'
                      ? 'text-[#DF9F28] border-b-2 border-[#DF9F28]'
                      : 'text-stone-500 hover:text-slate-800'
                  }`}
                >
                  Coins & Perks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-all ${
                    activeTab === 'addresses'
                      ? 'text-[#DF9F28] border-b-2 border-[#DF9F28]'
                      : 'text-stone-500 hover:text-slate-800'
                  }`}
                >
                  Addresses
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preferences')}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-all ${
                    activeTab === 'preferences'
                      ? 'text-[#DF9F28] border-b-2 border-[#DF9F28]'
                      : 'text-stone-500 hover:text-slate-800'
                  }`}
                >
                  Preferences
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-4">
                {activeTab === 'orders' && (
                  <div className="text-center py-8 space-y-3">
                    <Package className="w-10 h-10 text-stone-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">No orders placed yet</p>
                    <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                      Your fulfilled orders and live dispatch milestones will appear here.
                    </p>
                    <Link
                      href="/product"
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-100 hover:bg-[#DF9F28] hover:text-slate-950 text-xs font-bold text-slate-800 transition-colors"
                    >
                      <span>Start Shopping</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {activeTab === 'perks' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#DF9F28]" />
                        <span className="font-bold text-slate-900">Weekly Bumper Entry</span>
                      </div>
                      <span className="font-bold text-[#DF9F28]">Active</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-stone-600" />
                        <span className="font-bold text-slate-900">Signup Bonus</span>
                      </div>
                      <span className="font-bold text-emerald-600">+200 Coins</span>
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="text-center py-8 space-y-2">
                    <MapPin className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">No saved addresses</p>
                    <p className="text-[11px] text-stone-500">
                      Addresses will be saved automatically during checkout.
                    </p>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                      <span>Default Currency</span>
                      <span className="font-bold text-slate-900">INR (₹)</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                      <span>Order Alerts</span>
                      <span className="font-bold text-emerald-600">Enabled (SMS + WA)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="space-y-1 pt-2 border-t border-stone-100">
              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              <Link
                href="/track-order"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span>Track Consignment</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              <Link
                href="/faq"
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Help & FAQ</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-stone-100 bg-stone-50">
            {session?.user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of JudesCart</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth('signin');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#111111] hover:bg-[#DF9F28] text-white hover:text-slate-950 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
