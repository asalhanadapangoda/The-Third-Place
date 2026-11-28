import AdminShell from "@/components/admin/AdminShell";
import ContentManager from "@/components/admin/ContentManager";
import { requireAdmin } from "@/lib/supabase/admin";
import { getEvents, getMenuData, getPageContent } from "@/lib/utils/data";

export const metadata = {
  title: "Homepage & Content Management",
};

export default async function AdminContentPage() {
  const admin = await requireAdmin();
  const [home, story, space, community, menuData, events] = await Promise.all([
    getPageContent("home"),
    getPageContent("story"),
    getPageContent("space"),
    getPageContent("community"),
    getMenuData({ includeUnavailable: true }),
    getEvents({ includeUnpublished: true }),
  ]);

  return (
    <AdminShell admin={admin} title="Pages & Homepage Management">
      <ContentManager
        pages={{ home, story, space, community }}
        menuItems={menuData.items}
        events={events}
      />
    </AdminShell>
  );
}
