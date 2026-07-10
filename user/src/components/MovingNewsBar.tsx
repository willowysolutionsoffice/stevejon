import React from "react";

export default function MovingNewsBar() {
  const offers = [
    " SPECIAL OFFERS: EXPLORE OUR EXCLUSIVE OUTLET",
    " TODAY'S DEALS: UP TO 30% OFF SARTORIAL SELECTIONS",
    " FREE SHIPPING ON ALL ORDERS ABOVE $499",
    <>
      {" "}
      USE CODE: <strong>SJWELCOMETS</strong> FOR FLAT 15% OFF ON YOUR FIRST
      ORDER
    </>,
    " STEVEJON ATELIER: BESPOKE PERSONALIZED TAILORING AVAILABLE NOW",
  ];
  return (
    <div className="w-full bg-[#021631] text-white/90 py-3.5 text-[9px] md:text-[10px] tracking-[0.2em] font-sans font-medium uppercase overflow-hidden border-y border-white/10 flex select-none relative z-30">
      <div className="flex min-w-full shrink-0 items-center justify-around gap-16 animate-marquee">
        {offers.map((offer, i) => (
          <React.Fragment key={`orig-${i}`}>
            <span>{offer}</span>
            <span className="text-[#0077FF]">·</span>
          </React.Fragment>
        ))}
      </div>
      <div
        className="flex min-w-full shrink-0 items-center justify-around gap-16 animate-marquee"
        aria-hidden="true"
      >
        {offers.map((offer, i) => (
          <React.Fragment key={`dup-${i}`}>
            <span>{offer}</span>
            <span className="text-[#0077FF]">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
