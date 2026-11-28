import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Verified business defaults & realistic temporary photography placeholders
 * (distinct images per section; replaced automatically by Supabase + Cloudinary records).
 */
export const DEFAULT_SITE_SETTINGS = {
  site_name: "The Third Place",
  tagline: "Not Home. Not Work. Just Right.",
  phone: "077 220 1989",
  whatsapp_number: "94772201989",
  email: "",
  address: "TRACE Expert City, Colombo 10, Sri Lanka",
  google_maps_embed_url:
    "https://www.google.com/maps?q=TRACE+Expert+City+Colombo+10+Sri+Lanka&output=embed",
  opening_hours: [],
  social_links: {},
  seo_title:
    "The Third Place — Coffee Shop & Community Space | TRACE Expert City, Colombo 10",
  seo_description:
    "Not Home. Not Work. Just Right. Specialty coffee, quiet reading nooks, board games, and community gatherings at TRACE Expert City, Colombo 10, Sri Lanka.",
};

export const FALLBACK_PAGES = {
  home: {
    slug: "home",
    title: "Not Home. Not Work. Just Right.",
    subtitle:
      "A contemporary coffee shop and community space at TRACE Expert City, Colombo 10.",
    body: "Step into your third place in the heart of Colombo—crafted for slow specialty coffee, unhurried conversations, focused work, curated books, tabletop games, and meaningful community events.",
    hero_image_url:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80",
    content: {
      promoBanner: "TRACE Expert City · Maradana, Colombo 10",
    },
  },
  story: {
    slug: "story",
    title: "The Philosophy of a Third Place",
    subtitle:
      "First place: Home. Second place: Work. Third place: A welcoming room where community thrives.",
    body: "Sociologist Ray Oldenburg coined the idea of the 'third place'—an informal, welcoming sanctuary outside home and work where people gather as equals. Nestled inside TRACE Expert City in Colombo 10, The Third Place brings this philosophy to life with urban botanical calm, carefully roasted coffee, and tables built for both quiet solitude and lively connection.",
    hero_image_url:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
    content: {},
  },
  space: {
    slug: "space",
    title: "Designed for Lingering",
    subtitle:
      "Warm timber, botanical calm, work-friendly corners, and community tables at TRACE Expert City.",
    body: "Every zone inside The Third Place is thoughtfully zoned—from sunlit work desks with power outlets to plush reading chairs and wide walnut tables built for board games, team meetups, and evening workshops.",
    hero_image_url:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80",
    content: {},
  },
  community: {
    slug: "community",
    title: "Chat, Connect & Collaborate",
    subtitle: "Real conversations and creative energy in Colombo 10.",
    body: "Whether you are meeting old friends, hosting a study circle, networking with fellow builders at TRACE Expert City, or joining a weekend workshop, The Third Place is built to turn passing hellos into lasting community.",
    hero_image_url:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80",
    content: {},
  },
};

export const FALLBACK_MENU_CATEGORIES = [
  { id: "cat-hot-coffee", name: "Hot Coffee", slug: "hot-coffee", display_order: 1 },
  { id: "cat-iced-coffee", name: "Iced Coffee", slug: "iced-coffee", display_order: 2 },
  { id: "cat-tea", name: "Tea", slug: "tea", display_order: 3 },
  { id: "cat-other", name: "Other Beverages", slug: "other-beverages", display_order: 4 },
  { id: "cat-food", name: "Food and Bakes", slug: "food-and-bakes", display_order: 5 },
  { id: "cat-special", name: "Special Items", slug: "special-items", display_order: 6 },
];

export const FALLBACK_MENU_ITEMS = [
  {
    id: "item-1",
    category_id: "cat-hot-coffee",
    category_name: "Hot Coffee",
    name: "Signature Flat White",
    slug: "signature-flat-white",
    description:
      "Velvety microfoam folded over a double ristretto of our medium-roast house blend with notes of dark cocoa and roasted almond.",
    price_lkr: 950,
    image_url:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
    tag: "House Favorite",
    is_available: true,
    is_featured: true,
  },
  {
    id: "item-2",
    category_id: "cat-hot-coffee",
    category_name: "Hot Coffee",
    name: "Single-Origin V60 Pour-Over",
    slug: "single-origin-v60",
    description:
      "Hand-poured filter brew highlighting bright floral aromatics and clean stone-fruit clarity.",
    price_lkr: 1150,
    image_url:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
    tag: "Slow Brew",
    is_available: true,
    is_featured: true,
  },
  {
    id: "item-3",
    category_id: "cat-iced-coffee",
    category_name: "Iced Coffee",
    name: "Colombo Iced Spanish Latte",
    slug: "colombo-iced-spanish-latte",
    description:
      "Chilled espresso layered with lightly sweetened condensed milk and silky cold milk over crystal ice.",
    price_lkr: 1250,
    image_url:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
    tag: "Bestseller",
    is_available: true,
    is_featured: true,
  },
  {
    id: "item-4",
    category_id: "cat-iced-coffee",
    category_name: "Iced Coffee",
    name: "18-Hour Cold Brew",
    slug: "18-hour-cold-brew",
    description:
      "Steeped slowly overnight for low acidity, smooth chocolate body, and a crisp refreshing finish.",
    price_lkr: 1050,
    image_url:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=80",
    tag: null,
    is_available: true,
    is_featured: false,
  },
  {
    id: "item-5",
    category_id: "cat-tea",
    category_name: "Tea",
    name: "Ceylon Spiced Masala Chai",
    slug: "ceylon-spiced-masala-chai",
    description:
      "High-grown Ceylon black tea simmered with crushed green cardamom, Ceylon cinnamon, ginger, and creamy milk.",
    price_lkr: 850,
    image_url:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80",
    tag: "Local Craft",
    is_available: true,
    is_featured: true,
  },
  {
    id: "item-6",
    category_id: "cat-tea",
    category_name: "Tea",
    name: "Ceremonial Iced Matcha Latte",
    slug: "ceremonial-iced-matcha-latte",
    description:
      "First-harvest stone-ground matcha hand-whisked to order and poured over chilled milk or oat milk.",
    price_lkr: 1350,
    image_url:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80",
    tag: "House Favorite",
    is_available: true,
    is_featured: false,
  },
  {
    id: "item-7",
    category_id: "cat-other",
    category_name: "Other Beverages",
    name: "Hibiscus & Lime Botanical Spritz",
    slug: "hibiscus-lime-spritz",
    description:
      "Chilled organic hibiscus infusion topped with fresh local lime, mint leaf, and sparkling soda.",
    price_lkr: 900,
    image_url:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
    tag: "Caffeine-Free",
    is_available: true,
    is_featured: false,
  },
  {
    id: "item-8",
    category_id: "cat-food",
    category_name: "Food and Bakes",
    name: "Warm Butter Croissant",
    slug: "warm-butter-croissant",
    description:
      "Flaky, golden laminated French-butter pastry baked fresh every morning.",
    price_lkr: 850,
    image_url:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80",
    tag: "Baked Daily",
    is_available: true,
    is_featured: true,
  },
  {
    id: "item-9",
    category_id: "cat-food",
    category_name: "Food and Bakes",
    name: "Avocado & Herb Sourdough Tartine",
    slug: "avocado-herb-sourdough",
    description:
      "Toasted artisanal sourdough layered with smashed avocado, cherry tomatoes, toasted seeds, and lime.",
    price_lkr: 1650,
    image_url:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    tag: "All-Day",
    is_available: true,
    is_featured: false,
  },
  {
    id: "item-10",
    category_id: "cat-special",
    category_name: "Special Items",
    name: "Kithul & Cardamom Cortado",
    slug: "kithul-cardamom-cortado",
    description:
      "Our Colombo signature—double espresso kissed with pure Sri Lankan kithul treacle and aromatic cardamom.",
    price_lkr: 1150,
    image_url:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    tag: "Colombo Signature",
    is_available: true,
    is_featured: true,
  },
];

export const FALLBACK_EVENTS = [
  {
    id: "evt-1",
    title: "Sunday Tabletop & Coffee Social",
    slug: "sunday-tabletop-coffee-social",
    summary:
      "Drop in solo or with friends for an afternoon of strategy games, party classics, and iced brews.",
    description:
      "Join our welcoming weekly board game gathering at TRACE Expert City. Whether you love Catan, Wingspan, Azul, or light card games like Codenames, our community hosts will match you with a table and teach the rules.",
    category: "Board Games",
    event_date: "2026-12-06",
    start_time: "2:30 PM",
    end_time: "6:00 PM",
    location: "The Third Place, TRACE Expert City, Colombo 10",
    poster_url:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80",
    registration_url: "https://wa.me/94772201989",
    capacity_label: "Open Community RSVP",
    status: "upcoming",
    is_published: true,
    is_featured: true,
  },
  {
    id: "evt-2",
    title: "Colombo Silent Reading Club",
    slug: "colombo-silent-reading-club",
    summary:
      "Bring any book you are reading—enjoy an hour of quiet companionable reading followed by optional conversation.",
    description:
      "No assigned reading, no pressure. Arrive, order your favorite Ceylon tea or flat white, settle into a sunlit corner for 60 minutes of uninterrupted reading, and stay afterward to swap book recommendations.",
    category: "Reading Club",
    event_date: "2026-12-11",
    start_time: "6:00 PM",
    end_time: "8:00 PM",
    location: "The Third Place, TRACE Expert City, Colombo 10",
    poster_url:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    registration_url: "https://wa.me/94772201989",
    capacity_label: "16 Seats Available",
    status: "upcoming",
    is_published: true,
    is_featured: true,
  },
  {
    id: "evt-3",
    title: "Hand-Brewed Pour-Over Workshop",
    slug: "hand-brewed-pour-over-workshop",
    summary:
      "Learn grind calibration, water temperature, and pouring craft with our baristas.",
    description:
      "A hands-on morning session for coffee lovers looking to elevate their home brewing ritual. Taste three single-origin roasts side-by-side and practice V60 extraction techniques.",
    category: "Workshop",
    event_date: "2026-12-19",
    start_time: "9:30 AM",
    end_time: "11:30 AM",
    location: "The Third Place, TRACE Expert City, Colombo 10",
    poster_url:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    registration_url: "https://wa.me/94772201989",
    capacity_label: "Limited to 12 Guests",
    status: "upcoming",
    is_published: true,
    is_featured: true,
  },
  {
    id: "evt-4",
    title: "Acoustic Evenings at TRACE",
    slug: "acoustic-evenings-at-trace",
    summary:
      "An intimate evening of unplugged music, specialty coffee, and warm conversation.",
    description:
      "We gathered local Colombo acoustic artists for a relaxed Friday evening under warm lamps, celebrating music and neighborhood community.",
    category: "Live Music",
    event_date: "2026-11-08",
    start_time: "6:30 PM",
    end_time: "9:00 PM",
    location: "The Third Place, TRACE Expert City, Colombo 10",
    poster_url:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    registration_url: "",
    capacity_label: "Past Event",
    status: "past",
    is_published: true,
    is_featured: false,
  },
];

export const FALLBACK_GALLERY = [
  {
    id: "gal-1",
    title: "Morning Espresso Pour",
    alt_text: "Freshly extracted espresso poured into a ceramic cup",
    category: "Coffee",
    image_url:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
    display_order: 1,
  },
  {
    id: "gal-2",
    title: "Sunlit Timber Seating",
    alt_text: "Warm botanical café interior with wooden tables and natural daylight",
    category: "Interior",
    image_url:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80",
    display_order: 2,
  },
  {
    id: "gal-3",
    title: "Fresh Morning Pastries",
    alt_text: "Flaky croissants and artisan café bakes on a ceramic platter",
    category: "Food",
    image_url:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
    display_order: 3,
  },
  {
    id: "gal-4",
    title: "Afternoon Conversations",
    alt_text: "Friends sharing coffee and warm conversation at a wooden table",
    category: "Community",
    image_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    display_order: 4,
  },
  {
    id: "gal-5",
    title: "Weekend Tabletop Sessions",
    alt_text: "Board game pieces laid out on a café table beside coffee cups",
    category: "Events",
    image_url:
      "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=1000&q=80",
    display_order: 5,
  },
  {
    id: "gal-6",
    title: "Quiet Reading Ritual",
    alt_text: "Open book beside a warm cup of coffee in a calm window nook",
    category: "Lifestyle",
    image_url:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=80",
    display_order: 6,
  },
];

export async function getSiteSettings() {
  if (!isSupabaseConfigured()) return DEFAULT_SITE_SETTINGS;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*").limit(1).single();
    if (!data) return DEFAULT_SITE_SETTINGS;
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...data,
      opening_hours: Array.isArray(data.opening_hours)
        ? data.opening_hours
        : DEFAULT_SITE_SETTINGS.opening_hours,
      social_links: data.social_links || {},
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getPageContent(slug) {
  const fallback = FALLBACK_PAGES[slug] || FALLBACK_PAGES.home;
  if (!isSupabaseConfigured()) return fallback;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    return data ? { ...fallback, ...data } : fallback;
  } catch {
    return fallback;
  }
}

export async function getMenuData({ includeUnavailable = false } = {}) {
  if (!isSupabaseConfigured()) {
    return {
      categories: FALLBACK_MENU_CATEGORIES,
      items: FALLBACK_MENU_ITEMS,
    };
  }
  try {
    const supabase = await createClient();
    const [{ data: categories }, { data: items }] = await Promise.all([
      supabase
        .from("menu_categories")
        .select("*")
        .order("display_order", { ascending: true }),
      includeUnavailable
        ? supabase
            .from("menu_items")
            .select("*, menu_categories(name, slug)")
            .order("display_order", { ascending: true })
        : supabase
            .from("menu_items")
            .select("*, menu_categories(name, slug)")
            .eq("is_available", true)
            .order("display_order", { ascending: true }),
    ]);

    if (!categories?.length && !items?.length) {
      return {
        categories: FALLBACK_MENU_CATEGORIES,
        items: FALLBACK_MENU_ITEMS,
      };
    }

    const normalizedItems = (items || []).map((item) => ({
      ...item,
      category_name: item.menu_categories?.name || "Menu",
      category_slug: item.menu_categories?.slug || "",
    }));

    return {
      categories: categories || [],
      items: normalizedItems,
    };
  } catch {
    return {
      categories: FALLBACK_MENU_CATEGORIES,
      items: FALLBACK_MENU_ITEMS,
    };
  }
}

export async function getEvents({ includeUnpublished = false } = {}) {
  if (!isSupabaseConfigured()) return FALLBACK_EVENTS;
  try {
    const supabase = await createClient();
    let query = supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (!includeUnpublished) {
      query = query.eq("is_published", true);
    }

    const { data } = await query;
    return data?.length ? data : includeUnpublished ? [] : FALLBACK_EVENTS;
  } catch {
    return includeUnpublished ? [] : FALLBACK_EVENTS;
  }
}

export async function getEventBySlug(slug) {
  if (!isSupabaseConfigured()) {
    return FALLBACK_EVENTS.find((e) => e.slug === slug) || null;
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    if (data) return data;
    return FALLBACK_EVENTS.find((e) => e.slug === slug) || null;
  } catch {
    return FALLBACK_EVENTS.find((e) => e.slug === slug) || null;
  }
}

export async function getGalleryImages({ includeUnpublished = false } = {}) {
  if (!isSupabaseConfigured()) return FALLBACK_GALLERY;
  try {
    const supabase = await createClient();
    let query = supabase
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!includeUnpublished) {
      query = query.eq("is_published", true);
    }

    const { data } = await query;
    return data?.length ? data : includeUnpublished ? [] : FALLBACK_GALLERY;
  } catch {
    return includeUnpublished ? [] : FALLBACK_GALLERY;
  }
}
