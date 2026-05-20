"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      // Create Account
      localStorage.setItem('stevejon_user', JSON.stringify({ name, email, password }));
      alert("Account created successfully!");
      router.push('/');
    } else {
      // Login
      const storedUserData = localStorage.getItem('stevejon_user');
      if (storedUserData) {
        const storedUser = JSON.parse(storedUserData);
        if (storedUser.email === email && storedUser.password === password) {
          alert("Logged in successfully!");
          router.push('/');
        } else {
          alert("Invalid email or password");
        }
      } else {
        alert("No account found. Please sign up.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] flex flex-col md:flex-row font-sans">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 relative bg-[#1A1A1A]">
        {/* Placeholder for a nice image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-luminosity"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-[0.3em] font-light z-10 text-center px-10">
            STEVEJON
          </h1>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-8 md:p-24 relative">
        <Link
          href="/"
          className="absolute top-8 right-8 text-xs font-bold tracking-[0.2em] text-[#666] hover:text-black transition-colors uppercase"
        >
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-3xl font-serif mb-4 text-[#1A1A1A]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-[#666] text-sm">
              {isLogin
                ? "Sign in to access your bespoke orders, saved items, and personalized recommendations."
                : "Join Stevejon to experience the pinnacle of personalized tailoring and exclusive collections."}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold tracking-widest text-[#1A1A1A] mb-2 uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-[#ccc] bg-transparent pb-3 pt-2 px-0 focus:outline-none focus:border-black transition-colors text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-widest text-[#1A1A1A] mb-2 uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-[#ccc] bg-transparent pb-3 pt-2 px-0 focus:outline-none focus:border-black transition-colors text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold tracking-widest text-[#1A1A1A] uppercase">
                  Password
                </label>
                {isLogin && (
                  <a
                    href="#"
                    className="text-xs text-[#DF9F28] hover:text-black transition-colors"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-[#ccc] bg-transparent pb-3 pt-2 px-0 focus:outline-none focus:border-black transition-colors text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-black text-white py-4 rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-colors mt-8"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[#666] text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-[#1A1A1A] hover:text-[#DF9F28] transition-colors border-b border-[#1A1A1A] pb-0.5"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
