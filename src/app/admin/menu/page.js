import AdminShell from "@/components/admin/AdminShell";
import MenuManager from "@/components/admin/MenuManager";
import { requireAdmin } from "@/lib/supabase/admin";
import { getMenuData } from "@/lib/utils/data";

export const metadata = {
  title: "Menu Management",
};

export default async function AdminMenuPage() {
  const admin = await requireAdmin();
  const { categories, items } = await getMenuData({ includeUnavailable: true });

  return (
    <AdminShell admin={admin} title="Menu Management">
      <MenuManager categories={categories} items={items} />
    </AdminShell>
  );
}
