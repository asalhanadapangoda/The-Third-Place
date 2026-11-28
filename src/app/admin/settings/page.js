import AdminShell from "@/components/admin/AdminShell";
import SettingsManager from "@/components/admin/SettingsManager";
import { requireAdmin } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/utils/data";

export const metadata = {
  title: "Website Settings",
};

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <AdminShell admin={admin} title="Website Settings">
      <SettingsManager settings={settings} />
    </AdminShell>
  );
}
