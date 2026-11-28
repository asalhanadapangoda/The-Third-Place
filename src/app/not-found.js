import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream text-brown flex items-center justify-center py-24">
      <Container className="text-center space-y-5 max-w-xl">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
          404 · Page Not Found
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-semibold text-brown">
          This table isn’t set yet.
        </h1>
        <p className="font-sans text-sm sm:text-base text-brown/75">
          The page you’re looking for may have moved. Head back to The Third
          Place homepage or explore our menu.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-3">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
          <Button href="/menu" variant="outline">
            Explore Menu
          </Button>
        </div>
      </Container>
    </div>
  );
}
