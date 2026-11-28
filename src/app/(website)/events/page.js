import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import EventsExplorer from "@/components/events/EventsExplorer";
import { getEvents } from "@/lib/utils/data";

export const metadata = {
  title: "Events — Join In",
  description:
    "Discover upcoming and past community events, workshops, silent reading clubs, and tabletop game nights at The Third Place, TRACE Expert City, Colombo 10.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <Container>
        <SectionHeading
          eyebrow="Events — Join In"
          title="Community gatherings in Colombo 10."
          description="Pull up a chair at TRACE Expert City for coffee workshops, reading clubs, board game socials, and creative evenings."
          className="mb-12"
        />
        <EventsExplorer events={events} />
      </Container>
    </section>
  );
}
