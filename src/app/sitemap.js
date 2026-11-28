import { getEvents } from "@/lib/utils/data";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/story",
    "/menu",
    "/play-read",
    "/events",
    "/space",
    "/gallery",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const events = await getEvents();
  const eventRoutes = events.map((evt) => ({
    url: `${baseUrl}/events/${evt.slug}`,
    lastModified: new Date(evt.updated_at || evt.event_date || Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes];
}
