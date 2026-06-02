'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Gift, Sparkles, ArrowLeft, ArrowRight, Clock, Users, Trophy, Play, Plus, RefreshCw, X, ShieldAlert, Award, Calendar, Heart, Ticket } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders } from '@/context/OrderContext';

interface DrawPoolEntry {
  orderId: string;
  name: string;
  location: string;
  isUser: boolean;
}

interface WinnerRecord {
  week: number;
  date: string;
  orderId: string;
  name: string;
  location: string;
  prize: string;
  isUser: boolean;
}

const PRE_SEEDED_WINNERS: WinnerRecord[] = [
  {
    week: 11,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    orderId: 'SJ-82910',
    name: 'Maria Thomas',
    location: 'Alapuzha',
    prize: 'Signature Full-Grain Leather Duffle',
    isUser: false,
  },
  {
    week: 10,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    orderId: 'SJ-74312',
    name: 'Justin Davis',
    location: 'Kozhikode',
    prize: 'Stevejon Bespoke Cashmere Overshirt',
    isUser: false,
  },
  {
    week: 9,
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    orderId: 'SJ-65823',
    name: 'Kenji Sato',
    location: 'Kochi',
    prize: 'Stevejon Atelier Silk Scarf',
    isUser: false,
  }
];

const PRE_SEEDED_TEST_ENTRIES: DrawPoolEntry[] = [
  { orderId: 'SJ-54910', name: 'Alexander Wright', location: 'Bengaluru', isUser: false },
  { orderId: 'SJ-12048', name: 'Elena Rostova', location: 'Delhi', isUser: false },
  { orderId: 'SJ-94812', name: 'Liam O\'Connor', location: 'Mumbai', isUser: false },
  { orderId: 'SJ-38291', name: 'Seraphina Vance', location: 'Hyderabad', isUser: false },
  { orderId: 'SJ-74829', name: 'Devendra Sharma', location: 'Jaipur', isUser: false },
  { orderId: 'SJ-22019', name: 'Asha Nair', location: 'Chennai', isUser: false },
  { orderId: 'SJ-49021', name: 'Ranbir Kapoor', location: 'Pune', isUser: false },
];

const PRIZES = [
  'Stevejon Bespoke Cashmere Suit',
  'Signature Full-Grain Leather Duffle',
  'Limited Edition Cashmere Overshirt',
  'Atelier Gold Gift Voucher (₹ 15,000)',
  'Stevejon Premium Silk Blazer & Tie Set',
  'Crafted Suede Bomber Jacket'
];

export default function LuckyDrawPage() {
  const { orders } = useOrders();
  const [mounted, setMounted] = useState(false);
  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [testEntries, setTestEntries] = useState<DrawPoolEntry[]>([]);
  const [activePool, setActivePool] = useState<DrawPoolEntry[]>([]);
  
  // Animation and Simulation States
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawIndex, setDrawIndex] = useState(0);
  const [winnerResult, setWinnerResult] = useState<WinnerRecord | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 35, seconds: 24 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Particles for celebration
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; delay: number }[]>([]);

  // Setup mount protection
  useEffect(() => {
    setMounted(true);
    
    // Load Winners
    const storedWinners = localStorage.getItem('stevejon_lucky_draw_winners');
    if (storedWinners) {
      try {
        setWinners(JSON.parse(storedWinners));
      } catch (e) {
        setWinners(PRE_SEEDED_WINNERS);
      }
    } else {
      setWinners(PRE_SEEDED_WINNERS);
      localStorage.setItem('stevejon_lucky_draw_winners', JSON.stringify(PRE_SEEDED_WINNERS));
    }

    // Load Test Entries
    const storedTestEntries = localStorage.getItem('stevejon_lucky_draw_test_entries');
    if (storedTestEntries) {
      try {
        setTestEntries(JSON.parse(storedTestEntries));
      } catch (e) {
        setTestEntries(PRE_SEEDED_TEST_ENTRIES);
      }
    } else {
      setTestEntries(PRE_SEEDED_TEST_ENTRIES);
      localStorage.setItem('stevejon_lucky_draw_test_entries', JSON.stringify(PRE_SEEDED_TEST_ENTRIES));
    }

    // Start Timer countdown simulation
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          // Reset simulation
          return { days: 6, hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Sync / derive the Active Pool
  useEffect(() => {
    if (!mounted) return;

    // Filter user's active orders (PROCESSING, SHIPPED, DELIVERED, PENDING)
    // and make sure they haven't already won in past draws
    const winningIds = new Set(winners.map(w => w.orderId));
    
    const userPoolEntries: DrawPoolEntry[] = orders
      .filter(o => o.status !== 'CANCELLED' && !winningIds.has(o.id))
      .map(o => ({
        orderId: o.id,
        name: o.shippingDetails.name,
        location: o.shippingDetails.city,
        isUser: true
      }));

    // Test pool entries that haven't won
    const filteredTestEntries = testEntries.filter(t => !winningIds.has(t.orderId));

    // Combine
    setActivePool([...userPoolEntries, ...filteredTestEntries]);
  }, [orders, winners, testEntries, mounted]);

  // Inject 5 mock orders
  const handleAddTestEntries = () => {
    const freshMocks: DrawPoolEntry[] = [
      { orderId: `SJ-${Math.floor(10000 + Math.random() * 90000)}`, name: 'Marcus Vance', location: 'London', isUser: false },
      { orderId: `SJ-${Math.floor(10000 + Math.random() * 90000)}`, name: 'Hana Kimura', location: 'Tokyo', isUser: false },
      { orderId: `SJ-${Math.floor(10000 + Math.random() * 90000)}`, name: 'Rohan Deshmukh', location: 'Goa', isUser: false },
      { orderId: `SJ-${Math.floor(10000 + Math.random() * 90000)}`, name: 'Sophia Loren', location: 'Milan', isUser: false },
      { orderId: `SJ-${Math.floor(10000 + Math.random() * 90000)}`, name: 'Arjun Mehta', location: 'Ahmedabad', isUser: false },
    ];

    const updated = [...testEntries, ...freshMocks];
    setTestEntries(updated);
    localStorage.setItem('stevejon_lucky_draw_test_entries', JSON.stringify(updated));
  };

  // Reset the pool (removes test entries, wipes database to pre-seeded)
  const handleResetDatabase = () => {
    localStorage.removeItem('stevejon_lucky_draw_winners');
    localStorage.removeItem('stevejon_lucky_draw_test_entries');
    setWinners(PRE_SEEDED_WINNERS);
    setTestEntries(PRE_SEEDED_TEST_ENTRIES);
    localStorage.setItem('stevejon_lucky_draw_winners', JSON.stringify(PRE_SEEDED_WINNERS));
    localStorage.setItem('stevejon_lucky_draw_test_entries', JSON.stringify(PRE_SEEDED_TEST_ENTRIES));
  };

  // Raffle drawing simulation
  const handleTriggerDraw = () => {
    if (activePool.length === 0) return;

    setIsDrawing(true);
    setDrawIndex(0);

    const totalSpinTime = 4000; // 4 seconds spin
    const spinSteps = 45;
    let step = 0;
    
    // Slow down interval curve
    const runSpinner = () => {
      setDrawIndex(Math.floor(Math.random() * activePool.length));
      step++;

      if (step < spinSteps) {
        // Logarithmic deceleration curve for spinner
        const nextDelay = 30 + Math.pow(step / spinSteps, 2) * 500;
        setTimeout(runSpinner, nextDelay);
      } else {
        // Spin finished! Decide Winner
        const finalWinnerIndex = Math.floor(Math.random() * activePool.length);
        const winningEntry = activePool[finalWinnerIndex];
        const randomPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
        const nextWeekNum = winners.length > 0 ? Math.max(...winners.map(w => w.week)) + 1 : 1;

        const newWinner: WinnerRecord = {
          week: nextWeekNum,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          orderId: winningEntry.orderId,
          name: winningEntry.name,
          location: winningEntry.location,
          prize: randomPrize,
          isUser: winningEntry.isUser,
        };

        setDrawIndex(finalWinnerIndex);
        
        // Generate confetti particles
        const colors = ['#DF9F28', '#FFD700', '#FFFFFF', '#8C5D0D', '#EEF2F6', '#DF9F28'];
        const list: any[] = [];
        for (let i = 0; i < 120; i++) {
          list.push({
            id: i,
            x: 20 + Math.random() * 60, // center burst bounds
            y: 20 + Math.random() * 50,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 4 + Math.random() * 8,
            delay: Math.random() * 0.5,
          });
        }
        setParticles(list);

        setTimeout(() => {
          setIsDrawing(false);
          setWinnerResult(newWinner);
          setShowCelebration(true);

          // Append to winners database
          const updatedWinners = [newWinner, ...winners];
          setWinners(updatedWinners);
          localStorage.setItem('stevejon_lucky_draw_winners', JSON.stringify(updatedWinners));
        }, 500);
      }
    };

    setTimeout(runSpinner, 50);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#DF9F28]"></div>
      </div>
    );
  }

  // Get user's placed orders that have already won
  const wonOrderIds = new Set(winners.filter(w => w.isUser).map(w => w.orderId));
  const userEnteredOrders = orders.filter(o => o.status !== 'CANCELLED');

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans flex flex-col justify-between animate-fadeIn pb-0">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-24 flex-1 w-full">
        {/* Breadcrumb / Heading */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-widest uppercase text-black mb-3">
                Weekly Lucky Draw
              </h1>
              <p className="text-gray-500 text-xs md:text-sm tracking-[0.15em] uppercase font-medium">
                Every purchase automatically enters you into our weekly atelier giveaway
              </p>
            </div>
            
            <button
              onClick={handleResetDatabase}
              className="text-[0.65rem] border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 px-4 py-2 rounded-full uppercase tracking-widest font-semibold transition-all self-start md:self-end flex items-center gap-1.5 cursor-pointer bg-white"
              title="Restore standard demonstration database state"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Database
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Side: Timer & Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Live Timer Container (Themed like LuckyDrawPoster banner) */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#DF9F28] via-[#B87A15] to-[#8C5D0D] p-8 md:p-12 shadow-[0_15px_40px_rgba(223,159,40,0.25)] border border-[#DF9F28]/20 text-white">
              {/* Overlay Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                
                {/* Timer text */}
                <div className="text-center md:text-left flex-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[0.65rem] tracking-[0.2em] font-bold uppercase mb-4 text-white/95">
                    <Clock className="w-3.5 h-3.5" /> Next Draw Countdown
                  </span>
                  <h3 className="text-2xl font-serif tracking-wide uppercase mb-6 drop-shadow-sm">
                    Selecting Next Lucky Winner
                  </h3>

                  {/* Countdown Digital Timer */}
                  <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto md:mx-0">
                    {[
                      { val: timeLeft.days, label: 'Days' },
                      { val: timeLeft.hours, label: 'Hrs' },
                      { val: timeLeft.minutes, label: 'Min' },
                      { val: timeLeft.seconds, label: 'Sec' },
                    ].map((t, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/15 p-3 rounded-xl text-center min-w-[70px] transform hover:scale-105 transition-transform">
                        <span className="block text-2xl md:text-3xl font-bold font-sans tracking-tight tabular-nums">
                          {t.val.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[0.55rem] uppercase font-bold tracking-widest text-white/60 mt-1 block">
                          {t.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated action box */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-full md:w-auto md:min-w-[240px] text-center flex flex-col justify-center items-center">
                  <Trophy className="w-10 h-10 text-white mb-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]" strokeWidth={1.5} />
                  <span className="text-[0.6rem] font-bold tracking-[0.25em] text-white/70 uppercase">Weekly Prize Pool</span>
                  <p className="font-serif text-lg tracking-wide uppercase text-white my-1">Atelier Premium</p>
                  
                  {/* Simulate Raffle Button */}
                  <button
                    disabled={activePool.length === 0}
                    onClick={handleTriggerDraw}
                    className={`mt-4 w-full bg-white text-[#8C5D0D] hover:bg-gray-50 disabled:bg-white/50 disabled:text-white/80 py-3.5 px-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-black/10 hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Draw Now!
                  </button>
                  {activePool.length === 0 && (
                    <span className="text-[0.6rem] text-white/75 mt-2 font-medium">Add test entries below to draw!</span>
                  )}
                </div>

              </div>
            </div>

            {/* Simulated Entries Generator Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h4 className="text-base font-serif tracking-wider uppercase text-black mb-1">Raffle Test Suite</h4>
                <p className="text-gray-500 text-xs leading-relaxed max-w-md">
                  To test the slot machine animation and draws with diverse names, you can instantly inject 5 mock shoppers into the draw pool.
                </p>
              </div>
              <button
                onClick={handleAddTestEntries}
                className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-6 py-3.5 rounded-full text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-2 transition-all shadow-md shadow-[#DF9F28]/15 hover:shadow-lg hover:shadow-[#DF9F28]/25 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Test Entries
              </button>
            </div>

            {/* My Personal Entries section */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-serif tracking-wider uppercase text-black mb-6 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#DF9F28]" /> Your Live Entries
              </h3>

              {userEnteredOrders.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-[#FDFCF8]/50">
                  <Ticket className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-700 text-sm font-medium">No order entries yet</p>
                  <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
                    Place an order at our catalog! Your unique Order ID will be entered here instantly.
                  </p>
                  <Link
                    href="/product"
                    className="inline-flex items-center gap-1.5 mt-5 text-[0.65rem] bg-black text-white hover:bg-gray-800 px-5 py-2.5 rounded-full uppercase tracking-widest font-bold transition-all shadow-sm"
                  >
                    Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userEnteredOrders.map((o) => {
                    const hasWon = wonOrderIds.has(o.id);
                    const isWinner = winners.find(w => w.orderId === o.id);
                    
                    return (
                      <div
                        key={o.id}
                        className={`flex items-center justify-between p-4 border rounded-2xl transition-all bg-[#FDFCF8]/40 ${
                          hasWon 
                            ? 'border-emerald-200 bg-emerald-50/10' 
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${hasWon ? 'bg-emerald-50 text-emerald-600' : 'bg-[#F9F8F4] text-gray-500'}`}>
                            <Ticket className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-sans font-bold text-sm tracking-wide text-black">{o.id}</span>
                              <span className="text-[0.65rem] text-gray-400 font-bold">•</span>
                              <span className="text-xs text-gray-500 font-sans font-semibold">₹ {o.totalAmount.toLocaleString()}</span>
                            </div>
                            <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest mt-0.5 font-bold">
                              Placed on {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {hasWon ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-widest">
                              <Award className="w-3.5 h-3.5 fill-emerald-100" /> Won Weekly Draw
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-[#FDF8EE] border border-[#DF9F28]/20 text-[#8C5D0D] px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-widest animate-pulse">
                              <Sparkles className="w-3 h-3 fill-current" /> Active Entry
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Side: Active Draw Pool (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Draw Pool List Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col max-h-[580px]">
              
              <div className="pb-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif tracking-wider uppercase text-black flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#DF9F28]" /> Live Draw Pool
                  </h3>
                  <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest mt-0.5 font-semibold">
                    Order IDs entered in next raffle
                  </p>
                </div>
                <div className="bg-[#F9F8F4] border border-gray-100 rounded-full px-3 py-1 text-center shrink-0">
                  <span className="block text-xs font-bold text-black font-sans leading-none">{activePool.length}</span>
                  <span className="text-[0.5rem] text-gray-400 font-bold uppercase tracking-widest">Entries</span>
                </div>
              </div>

              {/* Scrolling List */}
              <div className="flex-1 overflow-y-auto pt-6 space-y-3.5 pr-1 font-sans">
                {activePool.length === 0 ? (
                  <div className="text-center py-20 text-gray-400 text-xs">
                    <Ticket className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                    <span>No entries in current pool.</span>
                    <br />
                    <span>Place an order to enter!</span>
                  </div>
                ) : (
                  activePool.map((entry, idx) => (
                    <div
                      key={entry.orderId}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        entry.isUser 
                          ? 'border-[#DF9F28]/35 bg-[#FDF8EE]/20 shadow-sm'
                          : 'border-gray-50 bg-[#FDFCF8]/30 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.65rem] tracking-wider ${
                          entry.isUser ? 'bg-[#DF9F28] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black font-sans tracking-wide">{entry.orderId}</p>
                          <p className="text-[0.65rem] text-gray-500 font-medium">
                            {entry.name} <span className="text-gray-300 font-bold">•</span> {entry.location}
                          </p>
                        </div>
                      </div>

                      {entry.isUser ? (
                        <span className="bg-[#DF9F28] text-white text-[0.55rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          YOU
                        </span>
                      ) : (
                        <span className="text-gray-300 font-bold text-[0.55rem] tracking-widest uppercase">
                          MOCK
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Historical Winners Ledger */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif tracking-[0.1em] uppercase text-[#1A1A1A] mb-3">
              Past Winners History
            </h2>
            <div className="h-[1px] w-12 bg-[#DF9F28] mx-auto mb-4"></div>
            <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-500">
              The archive of our esteemed weekly prize recipients
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="bg-[#FDFCF8] border-b border-gray-100 text-[0.65rem] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    <th className="px-8 py-5">Draw Week</th>
                    <th className="px-8 py-5">Winner</th>
                    <th className="px-8 py-5">Location</th>
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Prize Won</th>
                    <th className="px-8 py-5 text-right">Draw Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                  {winners.map((winner, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#FDFCF8]/40 transition-colors ${
                        winner.isUser ? 'bg-[#FDF8EE]/20 font-medium' : ''
                      }`}
                    >
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1 text-[0.7rem] bg-[#F9F8F4] border border-gray-100 text-gray-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider font-sans">
                          Week {winner.week}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-black font-semibold font-sans">{winner.name}</span>
                          {winner.isUser && (
                            <span className="bg-emerald-50 text-emerald-700 text-[0.55rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-100">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-gray-500 font-sans">{winner.location}</td>
                      <td className="px-8 py-5 font-bold font-sans tracking-wide text-black">{winner.orderId}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                          <Gift className="w-4 h-4 text-[#DF9F28]" />
                          <span>{winner.prize}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right text-gray-400 font-sans font-semibold text-xs">{winner.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Drawing Wheel Slot-Machine Modal */}
      {isDrawing && activePool.length > 0 && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1A1A1A] text-white w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-white/10 text-center relative overflow-hidden">
            
            {/* Ambient Background Gold Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#DF9F28]/15 rounded-full blur-3xl pointer-events-none"></div>

            <Sparkles className="w-12 h-12 text-[#DF9F28] mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-serif tracking-widest uppercase mb-1">Raffle Live Selection</h3>
            <p className="text-[0.6rem] text-white/50 uppercase tracking-widest font-semibold mb-10">Ticking active order IDs</p>

            {/* Spinner Cylinder Viewport */}
            <div className="relative border-y-2 border-[#DF9F28] bg-black/40 py-8 my-8 overflow-hidden rounded-xl">
              
              {/* Gold Selection Bracket Overlay */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 border-y border-[#DF9F28]/50 bg-[#DF9F28]/10 pointer-events-none z-10"></div>
              
              <div className="relative h-16 flex items-center justify-center">
                <div className="text-center transition-all duration-75 animate-scaleUp">
                  <span className="block text-2xl font-bold font-sans tracking-[0.1em] text-[#DF9F28]">
                    {activePool[drawIndex]?.orderId}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-white/70 block mt-1">
                    {activePool[drawIndex]?.name} • {activePool[drawIndex]?.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-white/40 text-xs uppercase tracking-widest font-semibold">
              <span className="w-1.5 h-1.5 bg-[#DF9F28] rounded-full animate-ping"></span>
              <span>Evaluating entries ledger...</span>
            </div>
          </div>
        </div>
      )}

      {/* Winner Celebration Modal */}
      {showCelebration && winnerResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fadeIn">
          
          {/* Confetti Animation Layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-md animate-fall"
                style={{
                  top: `${p.y}%`,
                  left: `${p.x}%`,
                  width: `${p.size}px`,
                  height: `${p.size * 2}px`,
                  backgroundColor: p.color,
                  opacity: 0.8,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>

          <div className="bg-[#FDFCF8] text-black w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 z-20 text-center animate-scaleUp relative p-8 md:p-12">
            
            {/* Floating Sparkles decoration */}
            <div className="absolute top-8 left-8 animate-pulse">
              <Sparkles className="w-6 h-6 text-[#DF9F28]" />
            </div>
            <div className="absolute top-12 right-12 animate-pulse" style={{ animationDelay: '200ms' }}>
              <Sparkles className="w-8 h-8 text-[#DF9F28]/60" />
            </div>

            {/* Glowing gold trophy backdrop */}
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#DF9F28]/10 blur-xl rounded-full scale-150 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#DF9F28] to-[#8C5D0D] p-6 rounded-full shadow-[0_10px_25px_rgba(223,159,40,0.3)]">
                <Trophy className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </div>

            <span className="text-[#DF9F28] text-xs font-bold tracking-[0.3em] uppercase block mb-1">
              Lucky Winner Selected!
            </span>
            <h2 className="text-3xl md:text-4xl font-serif tracking-wide uppercase text-black mb-6">
              Congratulations!
            </h2>

            {/* Winner Badge Grid */}
            <div className="bg-[#F9F8F4] border border-gray-100 rounded-3xl p-6 md:p-8 mb-8 max-w-md mx-auto relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#DF9F28] text-white text-[0.55rem] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Week {winnerResult.week} Giveaway
              </span>
              
              <p className="text-xl md:text-2xl font-bold font-sans tracking-wide text-black mt-2">
                {winnerResult.orderId}
              </p>
              <h4 className="text-base font-semibold text-gray-800 uppercase tracking-widest mt-1.5 font-sans leading-none">
                {winnerResult.name}
              </h4>
              <p className="text-xs text-gray-500 font-sans tracking-wider uppercase font-semibold mt-1">
                {winnerResult.location}
              </p>
              
              <div className="h-[1px] bg-gray-200/60 my-5 max-w-[120px] mx-auto"></div>
              
              <span className="text-[0.6rem] font-bold tracking-widest text-[#DF9F28] uppercase block">Prize Reward</span>
              <p className="text-sm md:text-base font-serif font-semibold text-gray-900 mt-1 uppercase tracking-wide leading-tight">
                {winnerResult.prize}
              </p>
            </div>

            <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto mb-8 font-sans">
              Our concierge team is contacting {winnerResult.name} to arrange complimentary express shipping of their bespoke Stevejon luxury reward.
            </p>

            <button
              onClick={() => {
                setShowCelebration(false);
                setWinnerResult(null);
              }}
              className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.25em] uppercase transition-all shadow-xl hover:shadow-2xl cursor-pointer w-full max-w-xs"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* Styled animation Keyframe styles for Confetti and fade-ins */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 4s linear infinite;
        }
      `}</style>

      <Footer />
    </div>
  );
}
