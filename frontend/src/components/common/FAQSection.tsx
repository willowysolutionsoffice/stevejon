"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for all unworn and unwashed ethnic wear with original tags intact. Returns are convenient and hassle-free.",
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is dispatched, you will receive a tracking link via email and SMS. You can also track your order from your profile dashboard.",
  },
  {
    question: "Are the colors shown accurate?",
    answer: "We strive to display our products as accurately as possible. However, due to different screen settings and studio lighting, slight variations in color may occur.",
  },
  {
    question: "Do you offer alterations?",
    answer: "Currently, we do not provide in-house alterations. However, our products come with margins that allow for minor adjustments by local tailors.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, and Net Banking through our secure payment partner, Razorpay.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-16 border-t pt-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
          <HelpCircle size={24} />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4 max-w-4xl">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-stone-100 rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-stone-50 transition-colors"
            >
              <span className="font-semibold text-stone-800">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-stone-400" size={20} />
              ) : (
                <ChevronDown className="text-stone-400" size={20} />
              )}
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 pt-0 text-sm text-stone-600 leading-relaxed border-t border-stone-50 bg-stone-50/50">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
