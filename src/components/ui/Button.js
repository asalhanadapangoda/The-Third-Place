import Link from "next/link";

const VARIANTS = {
  primary:
    "bg-primary text-cream hover:bg-primary-hover border border-primary",
  terracotta:
    "bg-terracotta text-cream hover:bg-terracotta-hover border border-terracotta",
  outline:
    "bg-transparent text-brown border border-brown/30 hover:border-primary hover:text-primary",
  outlineLight:
    "bg-transparent text-cream border border-cream/40 hover:bg-cream hover:text-primary",
  cream:
    "bg-cream text-brown hover:bg-surface-strong border border-cream",
};

const SIZES = {
  sm: "px-4 py-2 text-xs tracking-wide",
  md: "px-6 py-3 text-sm tracking-wide",
  lg: "px-7 py-3.5 text-sm tracking-wide",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer ${
    VARIANTS[variant] || VARIANTS.primary
  } ${SIZES[size] || SIZES.md} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
