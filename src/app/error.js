"use client";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function GlobalError({ reset }) {
  return (
    <div className="min-h-screen bg-cream text-brown flex items-center justify-center py-24">
      <Container className="text-center space-y-5 max-w-lg">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
          Something Went Wrong
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-brown">
          We hit a brief pause.
        </h1>
        <p className="font-sans text-sm text-brown/75">
          An unexpected error occurred while loading this page. Please try again
          or return to The Third Place homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button variant="primary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button href="/" variant="outline">
            Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
