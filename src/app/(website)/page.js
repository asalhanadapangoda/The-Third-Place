import HeroSection from "@/components/home/HeroSection";
import BrandIntroSection from "@/components/home/BrandIntroSection";
import SipMenuSection from "@/components/home/SipMenuSection";
import ChatCommunitySection from "@/components/home/ChatCommunitySection";
import PlayReadSection from "@/components/home/PlayReadSection";
import UpcomingEventsSection from "@/components/home/UpcomingEventsSection";
import SpaceGallerySection from "@/components/home/SpaceGallerySection";
import ContactSection from "@/components/home/ContactSection";
import {
  getEvents,
  getGalleryImages,
  getMenuData,
  getPageContent,
  getSiteSettings,
} from "@/lib/utils/data";

export default async function HomePage() {
  const [homePage, communityPage, menuData, events, galleryImages, settings] =
    await Promise.all([
      getPageContent("home"),
      getPageContent("community"),
      getMenuData(),
      getEvents(),
      getGalleryImages(),
      getSiteSettings(),
    ]);

  return (
    <>
      <HeroSection page={homePage} settings={settings} />
      <BrandIntroSection page={homePage} />
      <SipMenuSection items={menuData.items} />
      <ChatCommunitySection page={communityPage} />
      <PlayReadSection />
      <UpcomingEventsSection events={events} />
      <SpaceGallerySection images={galleryImages} />
      <ContactSection settings={settings} />
    </>
  );
}
