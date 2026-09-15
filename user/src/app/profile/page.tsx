'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Check,
  Trash2,
  Edit,
  Plus,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Ticket,
  Trophy,
  Package,
  X,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authClient } from '@/lib/auth-client';
import { getApiUrl } from '@/lib/api';

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
  const apiUrl = getApiUrl();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'tickets'>('profile');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    createdAt: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

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
    isDefault: false,
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Protection & Fetch
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
              name: result.data.name || session.user.name || '',
              email: result.data.email || session.user.email || '',
              phone: result.data.phone || '',
              image: result.data.image || '',
              createdAt: result.data.createdAt || '',
            });
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
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
        console.error('Error loading addresses:', err);
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
        console.error('Error loading tickets:', err);
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchProfile();
    fetchAddresses();
    fetchTickets();
  }, [session, isPending, router, apiUrl]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);

    try {
      const res = await fetch(`${apiUrl}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        showToast('Profile updated successfully');
      } else {
        setProfileError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleOpenAddressModal = (addr?: SavedAddress) => {
    if (addr) {
      setEditingAddress(addr);
      setAddressForm({
        name: addr.name,
        phone: addr.phone,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        isDefault: addr.isDefault,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        name: profileData.name || '',
        phone: profileData.phone || '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: addresses.length === 0,
      });
    }
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressError(null);

    try {
      const url = editingAddress
        ? `${apiUrl}/profile/addresses/${editingAddress.id}`
        : `${apiUrl}/profile/addresses`;
      const method = editingAddress ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addressForm),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setIsAddressModalOpen(false);
        showToast(editingAddress ? 'Address updated' : 'Address added');
        const refreshed = await fetch(`${apiUrl}/profile/addresses`, { credentials: 'include' });
        if (refreshed.ok) {
          const refData = await refreshed.json();
          setAddresses(refData.data || []);
        }
      } else {
        setAddressError(result.error || 'Failed to save address');
      }
    } catch (err) {
      setAddressError('Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/profile/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        showToast('Address deleted');
      }
    } catch (err) {
      showToast('Failed to delete address');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Navbar />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 py-10 md:py-16">
        <div className="sj-container space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                ACCOUNT MANAGEMENT
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Customer Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage your personal information, saved delivery addresses, and lucky draw tickets.
              </p>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase text-slate-600 hover:text-blue-600 tracking-wider"
            >
              <Package className="w-4 h-4" />
              <span>View My Orders</span>
            </Link>
          </div>

          {/* User Profile Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'profile', label: 'Personal Information', icon: User },
              { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
              { id: 'tickets', label: `Lucky Draw Tickets (${tickets.length})`, icon: Ticket },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Profile Information */}
          {activeTab === 'profile' && (
            <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-serif font-bold text-2xl flex items-center justify-center border border-blue-200 shadow-inner">
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{profileData.name || 'JudesCart Member'}</h3>
                  <p className="text-xs text-slate-500">{profileData.email}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profileData.email}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {profileError && (
                  <p className="text-xs text-rose-600 font-medium">{profileError}</p>
                )}

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
                >
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Saved Delivery Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Your Saved Addresses
                </h3>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {loadingAddresses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">No delivery addresses saved yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
                    >
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider border border-blue-200">
                              Default Address
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {addr.street}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-slate-500">Phone: {addr.phone}</p>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs">
                        <button
                          onClick={() => handleOpenAddressModal(addr)}
                          className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Lucky Draw Tickets */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200/80 flex items-start gap-4">
                <Ticket className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div className="space-y-1 text-xs text-amber-900">
                  <h4 className="font-bold text-sm">JudesCart Community Lucky Tickets</h4>
                  <p className="text-amber-800">
                    Each ticket is tied to a verified order ID. Draw winners are selected in our live weekly campaigns and notified automatically.
                  </p>
                </div>
              </div>

              {loadingTickets ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                  <Ticket className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">You don&apos;t have any active lucky draw tickets yet.</p>
                  <Link
                    href="/product"
                    className="inline-block px-5 py-2 bg-blue-600 text-white text-xs font-bold uppercase rounded-full"
                  >
                    Place an Order to Earn Tickets
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {tickets.map((t, idx) => (
                    <div
                      key={t.id || idx}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Lucky Ticket
                        </span>
                        {t.isWinner ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase border border-amber-300">
                            WINNER!
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase">
                            Registered
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-bold font-mono text-slate-900 tracking-wider">
                          {t.ticketNumber || t.id}
                        </p>
                        <p className="text-xs text-slate-500">
                          Order: <span className="font-semibold text-slate-700">{t.orderId}</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        Generated on {new Date(t.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Address Modal Dialog */}
          {isAddressModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    {editingAddress ? 'Edit Address' : 'New Delivery Address'}
                  </h3>
                  <button onClick={() => setIsAddressModalOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name *"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Street Address, Flat/House No *"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City *"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State *"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="PIN / Postal Code *"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />

                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span className="text-slate-700">Set as default delivery address</span>
                  </label>

                  {addressError && <p className="text-rose-600">{addressError}</p>}

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider"
                    >
                      {savingAddress ? 'Saving...' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(false)}
                      className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
