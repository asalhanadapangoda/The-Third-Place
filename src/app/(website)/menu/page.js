import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import MenuCatalog from "@/components/menu/MenuCatalog";
import { getMenuData } from "@/lib/utils/data";

export const metadata = {
  title: "Sip — Menu",
  description:
    "Explore The Third Place menu in LKR—hot coffee, iced coffee, Ceylon tea, botanical beverages, fresh bakes, and Colombo specials at TRACE Expert City.",
};

export default async function MenuPage() {
  const { categories, items } = await getMenuData();

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <Container>
        <SectionHeading
          eyebrow="Sip — Menu"
          title="Coffee, Ceylon teas & kitchen bakes."
          description="Every cup is crafted fresh to order at TRACE Expert City, Colombo 10. All prices are in Sri Lankan Rupees (LKR)."
          className="mb-12"
        />
        <MenuCatalog categories={categories} items={items} />
      </Container>
    </section>
  );
}
