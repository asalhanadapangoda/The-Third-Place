import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/utils/data";

export default async function WebsiteLayout({ children }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
