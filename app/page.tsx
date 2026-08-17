import PaperGrain from "@/components/PaperGrain";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImageMarquee from "@/components/ImageMarquee";
import MarqueeStrip from "@/components/MarqueeStrip";
import ServicesSection from "@/components/Services";
import FeaturedWeddings from "@/components/Featured";
import TheStudio from "@/components/Studio";
import SmoothScroll from "@/components/SmoothScroll";
import Philosophy from "@/components/Philosophy";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/Insta";
import Enquire from "@/components/Enquire";
import Footer from "@/components/Footer";
import InstagramReels from "@/components/Reels";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <PaperGrain />
      <Header />
      <Hero />
      <ImageMarquee />
      <MarqueeStrip />
      <Philosophy />
      <ServicesSection />
      <FeaturedWeddings />
      <TheStudio />
      <Process />
      <Testimonials />
      <InstagramFeed />
      <InstagramReels />
      <Enquire />
      <Footer />
    </SmoothScroll>
  );
}
