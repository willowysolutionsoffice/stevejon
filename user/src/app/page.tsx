import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import NewArrivals from "@/components/NewArrivals";
import BenefitsSection from "@/components/BenefitsSection";
import LuckyDrawPoster from "@/components/LuckyDrawPoster";
import RecentlyViewed from "@/components/RecentlyViewed";
import Winners from "@/components/Winners";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-28">
        <Hero />
        <div className="mt-5 sm:mt-7 md:mt-9">
          <Categories />
        </div>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <NewArrivals />
        </div>
        <div className="mt-14 sm:mt-18 md:mt-22">
          <BenefitsSection />
        </div>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <LuckyDrawPoster />
        </div>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <RecentlyViewed />
        </div>
        <div className="mt-12 sm:mt-16 md:mt-20">
          <Winners />
        </div>
      </main>
      <Footer />
    </div>
  );
}
