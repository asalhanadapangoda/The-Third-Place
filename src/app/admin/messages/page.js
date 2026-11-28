import AdminShell from "@/components/admin/AdminShell";
import EnquiriesManager from "@/components/admin/EnquiriesManager";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Enquiries",
};

export default async function AdminMessagesPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminShell admin={admin} title="Customer Enquiries">
      <EnquiriesManager enquiries={enquiries || []} />
    </AdminShell>
  );
}
