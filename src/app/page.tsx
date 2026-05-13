import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-8 py-6 text-white/90 text-xs tracking-[0.15em] font-medium mix-blend-difference">
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">SHOP</a>
          <a href="#" className="hover:text-white transition-colors">COLLECTIONS</a>
          <a href="#" className="hover:text-white transition-colors">ATELIER</a>
        </div>
        <div className="text-2xl tracking-[0.3em] font-serif pr-4">
          STEVEJON
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">SEARCH</a>
          <a href="#" className="hover:text-white transition-colors">ACCOUNT</a>
          <a href="#" className="hover:text-white transition-colors">BAG (0)</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 z-0 bg-black/40"></div>
        <Image 
          src="/hero_bg_1778669817649.png" 
          alt="Stevejon Hero" 
          fill
          priority
          className="absolute inset-0 z-[-1] object-cover object-center" 
        />
        
        <div className="z-10 text-center flex flex-col items-center mt-32 px-4">
          <h1 className="text-3xl md:text-[2.8rem] font-serif tracking-[0.1em] mb-10 text-center max-w-4xl leading-snug drop-shadow-lg">
            STEVEJON | THE NEW <br/> STANDARD OF REFINEMENT
          </h1>
          <button className="border border-white/60 px-10 py-3 text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 ease-in-out backdrop-blur-sm">
            EXPLORE NOW
          </button>
        </div>
        {/* Subtle bottom line element from design */}
        <div className="absolute bottom-8 w-3/4 max-w-lg h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </section>

      {/* Categories */}
      <section className="px-4 py-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "TIMELESS APPAREL", img: "/cat_apparel_1778670103427.png" },
          { title: "LEATHER GOODS", img: "/cat_leather_1778670351299.png" },
          { title: "SIGNATURE ACCESSORIES", img: "/cat_accessories_1778670517925.png" }
        ].map((cat, i) => (
          <div key={i} className="group relative aspect-[4/5] overflow-hidden bg-gray-200 cursor-pointer">
            <Image 
              src={cat.img} 
              alt={cat.title} 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-sm tracking-widest uppercase">{cat.title}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-center md:text-left mb-12">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {[
            { title: "Overshirt", price: "$850", img: "/prod_overshirt_1778670536589.png" },
            { title: "Trouser", price: "$620", img: "/prod_trouser_1778670553370.png" },
            { title: "Pocket Square", price: "$150", img: "/prod_overshirt_1778670536589.png" },
            { title: "Belt", price: "$280", img: "/prod_trouser_1778670553370.png" },
          ].map((prod, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-[#F3F2EE] mb-4 overflow-hidden">
                <div className="absolute top-3 left-3 bg-white px-2 py-1 text-[0.6rem] font-bold tracking-widest z-10 shadow-sm">NEW</div>
                <Image 
                  src={prod.img} 
                  alt={prod.title} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm text-gray-900">{prod.title}</h4>
                <p className="text-sm font-semibold">{prod.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="bg-black text-white text-center py-8 text-xs tracking-[0.15em] uppercase">
        <p className="opacity-90">
          PRIVATE INVITATION: ENJOY 15% OFF YOUR INAUGURAL ORDER.<br className="md:hidden" /> USE CODE: <span className="font-semibold text-white">SJWELCOMETS</span>
        </p>
      </section>

      {/* Product Collection Grid */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-center md:text-left mb-12">Product Collection Grid</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16">
          {[
            { title: "Overcoat", price: "$2,450", img: "/cat_apparel_1778670103427.png" },
            { title: "Blazer", price: "$1,200", img: "/prod_overshirt_1778670536589.png" },
            { title: "Knit", price: "$950", img: "/prod_trouser_1778670553370.png" },
            { title: "Duffle", price: "$650", img: "/cat_leather_1778670351299.png" },
            { title: "Scarf", price: "$1,100", img: "/cat_accessories_1778670517925.png" },
            { title: "Watch", price: "$850", img: "/prod_overshirt_1778670536589.png" },
          ].map((prod, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-square bg-[#F3F2EE] mb-4 overflow-hidden">
                <Image 
                  src={prod.img} 
                  alt={prod.title} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm text-gray-900">{prod.title}</h4>
                <p className="text-sm font-semibold">{prod.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-white pt-20 pb-10 px-8 text-xs font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-4">
            <h5 className="tracking-widest uppercase mb-2 opacity-80">CUSTOMER CARE</h5>
            <a href="#" className="text-[#888] hover:text-white transition-colors">About Us</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Customer Care</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Shipping</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Returns</a>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="tracking-widest uppercase mb-2 opacity-80">EXPLORE</h5>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Collections</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Atelier</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Journal</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Privacy Policy</a>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="tracking-widest uppercase mb-2 opacity-80">COMPANY</h5>
            <a href="#" className="text-[#888] hover:text-white transition-colors">About</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Careers</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Stores</a>
            <a href="#" className="text-[#888] hover:text-white transition-colors">Contact Us</a>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="tracking-widest uppercase mb-2 opacity-80">JOIN THE PRIVATE LIST</h5>
            <p className="text-[#888] leading-relaxed">Sign up for newsletters and updates on our collections and atelier.</p>
            <div className="flex mt-2 border-b border-[#333] pb-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-transparent w-full outline-none text-white placeholder-[#555] text-sm"
              />
              <button className="text-white hover:text-gray-300 transition-colors">→</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#222]">
          <p className="text-[#555] mb-4 md:mb-0">© {new Date().getFullYear()} STEVEJON. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            {/* Simple social links placeholders */}
            <a href="#" className="text-[#555] hover:text-white transition-colors">FB</a>
            <a href="#" className="text-[#555] hover:text-white transition-colors">IG</a>
            <a href="#" className="text-[#555] hover:text-white transition-colors">TW</a>
            <a href="#" className="text-[#555] hover:text-white transition-colors">LI</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
