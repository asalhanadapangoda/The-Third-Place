import Link from "next/link";
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import BrandLogo from "@/components/ui/BrandLogo";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/story" },
  { label: "Sip – Menu", href: "/menu" },
  { label: "Play & Read", href: "/play-read" },
  { label: "Events – Join In", href: "/events" },
  { label: "Our Space", href: "/space" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ settings }) {
  const phone = settings?.phone || "077 220 1989";
  const whatsapp = settings?.whatsapp_number || "94772201989";
  const address = settings?.address || "TRACE Expert City, Colombo 10, Sri Lanka";
  const hours = settings?.opening_hours || [];
  const socials = settings?.social_links || {};
  const activeSocials = Object.entries(socials).filter(([, url]) => Boolean(url));

  return (
    <footer className="bg-primary text-cream mt-auto">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/">
              <BrandLogo light />
            </Link>
            <p className="font-sans text-sm leading-relaxed text-cream/80 max-w-sm">
              A welcoming coffee shop and community space at TRACE Expert City,
              Colombo 10. Come to sip specialty coffee, connect with friends,
              work calmly, read, play, and join in.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`tel:+${whatsapp}`}
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-4 py-2 font-sans text-xs font-medium text-cream hover:bg-terracotta hover:border-terracotta transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 font-sans text-xs font-medium text-cream hover:bg-terracotta-hover transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="lg:col-span-3 space-y-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-cream/65">
              Explore
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream/85 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="lg:col-span-2 space-y-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-cream/65">
              Opening Hours
            </p>
            {hours.length > 0 ? (
              <ul className="space-y-3">
                {hours.map((row) => (
                  <li
                    key={row.days}
                    className="flex items-start gap-2.5 font-sans text-sm"
                  >
                    <Clock className="h-4 w-4 text-cream/60 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-cream">{row.days}</p>
                      <p className="text-cream/75">{row.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-sans text-sm text-cream/75 leading-relaxed">
                Call or WhatsApp{" "}
                <a href={`tel:+${whatsapp}`} className="underline text-cream">
                  {phone}
                </a>{" "}
                for today’s hours.
              </p>
            )}
          </div>

          {/* Location & Verified Socials */}
          <div className="lg:col-span-3 space-y-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-cream/65">
              Visit Us
            </p>
            <div className="space-y-3 font-sans text-sm text-cream/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-cream/60 shrink-0 mt-0.5" />
                <p>{address}</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=TRACE+Expert+City+Colombo+10+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cream underline underline-offset-4 hover:text-cream/80"
              >
                Get Directions
                <ExternalLink className="h-3 w-3" />
              </a>

              {activeSocials.length > 0 && (
                <div className="pt-3 flex flex-wrap gap-3">
                  {activeSocials.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="capitalize rounded-full border border-cream/25 px-3 py-1 text-xs text-cream/85 hover:bg-cream hover:text-primary transition-colors"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-cream/65">
          <p>© {new Date().getFullYear()} The Third Place · TRACE Expert City, Colombo 10.</p>
          <div className="flex items-center gap-5">
            <span>Not Home. Not Work. Just Right.</span>
            <Link href="/admin" className="hover:text-cream transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
