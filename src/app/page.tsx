import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import MediaPreview from "@/components/sections/MediaPreview";
import StoriesTeaser from "@/components/sections/StoriesTeaser";
import JoinCTA from "@/components/sections/JoinCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-background page-fade-in">
      <Navbar />
      <HeroSection />

      <div className="relative z-10 bg-background">
        <AboutSection />
        <MediaPreview />
        <StoriesTeaser />
        <JoinCTA />
      </div>

      <Footer />
    </main>
  );
}
