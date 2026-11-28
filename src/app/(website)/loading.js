import Container from "@/components/ui/Container";

export default function WebsiteLoading() {
  return (
    <section className="py-20 bg-cream">
      <Container className="space-y-8 animate-pulse">
        <div className="h-4 w-36 rounded-full bg-brown/10" />
        <div className="h-12 w-2/3 rounded-2xl bg-brown/10" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 rounded-2xl bg-surface border border-brown/10"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
