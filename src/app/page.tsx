import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import MusicSection from "@/components/sections/MusicSection";
import EventsSection from "@/components/sections/EventsSection";
import DonateSection from "@/components/sections/DonateSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MusicSection />
      <EventsSection />
      <DonateSection />
      <Footer />
    </main>
  );
}
