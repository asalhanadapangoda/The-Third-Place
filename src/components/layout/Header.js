"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BrandLogo from "@/components/ui/BrandLogo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/story" },
  { label: "Menu", href: "/menu" },
  { label: "Play & Read", href: "/play-read" },
  { label: "Events", href: "/events" },
  { label: "Space", href: "/space" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ settings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const phone = settings?.phone || "077 220 1989";
  const whatsapp = settings?.whatsapp_number || "94772201989";

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-brown/12">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <BrandLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-sm font-medium transition-colors duration-200 relative py-1 ${
                    isActive
                      ? "text-primary"
                      : "text-brown/80 hover:text-primary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-terracotta" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brown/20 text-primary hover:bg-primary hover:text-cream hover:border-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <Button href="/menu" variant="primary" size="sm">
              Explore Menu
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-brown/20 text-brown hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Smooth Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden overflow-hidden border-t border-brown/12 bg-cream"
          >
            <Container className="py-6 flex flex-col gap-4">
              <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`font-sans text-base font-medium px-3 py-2.5 rounded-xl transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-brown/85 hover:bg-surface-strong/60 hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-brown/12 grid grid-cols-2 gap-3">
                <a
                  href={`tel:+${whatsapp}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brown/25 py-2.5 px-4 font-sans text-xs font-medium text-brown hover:border-primary hover:text-primary"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {phone}
                </a>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 px-4 font-sans text-xs font-medium text-cream hover:bg-primary-hover"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
