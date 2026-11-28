import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";

/**
 * Brand Typography:
 * - Arsenica (mapped to Cormorant Garamond until licensed Arsenica .woff2 files
 *   are placed in public/fonts/ and loaded via next/font/local)
 * - Poppins for body, navigation, buttons, and UI labels
 */
const arsenica = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-arsenica",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "The Third Place — Coffee Shop & Community Space | TRACE Expert City, Colombo 10",
    template: "%s | The Third Place Colombo",
  },
  description:
    "Not Home. Not Work. Just Right. A welcoming specialty coffee shop and community space at TRACE Expert City, Colombo 10, Sri Lanka. Sip, chat, work, play, read, and join in.",
  keywords: [
    "Coffee shop Colombo",
    "Coffee shop Maradana",
    "Café TRACE Expert City",
    "Community events Colombo",
    "Specialty coffee Colombo 10",
    "Board game cafe Colombo",
    "The Third Place Colombo",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: siteUrl,
    siteName: "The Third Place",
    title: "The Third Place — Not Home. Not Work. Just Right.",
    description:
      "Specialty coffee and community space at TRACE Expert City, Colombo 10, Sri Lanka.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Third Place — Not Home. Not Work. Just Right.",
    description:
      "Specialty coffee and community space at TRACE Expert City, Colombo 10, Sri Lanka.",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "The Third Place",
  slogan: "Not Home. Not Work. Just Right.",
  url: siteUrl,
  telephone: "+94772201989",
  priceRange: "LKR",
  servesCuisine: ["Specialty Coffee", "Tea", "Bakery", "Cafe"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "TRACE Expert City",
    addressLocality: "Colombo 10",
    addressRegion: "Western Province",
    addressCountry: "LK",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${arsenica.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-brown font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
