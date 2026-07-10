import React from 'react';

export default function Testimonials() {
  return (
    <section className="py-24 px-4 md:px-8 bg-[#F1F7FF] border-t border-b border-[#EAE8E1]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-center mb-16 tracking-wide">Client Testimonials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              quote: "The quality of the craftsmanship is unparalleled. Each piece feels like it was tailored specifically for me.",
              author: "Jonathan R.",
              location: "New York"
            },
            {
              quote: "Stevejon has completely redefined my wardrobe. The materials are exquisite and the attention to detail is evident.",
              author: "Marcus T.",
              location: "London"
            },
            {
              quote: "A seamless experience from start to finish. The garments have an enduring elegance that I absolutely love.",
              author: "Alexander H.",
              location: "Paris"
            }
          ].map((testimonial, index) => (
            <div key={index} className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#EAE8E1] group transition-transform duration-300 hover:-translate-y-1">
              <div className="mb-6 text-[#061B3A] opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
              <p className="font-serif text-[1.05rem] leading-relaxed mb-6 italic text-[#0B2A55]">"{testimonial.quote}"</p>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-1">{testimonial.author}</h4>
              <span className="text-[0.65rem] text-[#607A9D] uppercase tracking-wider">{testimonial.location}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
