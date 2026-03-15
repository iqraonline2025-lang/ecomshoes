import BestSellers from "../components/BestSellers";
import BrandSection from "../components/BrandSection";
import FeaturedCategories from "../components/FeaturedCategories";
import FlashSale from "../components/FlashSale";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import NewArrivals from "../components/NewArrivals";
import Newsletter from "../components/NewsLetter";
import WhyChooseUs from "../components/WhyChooseUs";

export default function Home() {
 return (
    <>
     <Navbar />
     <Hero />
     <FeaturedCategories />
     <BestSellers />
     <NewArrivals />
     <FlashSale />
     <BrandSection />
     <WhyChooseUs />
     <Newsletter />
     <Footer />
    </>
 )
}
