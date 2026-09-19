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
      <main className="flex-1 space-y-10 sm:space-y-14 pb-20 pt-2">
        <Hero />
        <Categories />
        <NewArrivals />
        <BenefitsSection />
        <LuckyDrawPoster />
        <RecentlyViewed />
        <Winners />
      </main>
      <Footer />
    </div>
  );
}
