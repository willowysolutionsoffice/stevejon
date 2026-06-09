import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovingNewsBar from "@/components/MovingNewsBar";
import Categories from "@/components/Categories";
import NewArrivals from "@/components/NewArrivals";
import PromoSection from "@/components/PromoSection";
import LuckyDrawPoster from "@/components/LuckyDrawPoster";
import Banner from "@/components/Banner";
import ProductCollectionGrid from "@/components/ProductCollectionGrid";
import Winners from "@/components/Winners";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans">
      <Navbar />
      <Hero />
      <MovingNewsBar />
      <Categories />
      <NewArrivals />
      <PromoSection />
      <LuckyDrawPoster />
      <Banner />
      <ProductCollectionGrid />
      <Winners />
      <Testimonials />
      <Footer />
    </div>
  );
}
