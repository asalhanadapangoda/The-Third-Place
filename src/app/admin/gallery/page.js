import AdminShell from "@/components/admin/AdminShell";
import GalleryManager from "@/components/admin/GalleryManager";
import { requireAdmin } from "@/lib/supabase/admin";
import { getGalleryImages } from "@/lib/utils/data";

export const metadata = {
  title: "Gallery Management",
};

export default async function AdminGalleryPage() {
  const admin = await requireAdmin();
  const images = await getGalleryImages({ includeUnpublished: true });

  return (
    <AdminShell admin={admin} title="Gallery Management">
      <GalleryManager images={images} />
    </AdminShell>
  );
}
