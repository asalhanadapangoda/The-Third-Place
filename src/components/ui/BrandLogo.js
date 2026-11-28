import Image from "next/image";

export default function BrandLogo({ light = false, compact = false }) {
  return (
    <div className="inline-flex items-center gap-3 group">
      <Image
        src="/logo/the-third-place-logo.svg"
        alt="The Third Place logo — coffee bean and botanical sprout"
        width={compact ? 38 : 44}
        height={compact ? 38 : 44}
        priority
        className="rounded-full transition-transform duration-300 group-hover:scale-105 shrink-0"
      />
      <div className="flex flex-col">
        <span
          className={`font-display text-2xl font-semibold leading-none tracking-tight ${
            light ? "text-cream" : "text-brown"
          }`}
        >
          The Third Place
        </span>
        {!compact && (
          <span
            className={`font-sans text-[10px] uppercase tracking-[0.2em] mt-1 ${
              light ? "text-cream/75" : "text-terracotta"
            }`}
          >
            Not Home. Not Work. Just Right.
          </span>
        )}
      </div>
    </div>
  );
}
