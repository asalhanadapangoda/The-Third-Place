import Image from "next/image";
import { Dices, BookOpen, Coffee, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Play & Read",
  description:
    "Unplug at The Third Place in Colombo 10 with curated board games, card games, books, and sunlit reading spaces.",
};

const PLAY_CATEGORIES = [
  {
    title: "Strategy & Tabletop",
    items: ["Catan", "Wingspan", "Ticket to Ride", "Splendor", "Cascadia"],
  },
  {
    title: "Card & Social Games",
    items: ["Codenames", "Azul", "UNO", "Sushi Go!", "Exploding Kittens"],
  },
  {
    title: "Classic Two-Player",
    items: ["Chess", "Scrabble", "Checkers", "Carrom-inspired tabletop classics"],
  },
];

const READ_ZONES = [
  {
    title: "Curated Fiction & Non-Fiction",
    description:
      "Handpicked novels, short stories, Sri Lankan literature, and essays to accompany a slow afternoon brew.",
  },
  {
    title: "Design, Architecture & Coffee Books",
    description:
      "Independent print magazines and tactile monographs for creative inspiration between work sprints.",
  },
  {
    title: "Quiet Reading Corners",
    description:
      "Warm lighting, supportive armchairs, and calm acoustics designed for uninterrupted reading.",
  },
];

export default function PlayReadPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-cream border-b border-brown/12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                eyebrow="Play & Read"
                title="Slow down, shuffle a deck, or turn a page."
                description="At The Third Place, we celebrate screen-free joy. Borrow a board game with friends or sink into a quiet corner with a book and a warm cup."
              />
              <div className="flex flex-wrap gap-3">
                <Button href="/events" variant="primary">
                  Join Tabletop &amp; Reading Events
                </Button>
                <Button href="/menu" variant="outline">
                  See Drinks &amp; Bakes
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-brown/12">
                <Image
                  src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80"
                  alt="Tabletop board games at The Third Place"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 24vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-brown/12 mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"
                  alt="Curated books and quiet reading space"
                  fill
                  sizes="(max-width: 1024px) 50vw, 24vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-surface border-b border-brown/12">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Play */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta">
                  <Dices className="h-5 w-5" />
                </span>
                <h2 className="font-display text-4xl font-semibold text-brown">
                  Board &amp; Card Games
                </h2>
              </div>
              <div className="space-y-4">
                {PLAY_CATEGORIES.map((cat) => (
                  <div
                    key={cat.title}
                    className="rounded-2xl bg-cream border border-brown/12 p-6"
                  >
                    <h3 className="font-display text-2xl font-semibold text-brown">
                      {cat.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cat.items.map((game) => (
                        <span
                          key={game}
                          className="rounded-full bg-surface px-3.5 py-1 font-sans text-xs font-medium text-brown/85 border border-brown/10"
                        >
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Read */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h2 className="font-display text-4xl font-semibold text-brown">
                  Books &amp; Reading Spaces
                </h2>
              </div>
              <div className="space-y-4">
                {READ_ZONES.map((zone) => (
                  <div
                    key={zone.title}
                    className="rounded-2xl bg-cream border border-brown/12 p-6"
                  >
                    <h3 className="font-display text-2xl font-semibold text-brown">
                      {zone.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-brown/75 mt-2">
                      {zone.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-primary text-cream p-6 flex items-start gap-4">
                <Sparkles className="h-5 w-5 text-terracotta shrink-0 mt-0.5" />
                <div className="font-sans text-sm text-cream/85">
                  <p className="font-semibold text-cream">
                    Want to start a book club or game night?
                  </p>
                  <p className="mt-1">
                    Reserve a community table at TRACE Expert City and we’ll keep
                    the coffee and tea flowing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
