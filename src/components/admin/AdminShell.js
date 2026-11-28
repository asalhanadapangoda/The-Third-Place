"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coffee,
  Calendar,
  Image as ImageIcon,
  FileText,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { logoutAdmin } from "@/actions/auth";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Menu", href: "/admin/menu", icon: Coffee },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Pages & Home", href: "/admin/content", icon: FileText },
  { label: "Enquiries", href: "/admin/messages", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({ admin, title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-primary text-cream p-5">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" onClick={() => setSidebarOpen(false)}>
            <BrandLogo light compact />
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-cream/80 hover:bg-cream/10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Admin Navigation" className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-sans text-sm font-medium transition-colors ${
                  active
                    ? "bg-cream text-primary"
                    : "text-cream/80 hover:bg-cream/10 hover:text-cream"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-6 border-t border-cream/15">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-cream/20 px-3.5 py-2.5 font-sans text-xs font-medium text-cream/90 hover:bg-cream/10 transition-colors"
        >
          View Public Website
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl bg-terracotta px-3.5 py-2.5 font-sans text-xs font-medium text-cream hover:bg-terracotta-hover transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream text-brown flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen">
        {navContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-brown/60 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-surface/95 backdrop-blur-md border-b border-brown/12 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg border border-brown/20 p-2 text-brown hover:border-primary cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-brown truncate">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3 font-sans text-xs text-brown/75">
            <span className="hidden sm:inline">
              {admin?.profile?.full_name || admin?.profile?.email || "Administrator"}
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium uppercase tracking-wider text-primary text-[10px]">
              {admin?.profile?.role || "admin"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
