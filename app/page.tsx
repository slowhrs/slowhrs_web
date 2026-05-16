import Loader from "@/components/Loader";
import Ticker from "@/components/Ticker";
import Nav from "@/components/Nav";
import HeroLobby from "@/components/HeroLobby";
import EventsSection from "@/components/EventsSection";
import UpcomingEvents from "@/components/UpcomingEvents";
import DropsSection from "@/components/DropsSection";
import UpdatesSection from "@/components/UpdatesSection";
import ArchiveSection from "@/components/ArchiveSection";
import CastingCalls from "@/components/CastingCalls";
import InquirySection from "@/components/InquirySection";
import AccessSection from "@/components/AccessSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 
        The boot loader will render on top and disappear. 
        In a real app, this might be managed by context.
      */}
      <Loader />

      {/* Global Navigation & Ticker */}
      <Ticker />
      <Nav />

      {/* Home / Lobby Section */}
      <HeroLobby />

      {/* Events / Calendar Section */}
      <EventsSection />

      {/* Upcoming Events / Flyers */}
      <UpcomingEvents />

      {/* Drops / Shop Section */}
      <DropsSection />

      {/* Updates / Transmission Feed */}
      <UpdatesSection />

      {/* Archive / Evidence Section */}
      <ArchiveSection />

      {/* Casting Calls */}
      <CastingCalls />

      {/* Inquiry / Terminal Section */}
      <InquirySection />

      {/* Access / Membership Section */}
      <AccessSection />

      {/* Footer / Policies */}
      <FooterSection />
      
    </main>
  );
}
