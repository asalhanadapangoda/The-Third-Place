import Link from "next/link";
import { Coffee, Calendar, Image as ImageIcon, Mail, ArrowRight } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [
    { count: menuCount },
    { count: publishedEventsCount },
    { count: upcomingEventsCount },
    { count: galleryCount },
    { count: newEnquiriesCount },
    { data: recentEnquiries },
    { data: recentEvents },
  ] = await Promise.all([
    supabase.from("menu_items").select("*", { count: "exact", head: true }),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("enquiries")
      .select("id, name, topic, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("events")
      .select("id, title, event_date, status, is_published")
      .order("event_date", { ascending: true })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Total Menu Items",
      value: menuCount ?? 0,
      href: "/admin/menu",
      icon: Coffee,
    },
    {
      label: "Published Events",
      value: publishedEventsCount ?? 0,
      sub: `${upcomingEventsCount ?? 0} upcoming`,
      href: "/admin/events",
      icon: Calendar,
    },
    {
      label: "Gallery Photographs",
      value: galleryCount ?? 0,
      href: "/admin/gallery",
      icon: ImageIcon,
    },
    {
      label: "New Enquiries",
      value: newEnquiriesCount ?? 0,
      href: "/admin/messages",
      icon: Mail,
    },
  ];

  return (
    <AdminShell admin={admin} title="Dashboard Overview">
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="rounded-2xl bg-surface border border-brown/12 p-6 hover:border-primary/40 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-medium uppercase tracking-wider text-brown/65">
                    {card.label}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <p className="font-display text-4xl font-semibold text-brown">
                    {card.value}
                  </p>
                  {card.sub && (
                    <p className="font-sans text-xs text-terracotta mt-0.5">
                      {card.sub}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Enquiries */}
          <div className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-brown">
                Recent Enquiries
              </h2>
              <Link
                href="/admin/messages"
                className="inline-flex items-center gap-1 font-sans text-xs font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {!recentEnquiries?.length ? (
              <p className="font-sans text-sm text-brown/65">No enquiries yet.</p>
            ) : (
              <div className="divide-y divide-brown/10">
                {recentEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-sans text-sm font-medium text-brown">
                        {enq.name}
                      </p>
                      <p className="font-sans text-xs text-brown/65">{enq.topic}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-sans text-[11px] font-medium capitalize text-primary">
                      {enq.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="rounded-2xl bg-surface border border-brown/12 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-brown">
                Events Schedule
              </h2>
              <Link
                href="/admin/events"
                className="inline-flex items-center gap-1 font-sans text-xs font-medium text-primary hover:underline"
              >
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {!recentEvents?.length ? (
              <p className="font-sans text-sm text-brown/65">No events created yet.</p>
            ) : (
              <div className="divide-y divide-brown/10">
                {recentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-sans text-sm font-medium text-brown">
                        {evt.title}
                      </p>
                      <p className="font-sans text-xs text-brown/65">
                        {evt.event_date} · {evt.status}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] font-medium ${
                        evt.is_published
                          ? "bg-primary/10 text-primary"
                          : "bg-terracotta/15 text-terracotta"
                      }`}
                    >
                      {evt.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
