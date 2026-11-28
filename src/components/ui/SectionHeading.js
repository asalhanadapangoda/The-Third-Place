export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className = "",
}) {
  const alignment =
    align === "center" ? "text-center mx-auto items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <span
          className={`font-sans text-xs font-semibold uppercase tracking-[0.22em] mb-3 ${
            light ? "text-cream/80" : "text-terracotta"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-4xl sm:text-5xl font-semibold leading-[1.1] ${
          light ? "text-cream" : "text-brown"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`font-sans mt-4 text-base sm:text-lg leading-relaxed ${
            light ? "text-cream/80" : "text-brown/75"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
