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
      <main className="flex-1 space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 pb-20 md:pb-28">
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
