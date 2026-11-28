import ContactSection from "@/components/home/ContactSection";
import { getSiteSettings } from "@/lib/utils/data";

export const metadata = {
  title: "Contact",
  description:
    "Visit The Third Place at TRACE Expert City, Colombo 10, Sri Lanka. Call 077 220 1989, message us on WhatsApp, or send an enquiry.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactSection settings={settings} />;
}
