'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Mail, User, Phone, Check, AlertCircle, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isChangePassword) {
        const { error } = await (authClient as any).changePassword({
          newPassword: password,
          currentPassword: oldPassword,
          revokeOtherSessions: true,
        });

        if (error) {
          setErrorMessage(error.message || 'Failed to change password.');
        } else {
          setSuccessMessage('Password changed successfully! Please login with your new password.');
          setIsChangePassword(false);
          setIsLogin(true);
          setPassword('');
          setOldPassword('');
        }
        return;
      }

      if (isForgotPassword) {
        const { error } = await (authClient as any).forgetPassword({
          email: email,
          redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
          setErrorMessage(error.message || 'Failed to initiate password reset.');
        } else {
          setSuccessMessage(`If an account exists for ${email}, a password reset link has been sent.`);
          setIsForgotPassword(false);
          setIsLogin(true);
          setPassword('');
        }
        return;
      }

      if (!isLogin) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          phone,
        } as any);

        if (error) {
          setErrorMessage(error.message || 'Failed to create account.');
        } else {
          setSuccessMessage('Account created successfully!');
          router.push('/');
          router.refresh();
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message || 'Invalid email or password.');
        } else {
          setSuccessMessage('Signed in successfully!');
          router.push('/');
          router.refresh();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900">
      
      {/* Left Column: Visual Brand Editorial Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-12 lg:p-16 overflow-hidden">
        <div className="absolute inset-0 bg-radial from-blue-900/40 via-slate-950/80 to-slate-950 pointer-events-none" />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/cat_apparel_1778670103427.png"
            alt="JudesCart Lifestyle"
            fill
            className="object-cover opacity-30 brightness-75"
          />
        </div>

        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white/10 p-1 flex items-center justify-center border border-white/10">
              <Image
                src="/logo-icon.webp"
                alt="JudesCart Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-xl font-extrabold tracking-tight text-white">
                Judes<span className="text-blue-400">Cart</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Quote */}
        <div className="relative z-10 max-w-md space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold tracking-widest uppercase">
            <span>PREMIUM SHOPPING & REWARDS</span>
          </span>
          <h2 className="text-3xl lg:text-4xl font-sans font-extrabold text-white leading-snug">
            Enduring Style. Personalised Service. Exclusive Rewards.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Sign in to track orders, manage your address book, and view your verified lucky draw tickets.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} JudesCart. All rights reserved.
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        <Link
          href="/"
          className="absolute top-8 right-8 inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
              {isChangePassword ? 'CREDENTIAL UPDATE' : isForgotPassword ? 'RECOVERY' : isLogin ? 'WELCOME BACK' : 'MEMBERSHIP'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-sans font-extrabold text-slate-900 tracking-tight">
              {isChangePassword
                ? 'Update Password'
                : isForgotPassword
                ? 'Reset Your Password'
                : isLogin
                ? 'Sign In to JudesCart'
                : 'Create an Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isChangePassword
                ? 'Enter your current and new credentials below.'
                : isForgotPassword
                ? 'Enter your registered email to receive a recovery link.'
                : isLogin
                ? 'Access your saved pieces, orders, and lucky draw tickets.'
                : 'Join the JudesCart community to unlock seamless checkout and weekly rewards.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgotPassword && !isChangePassword && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {isChangePassword && (
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            {!isForgotPassword && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    {isChangePassword ? 'New Password' : 'Password'}
                  </label>
                  {isLogin && (
                    <div className="flex gap-3 text-[11px]">
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(true); setIsLogin(false); setErrorMessage(null); }}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isExecuting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {isChangePassword
                    ? 'Save New Password'
                    : isForgotPassword
                    ? 'Send Reset Link'
                    : isLogin
                    ? 'Sign In to Account'
                    : 'Complete Registration'}
                </span>
              )}
            </button>
          </form>

          {/* Switch Modes */}
          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            {isForgotPassword || isChangePassword ? (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsChangePassword(false);
                    setIsLogin(true);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-blue-600 hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            ) : isLogin ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-blue-600 hover:underline ml-1"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-blue-600 hover:underline ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
