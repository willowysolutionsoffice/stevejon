import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import NewArrivals from "@/components/NewArrivals";
import Banner from "@/components/Banner";
import ProductCollectionGrid from "@/components/ProductCollectionGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans">
      <Navbar />
      <Hero />
      <Categories />
      <NewArrivals />
      <Banner />
      <ProductCollectionGrid />
      <Footer />
    </div>
  );
}
