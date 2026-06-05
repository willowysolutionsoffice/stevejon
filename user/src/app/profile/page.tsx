'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, MapPin, Phone, Mail, Calendar, Check, 
  Trash2, Edit, Plus, ArrowLeft, Eye, ShieldCheck, 
  UserCheck, AlertCircle, Camera, CheckCircle, X, Ticket
} from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authClient } from '@/lib/auth-client';

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'tickets'>('profile');
  
  // Lucky Tickets States
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  
  // Profile Info States
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    createdAt: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Address Book States
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  // General Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };



  // Fetch Profile & Address Details
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await fetch(`${apiUrl}/profile`, { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setProfileData({
              name: result.data.name || '',
              email: result.data.email || '',
              phone: result.data.phone || '',
              image: result.data.image || '',
              createdAt: result.data.createdAt || ''
            });
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileError("Failed to load profile details.");
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const res = await fetch(`${apiUrl}/profile/addresses`, { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            setAddresses(result.data);
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    const fetchTickets = async () => {
      try {
        setLoadingTickets(true);
        const res = await fetch(`${apiUrl}/profile/tickets`, { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            setTickets(result.data);
          }
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchProfile();
    fetchAddresses();
    fetchTickets();
  }, [session, isPending, apiUrl, router]);

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);

    try {
      const res = await fetch(`${apiUrl}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone
        }),
        credentials: 'include'
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          showToast("Profile details updated successfully!");
          // Wait for better-auth session update triggers if any
        } else {
          setProfileError(result.error || "Failed to update profile.");
        }
      } else {
        const errResult = await res.json();
        setProfileError(errResult.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileError("Network error. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Open address modal (add mode)
  const handleAddAddressClick = () => {
    setEditingAddress(null);
    setAddressForm({
      name: profileData.name, // Auto-fill with user name
      phone: profileData.phone, // Auto-fill with user phone
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0 // Default if first address
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  // Open address modal (edit mode)
  const handleEditAddressClick = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setAddressForm({
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  // Handle Address Submit
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressError(null);

    const isEditing = !!editingAddress;
    const url = isEditing 
      ? `${apiUrl}/profile/addresses/${editingAddress.id}`
      : `${apiUrl}/profile/addresses`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
        credentials: 'include'
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          // Re-fetch all addresses to get in sync (handling default address swap)
          const fetchRes = await fetch(`${apiUrl}/profile/addresses`, { credentials: 'include' });
          if (fetchRes.ok) {
            const fetchResult = await fetchRes.json();
            setAddresses(fetchResult.data);
          }
          setIsAddressModalOpen(false);
          showToast(isEditing ? "Address updated successfully!" : "Address added successfully!");
        } else {
          setAddressError(result.error || "Failed to save address.");
        }
      } else {
        const errResult = await res.json();
        setAddressError(errResult.error || "Failed to save address.");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setAddressError("Network error. Please check your connection.");
    } finally {
      setSavingAddress(false);
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`${apiUrl}/profile/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        // Re-fetch addresses
        const fetchRes = await fetch(`${apiUrl}/profile/addresses`, { credentials: 'include' });
        if (fetchRes.ok) {
          const fetchResult = await fetchRes.json();
          setAddresses(fetchResult.data);
        }
        showToast("Address deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  // Handle Set Default Address
  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/profile/addresses/${id}/default`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (res.ok) {
        // Re-fetch addresses
        const fetchRes = await fetch(`${apiUrl}/profile/addresses`, { credentials: 'include' });
        if (fetchRes.ok) {
          const fetchResult = await fetchRes.json();
          setAddresses(fetchResult.data);
        }
        showToast("Default address updated!");
      }
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  if (isPending || (loadingProfile && !profileData.email)) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#DF9F28] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-24 flex-1 w-full">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors mb-6 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Catalog
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-widest uppercase text-black mb-3">
              Account Profile
            </h1>
            <p className="text-gray-500 text-xs md:text-sm tracking-[0.15em] uppercase font-medium">
              Manage your personal info and shipping addresses
            </p>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex gap-8 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm select-none">
            <div className="text-left">
              <span className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest block">User ID</span>
              <span className="text-xs font-bold text-gray-800 block mt-1">{session?.user?.id.substring(0, 10)}...</span>
            </div>
            <div className="w-[1px] bg-gray-100"></div>
            <div className="text-left">
              <span className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest block">Role</span>
              <span className="text-xs font-bold text-[#DF9F28] uppercase tracking-widest block mt-1">{(session?.user as any)?.role || 'User'}</span>
            </div>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-gray-200 mb-10 select-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-6 text-xs font-bold tracking-[0.2em] uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#DF9F28] text-black font-extrabold bg-[#DF9F28]/5 rounded-t-2xl'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <User className="w-4 h-4 text-[#DF9F28]" />
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-4 px-6 text-xs font-bold tracking-[0.2em] uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-[#DF9F28] text-black font-extrabold bg-[#DF9F28]/5 rounded-t-2xl'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#DF9F28]" />
            Address Book ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-4 px-6 text-xs font-bold tracking-[0.2em] uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'border-[#DF9F28] text-black font-extrabold bg-[#DF9F28]/5 rounded-t-2xl'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Ticket className="w-4 h-4 text-[#DF9F28]" />
            Lucky Tickets ({tickets.length})
          </button>
        </div>

        {/* TAB 1: PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto animate-fadeIn">
            {/* Personal Details Form */}
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-sm text-left">
              <h2 className="text-xl font-serif font-semibold text-black mb-8 border-b border-gray-50 pb-4">
                Personal Information
              </h2>

              {profileError && (
                <div className="bg-red-50 text-red-600 text-xs p-4 rounded-2xl border border-red-100 mb-6 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="pname" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      id="pname"
                      value={profileData.name}
                      onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Jane Doe"
                      className="border border-gray-200 rounded-full px-5 py-3.5 text-xs font-semibold tracking-wider bg-[#FDFCF8] focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28]"
                    />
                  </div>

                  {/* Email field (Read-only) */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="pemail" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      id="pemail"
                      value={profileData.email}
                      disabled
                      className="border border-gray-200 rounded-full px-5 py-3.5 text-xs font-semibold tracking-wider bg-gray-50 text-gray-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="pphone" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="tel"
                      id="pphone"
                      value={profileData.phone}
                      onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="border border-gray-200 rounded-full px-5 py-3.5 text-xs font-semibold tracking-wider bg-[#FDFCF8] focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#DF9F28] hover:bg-[#c58b20] disabled:bg-gray-200 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer"
                  >
                    {savingProfile ? 'Saving Details...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: ADDRESS BOOK */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center select-none">
              <h2 className="text-xl font-serif font-semibold text-black">
                Shipping Addresses
              </h2>
              <button
                onClick={handleAddAddressClick}
                className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Address
              </button>
            </div>

            {/* Address Grid list */}
            {loadingAddresses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm h-48 animate-pulse"></div>
                ))}
              </div>
            ) : addresses.length === 0 ? (
              /* Empty Address State */
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center my-4">
                <div className="w-16 h-16 bg-[#F3F2EE] text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-serif tracking-wide text-black mb-1">No Saved Addresses</h3>
                <p className="text-gray-500 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
                  You haven't saved any shipping addresses to your profile yet. Add an address to enable fast, single-click checkout!
                </p>
                <button
                  onClick={handleAddAddressClick}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Create Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map(addr => (
                  <div 
                    key={addr.id}
                    className={`bg-white border rounded-[2rem] p-6 shadow-sm flex flex-col justify-between text-left transition-all hover:shadow-md relative ${
                      addr.isDefault ? 'border-[#DF9F28]/50 ring-1 ring-[#DF9F28]/20 bg-[#DF9F28]/2' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {/* Header: Name and Default Badge */}
                    <div className="flex justify-between items-start gap-4 mb-4 select-none">
                      <div>
                        <h4 className="font-serif font-bold text-gray-900 text-base">{addr.name}</h4>
                        <span className="text-[0.65rem] text-gray-400 font-semibold tracking-wide font-sans">{addr.phone}</span>
                      </div>
                      {addr.isDefault && (
                        <span className="bg-[#DF9F28]/10 text-[#DF9F28] text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#DF9F28]/10">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Address details */}
                    <p className="text-gray-600 text-xs leading-relaxed font-sans mb-6">
                      {addr.street},<br />
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>

                    {/* Actions row */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddressClick(addr)}
                          className="text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-50 cursor-pointer"
                          title="Edit Address"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 cursor-pointer"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[0.65rem] tracking-wider uppercase font-bold text-[#DF9F28] hover:text-[#c58b20] transition-colors cursor-pointer"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LUCKY TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="pb-5 border-b border-gray-100 flex items-center justify-between select-none">
              <div>
                <h2 className="text-xl font-serif font-semibold text-black">
                  Your Lucky Tickets
                </h2>
                <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest mt-0.5 font-semibold">
                  Tickets generated for active draw campaigns
                </p>
              </div>
            </div>

            {loadingTickets ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm h-36 animate-pulse"></div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center my-4 select-none">
                <div className="w-16 h-16 bg-[#F3F2EE] text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <Ticket className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-serif tracking-wide text-black mb-1">No Lucky Tickets</h3>
                <p className="text-gray-500 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
                  You don't have any lucky tickets yet. Purchase products during an active draw campaign to automatically receive tickets!
                </p>
                <Link
                  href="/product"
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Shop Now & Get Tickets
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map(ticket => {
                  const isInvalid = ticket.order?.status === 'CANCELLED' || ticket.order?.status === 'FAILED';
                  return (
                    <div
                      key={ticket.id}
                      className={`relative bg-white border border-gray-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-row overflow-hidden border-dashed ${isInvalid ? 'opacity-60 saturate-50' : ''}`}
                    >
                      {/* Punch Holes Decorators */}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-[#FDFCF8] border border-gray-200 z-10"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-[#FDFCF8] border border-gray-200 z-10"></div>

                      {/* Left side: Ticket Details */}
                      <div className="flex-1 p-6 flex flex-col justify-between pl-8">
                        <div>
                          <span className="inline-flex items-center gap-1 bg-[#DF9F28]/10 text-[#DF9F28] border border-[#DF9F28]/10 px-2 py-0.5 rounded-full text-[0.55rem] font-bold uppercase tracking-widest mb-3 select-none">
                            Lucky Ticket
                          </span>
                          <h4 className="text-base font-serif font-extrabold text-black uppercase tracking-wide leading-tight">
                            {ticket.drawCampaign?.name || "Lucky Draw"}
                          </h4>
                          <p className="text-[0.7rem] text-gray-500 font-semibold mt-1">
                            Prize: {ticket.drawCampaign?.prizeName || "Premium Reward"}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-1">
                          <span className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest block">Ticket ID</span>
                          <span className="font-mono text-sm font-extrabold text-black tracking-wide">
                            {ticket.ticketNumber}
                          </span>
                        </div>
                      </div>

                      {/* Visual Divider (Dashed) */}
                      <div className="border-l border-dashed border-gray-200 my-4 h-auto"></div>

                      {/* Right side: Linked Order details */}
                      <div className="w-1/3 p-6 bg-gray-50/50 flex flex-col justify-between items-center text-center select-none pr-8">
                        <div className="flex flex-col items-center">
                          <span className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest block">Linked Order</span>
                          <span className="text-xs font-bold text-gray-800 mt-1 font-mono tracking-wide">
                            {ticket.order?.id}
                          </span>
                        </div>

                        <div className="flex flex-col items-center mt-4 pt-4 border-t border-gray-100/50 w-full">
                          <span className="text-[0.55rem] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                          {isInvalid ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full text-[0.55rem] font-bold uppercase tracking-wider mt-1">
                              Invalid
                            </span>
                          ) : ticket.drawCampaign?.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[0.55rem] font-bold uppercase tracking-wider mt-1">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full text-[0.55rem] font-bold uppercase tracking-wider mt-1">
                              Closed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADDRESS ADD / EDIT POPUP MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FDFCF8] w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 md:p-8 bg-white border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-serif tracking-wider uppercase text-black font-semibold">
                {editingAddress ? 'Modify Address' : 'New Shipping Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleAddressSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 text-left">
              {addressError && (
                <div className="bg-red-50 text-red-600 text-xs p-4 rounded-2xl border border-red-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{addressError}</span>
                </div>
              )}

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Receiver Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="aname" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Recipient Name</label>
                  <input
                    type="text"
                    id="aname"
                    value={addressForm.name}
                    onChange={e => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Jane Doe"
                    className="border border-gray-200 rounded-full px-5 py-3 text-xs font-semibold tracking-wider bg-white focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28]"
                  />
                </div>

                {/* Receiver Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="aphone" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Contact Phone</label>
                  <input
                    type="tel"
                    id="aphone"
                    value={addressForm.phone}
                    onChange={e => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="+91 98765 43210"
                    className="border border-gray-200 rounded-full px-5 py-3 text-xs font-semibold tracking-wider bg-white focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28]"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="astreet" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Street Address</label>
                <input
                  type="text"
                  id="astreet"
                  value={addressForm.street}
                  onChange={e => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                  required
                  placeholder="Flat No, Wing, Apartment/Building, Street Name"
                  className="border border-gray-200 rounded-full px-5 py-3 text-xs font-semibold tracking-wider bg-white focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="acity" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    id="acity"
                    value={addressForm.city}
                    onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                    required
                    placeholder="Mumbai"
                    className="border border-gray-200 rounded-full px-5 py-3 text-xs font-semibold tracking-wider bg-white focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28]"
                  />
                </div>

                {/* State */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="astate" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">State</label>
                  <input
                    type="text"
                    id="astate"
                    value={addressForm.state}
                    onChange={e => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                    required
                    placeholder="Maharashtra"
                    className="border border-gray-200 rounded-full px-5 py-3 text-xs font-semibold tracking-wider bg-white focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28]"
                  />
                </div>

                {/* Pincode */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="apincode" className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Pincode</label>
                  <input
                    type="text"
                    id="apincode"
                    value={addressForm.pincode}
                    onChange={e => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                    required
                    placeholder="400052"
                    className="border border-gray-200 rounded-full px-5 py-3 text-xs font-semibold tracking-wider bg-white focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28]"
                  />
                </div>
              </div>

              {/* Set as Default Checkbox (if user already has addresses) */}
              {addresses.length > 0 && (!editingAddress || !editingAddress.isDefault) && (
                <label className="flex items-center gap-3 text-xs font-semibold text-gray-700 tracking-wider cursor-pointer group w-fit mt-3 select-none">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={e => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-200 text-[#DF9F28] focus:ring-[#DF9F28] accent-[#DF9F28]"
                  />
                  <span className="group-hover:text-black transition-colors">Set as my default shipping address</span>
                </label>
              )}

              {/* Modal Actions Footer */}
              <div className="flex gap-4 pt-6 border-t border-gray-50 select-none">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="flex-1 bg-[#DF9F28] hover:bg-[#c58b20] disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  {savingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-4 rounded-full shadow-2xl z-[300] flex items-center gap-3 animate-fadeIn">
          <div className="bg-green-500 rounded-full p-1">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase">
            {toastMessage}
          </span>
        </div>
      )}

      <Footer />
    </div>
  );
}
