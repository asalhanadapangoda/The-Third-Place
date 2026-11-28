import Image from "next/image";
import { Dices, BookOpen, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { FadeIn, ImageReveal } from "@/components/ui/MotionPrimitives";

const GAMES_LIST = [
  { name: "Catan & Strategy Boards", meta: "3–4 Players · Social Strategy" },
  { name: "Azul & Cascadia", meta: "2–4 Players · Relaxed Puzzle" },
  { name: "Codenames & Card Classics", meta: "2–8 Players · Quick & Lively" },
];

const READING_LIST = [
  { name: "Curated Fiction & Essays", meta: "Contemporary & Sri Lankan Voices" },
  { name: "Design, Coffee & Craft Books", meta: "Independent Print & Monographs" },
  { name: "Sunlit Quiet Reading Nooks", meta: "Comfortable Armchairs & Warm Light" },
];

export default function PlayReadSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface border-b border-brown/12">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <FadeIn>
            <SectionHeading
              eyebrow="Play & Read"
              title="Unplug with a board game, or settle into a quiet chapter."
              description="Whether you want friendly competition over card games or a peaceful hour with a book and a cup of Ceylon tea, our shelves are open for everyone."
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <Button href="/play-read" variant="outline">
              Explore Play &amp; Read
              <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Play Card */}
          <ImageReveal>
            <div className="h-full rounded-3xl bg-cream border border-brown/12 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1100&q=80"
                  alt="Board games and card games on a wooden café table"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta">
                      <Dices className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-3xl font-semibold text-brown">
                      Board &amp; Card Games
                    </h3>
                  </div>
                  <div className="divide-y divide-brown/12">
                    {GAMES_LIST.map((g) => (
                      <div key={g.name} className="py-3.5">
                        <p className="font-sans text-sm font-semibold text-brown">
                          {g.name}
                        </p>
                        <p className="font-sans text-xs text-brown/70 mt-0.5">
                          {g.meta}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ImageReveal>

          {/* Read Card */}
          <ImageReveal delay={0.12}>
            <div className="h-full rounded-3xl bg-cream border border-brown/12 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1100&q=80"
                  alt="Curated books and calm reading space at The Third Place"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-3xl font-semibold text-brown">
                      Books &amp; Reading Nooks
                    </h3>
                  </div>
                  <div className="divide-y divide-brown/12">
                    {READING_LIST.map((r) => (
                      <div key={r.name} className="py-3.5">
                        <p className="font-sans text-sm font-semibold text-brown">
                          {r.name}
                        </p>
                        <p className="font-sans text-xs text-brown/70 mt-0.5">
                          {r.meta}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ImageReveal>
        </div>
      </Container>
    </section>
  );
}
