'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Mail, Phone, MapPin, HelpCircle } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQ_ITEMS = [
  {
    category: "Sartorial & Fitting",
    question: "How do I determine my correct measurements?",
    answer: "We recommend reviewing our detailed online sizing guides available on each product page. For our bespoke and made-to-measure collections, we highly recommend booking a complimentary styling and fitting consultation at one of our physical ateliers. Our master tailors will guide you through taking your precise posture and body dimensions."
  },
  {
    category: "Sartorial & Fitting",
    question: "What distinguishes canvassed tailoring from fused construction?",
    answer: "Every suit at Stevejon Atelier is built with half or full-canvassed construction. This traditional approach utilizes a hand-sewn horsehair canvas interlayer that naturally conforms to your body shape over time, producing a soft chest roll, natural drape, and superior longevity. Fused suits, by contrast, use glued synthetics that stiffen and wear out quickly."
  },
  {
    category: "Sartorial & Fitting",
    question: "Can I choose my own linings and custom details?",
    answer: "Yes, our bespoke and made-to-measure programs offer extensive customization options, including premium silk or cupro lining designs, custom natural horn buttons, personal monogramming, lapel styling (notch, peak, or shawl), and vent configurations."
  },
  {
    category: "Orders & Shipping",
    question: "How long does it take for my order to be crafted and shipped?",
    answer: "Our standard-size Atelier collections are prepared and shipped within 2–3 business days. For made-to-measure and custom bespoke creations, please allow 4–6 weeks for precision crafting, inspection, and delivery."
  },
  {
    category: "Orders & Shipping",
    question: "Do you offer international shipping and duties coverage?",
    answer: "We offer complimentary worldwide express shipping via DHL Express or FedEx on all orders. For international shipments, duties and taxes are calculated at checkout and can be prepaid, ensuring a seamless, door-to-door delivery with no unexpected customs delays."
  },
  {
    category: "Orders & Shipping",
    question: "Can I modify or cancel a bespoke order?",
    answer: "Bespoke and made-to-measure orders can be modified or cancelled within 24 hours of purchase. Once our tailors have begun cutting the fabrics for your specific measurements, the order cannot be modified, cancelled, or refunded."
  },
  {
    category: "Returns & Alterations",
    question: "What is your return policy for standard sizes?",
    answer: "Standard-size items in unworn, unwashed, and original condition with all security tags intact may be returned for a full refund or exchange within 14 days of receipt. Return shipping is complimentary."
  },
  {
    category: "Returns & Alterations",
    question: "How do you handle alterations if my garment does not fit perfectly?",
    answer: "We want your garment to fit flawlessly. We offer complimentary basic alterations (such as hem adjustments or sleeve adjustments) on all standard purchases within 30 days of delivery. You can visit any Stevejon store or contact our concierge to facilitate a return to our workshop."
  },
  {
    category: "Lucky Draw & Campaigns",
    question: "How is the authenticity of the Lucky Draw guaranteed?",
    answer: "To ensure absolute transparency and fairness, the Stevejon Lucky Draw utilizes a mathematically verifiable, cryptographic random-selection protocol. All drawings are recorded and can be audited. We do not use manual drawings."
  },
  {
    category: "Lucky Draw & Campaigns",
    question: "If I win a Lucky Draw prize, are there additional fees?",
    answer: "No. Winners of the Stevejon Lucky Draw campaigns are not charged any delivery fees, taxes, or premium surcharges. The reward is shipped to your registered address free of charge as a gesture of appreciation from our atelier."
  }
];

const CATEGORIES = ["All", "Sartorial & Fitting", "Orders & Shipping", "Returns & Alterations", "Lucky Draw & Campaigns"];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_ITEMS.filter(faq => {
      const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#061B3A] font-sans">
      <Navbar />

      {/* Hero Header Section */}
      <div className="relative pt-36 pb-20 bg-[#031B3F] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/85 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105" 
          style={{ backgroundImage: `url('/cat_leather_1778670351299.png')` }}
        />
        <div className="relative z-20 max-w-4xl mx-auto text-center px-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#0077FF] font-bold mb-4 block">
            ASSISTANCE & INFORMATION
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-[0.1em] text-white mb-6">
            Sartorial Inquiries
          </h1>
          <p className="text-sm text-white/60 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Find answers to standard inquiries about our fitting program, atelier craftsmanship, orders, returns, and lucky draw events.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-200/60 mb-12">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#E7F2FF] border-0 rounded-full pl-11 pr-5 py-3 text-sm focus:ring-1 focus:ring-[#0077FF] focus:bg-white outline-none transition-all placeholder-gray-400"
            />
          </div>

          {/* Categories Tab Scrollbar */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full -mx-6 px-6 md:mx-0 md:px-0">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setOpenIndex(null);
                }}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border ${
                  selectedCategory === category
                    ? "bg-[#061B3A] border-[#061B3A] text-white"
                    : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Quick Links & Help Desk */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-[#E7F2FF] rounded-2xl p-8 space-y-6">
              <h3 className="text-sm font-bold tracking-widest uppercase text-gray-900">
                Atelier Assistance
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Our customer concierge is available to guide you on product specifications, fits, sizing advice, and shipping arrangements.
              </p>
              
              <div className="space-y-4 pt-4 border-t border-gray-300/40">
                <div className="flex items-center gap-3 text-xs text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0077FF]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <a href="mailto:concierge@stevejon.com" className="text-gray-500 hover:underline">concierge@stevejon.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0077FF]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Call Concierge</p>
                    <p className="text-gray-500">+91 90370 64460</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0077FF]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Flagship Atelier</p>
                    <p className="text-gray-500">123 Rue de l'Atelier, Paris</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200/80 rounded-2xl p-8 text-center space-y-4">
              <HelpCircle className="w-8 h-8 text-[#0077FF] mx-auto" />
              <h4 className="text-xs font-bold tracking-widest uppercase">Need Fitting?</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Schedule a personal digital custom fitting session with one of our stylists.
              </p>
              <button className="w-full bg-[#061B3A] text-white hover:bg-[#0B2A55] transition-colors py-3 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Book Consultation
              </button>
            </div>
          </div>

          {/* Right: Interactive FAQ Accordion List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      key={faq.question}
                      className="border-b border-gray-200/80 pb-4"
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex justify-between items-center text-left py-4 text-gray-900 hover:text-[#0077FF] transition-colors focus:outline-none"
                      >
                        <span className="text-sm font-semibold tracking-wide pr-6">
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-[#0077FF]" : ""
                          }`} 
                        />
                      </button>
                      
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-xs text-gray-500 leading-relaxed font-light">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 space-y-3"
                >
                  <p className="text-sm text-gray-400 font-light">No FAQs match your search query.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                    className="text-xs font-semibold text-[#0077FF] underline underline-offset-4"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
