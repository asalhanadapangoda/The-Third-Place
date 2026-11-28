import AdminShell from "@/components/admin/AdminShell";
import EventsManager from "@/components/admin/EventsManager";
import { requireAdmin } from "@/lib/supabase/admin";
import { getEvents } from "@/lib/utils/data";

export const metadata = {
  title: "Event Management",
};

export default async function AdminEventsPage() {
  const admin = await requireAdmin();
  const events = await getEvents({ includeUnpublished: true });

  return (
    <AdminShell admin={admin} title="Event Management">
      <EventsManager events={events} />
    </AdminShell>
  );
}
