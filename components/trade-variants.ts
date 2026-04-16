/**
 * Trade Variants — purpose-built template config per trade.
 *
 * Each entry drives:
 *  - Palette (primary / accent / soft)
 *  - Hero style + copy (eyebrow, headline pattern, sub, CTAs)
 *  - Section eyebrows, headlines, CTA copy
 *  - Default services + value props (used if site.json doesn't supply)
 *  - Certifications bar contents
 *  - Feature flags (emergency bar, financing, process strip, before/after, seasonal promo)
 *  - Icon set
 *
 * The renderer calls `getTradeVariant(trade)` which normalizes the trade
 * string and returns the matching variant — falling back to `generic`.
 */

export interface TradeVariant {
  slug: string;
  label: string;
  palette: {
    primary: string;
    accent: string;
    soft: string; // background tint (10% accent)
  };
  hero: {
    style: "editorial" | "emergency" | "portfolio" | "classic";
    eyebrow: string;
    headline: (city: string) => string;
    headline_italic_tail: string; // shown below headline in italic
    subheadline: (businessName: string, city: string) => string;
    cta_primary: string;
    cta_secondary: string;
  };
  sections: {
    services_eyebrow: string;
    services_headline: string;
    services_italic_tail: string;
    work_eyebrow: string;
    work_headline: string;
    work_italic_tail: string;
    work_body: (city: string) => string;
    about_eyebrow: string;
    about_headline: string;
    about_italic_tail: string;
    reviews_eyebrow: string;
    reviews_headline: string;
    reviews_italic_tail: string;
    cta_eyebrow: string;
    cta_headline: string;
    cta_italic_tail: string;
    cta_body: (businessName: string, city: string) => string;
  };
  services: Array<{ name: string; description: string }>;
  value_props: string[];
  certifications: string[];
  flags: {
    emergency_bar: boolean;
    emergency_bar_text?: string;
    financing_callout: boolean;
    financing_text?: string;
    process_timeline: boolean;
    process_steps?: Array<{ step: string; detail: string }>;
    before_after: boolean;
    seasonal_promo: boolean;
    seasonal_promo_text?: string;
  };
}

// ── ROOFING ──
const ROOFER: TradeVariant = {
  slug: "roofer",
  label: "Roofing",
  palette: { primary: "#181818", accent: "#c41017", soft: "#fdf1f1" },
  hero: {
    style: "editorial",
    eyebrow: "Storm-tested roofing",
    headline: (city) => `Premium Roofing in ${city}`,
    headline_italic_tail: "built for every Illinois winter.",
    subheadline: (name, city) =>
      `${name} is a family-owned, GAF-certified roofer protecting ${city} homes with precision craftsmanship, transparent pricing, and roofs that stand up to every storm.`,
    cta_primary: "Get Free Inspection",
    cta_secondary: "See recent roofs",
  },
  sections: {
    services_eyebrow: "What we roof",
    services_headline: "Full-service roofing",
    services_italic_tail: "done the right way.",
    work_eyebrow: "Recent roofs",
    work_headline: "Craftsmanship that",
    work_italic_tail: "holds up.",
    work_body: (city) => `Every roof we finish protects a family in ${city}. Here are a few recent projects from around the neighborhood.`,
    about_eyebrow: "About us",
    about_headline: "Local. Trusted.",
    about_italic_tail: "Built to last.",
    reviews_eyebrow: "What homeowners say",
    reviews_headline: "Real words from",
    reviews_italic_tail: "real neighbors.",
    cta_eyebrow: "Ready when you are",
    cta_headline: "Let's protect your",
    cta_italic_tail: "biggest investment.",
    cta_body: (name, city) =>
      `${name} is standing by to help with your roofing needs${city ? ` in ${city}` : ""}. Free inspections. Honest pricing. Roofs that last.`,
  },
  services: [
    { name: "Roof Replacement", description: "Complete tear-offs with premium GAF and Owens Corning architectural shingles. Every replacement includes new underlayment, ice & water shield, and a lifetime workmanship warranty." },
    { name: "Storm Damage Repair", description: "24-hour emergency tarping and full insurance claim walk-through. We document every hail strike and fight for the full replacement you deserve." },
    { name: "Roof Repair", description: "Fast, precise repair for leaks, missing shingles, flashing failures, and worn valleys. Most repairs completed same-day with a two-year labor warranty." },
    { name: "Gutter Systems", description: "Seamless aluminum gutters, oversized downspouts, and leaf-guard systems sized for Illinois rainfall." },
    { name: "Free Inspections", description: "Thorough 27-point roof inspection with a full photo report — no sales pressure. Great for post-storm checkups and insurance claims." },
    { name: "Flat & Low-Slope Roofs", description: "TPO, EPDM, and modified bitumen systems for garages, porches, and additions." },
  ],
  value_props: ["Licensed, Bonded & Insured", "Lifetime Workmanship Warranty", "GAF Master Elite Certified", "Family Owned Since 2003"],
  certifications: ["Licensed & Bonded", "GAF Master Elite", "Owens Corning Preferred", "A+ BBB Rated", "Family Owned"],
  flags: {
    emergency_bar: false,
    financing_callout: true,
    financing_text: "0% financing available on full roof replacements. Ask about our 12-month same-as-cash program.",
    process_timeline: true,
    process_steps: [
      { step: "Free inspection", detail: "27-point photo report within 48 hours of your call." },
      { step: "Transparent quote", detail: "Itemized written estimate — no surprises, no pressure." },
      { step: "Expert install", detail: "Master-supervised crew, premium materials, punctual timeline." },
      { step: "Lifetime warranty", detail: "Workmanship backed for life. We stand behind every nail." },
    ],
    before_after: false,
    seasonal_promo: false,
  },
};

// ── PLUMBING ──
const PLUMBER: TradeVariant = {
  slug: "plumber",
  label: "Plumbing",
  palette: { primary: "#181818", accent: "#0284C7", soft: "#eff7fb" },
  hero: {
    style: "emergency",
    eyebrow: "24/7 emergency plumbing",
    headline: (city) => `Plumbers ${city} Trusts`,
    headline_italic_tail: "day or night, 365 days a year.",
    subheadline: (name, city) =>
      `${name} is the fast, honest plumber ${city} calls when it matters most. Upfront pricing, clean work, and real people answering the phone 24/7.`,
    cta_primary: "Call Now — 24/7",
    cta_secondary: "Our services",
  },
  sections: {
    services_eyebrow: "Plumbing services",
    services_headline: "Every plumbing job,",
    services_italic_tail: "done right the first time.",
    work_eyebrow: "Our work",
    work_headline: "Clean jobs.",
    work_italic_tail: "Happy homes.",
    work_body: (city) => `From emergency repairs to full repipes, here are a few recent jobs around ${city}.`,
    about_eyebrow: "About us",
    about_headline: "Upfront pricing.",
    about_italic_tail: "Real humans. Real fast.",
    reviews_eyebrow: "What people say",
    reviews_headline: "Neighbors who",
    reviews_italic_tail: "called at 2am.",
    cta_eyebrow: "Standing by",
    cta_headline: "Got a plumbing",
    cta_italic_tail: "emergency?",
    cta_body: (name, city) =>
      `${name} answers the phone 24/7${city ? ` in ${city}` : ""}. Flat-rate pricing, no overtime charges, and a tech at your door fast.`,
  },
  services: [
    { name: "Emergency Plumbing", description: "Burst pipes, no hot water, backed-up sewer — we're at your door 24/7 with a tech who can fix it on the first visit." },
    { name: "Drain Cleaning", description: "Hydro-jetting and camera inspection for clogged drains, sinks, and main sewer lines. Clears what snakes can't." },
    { name: "Water Heaters", description: "Tank and tankless installation, repair, and flush service. Same-day replacement on most brands." },
    { name: "Leak Detection", description: "Acoustic and thermal imaging to find hidden leaks without tearing up your walls or yard." },
    { name: "Repipe & Replace", description: "Whole-house repipes in PEX or copper. Clean install, no mess left behind." },
    { name: "Fixture Install", description: "Faucets, toilets, garbage disposals, and smart shower systems. Permit handling included." },
  ],
  value_props: ["24/7 Emergency Service", "Flat-Rate Upfront Pricing", "Licensed Master Plumbers", "Satisfaction Guaranteed"],
  certifications: ["Licensed & Bonded", "Master Plumber on Staff", "24/7 Live Dispatch", "A+ BBB Rated", "Veteran Owned"],
  flags: {
    emergency_bar: true,
    emergency_bar_text: "24/7 Emergency Service — Real people answering the phone right now.",
    financing_callout: false,
    process_timeline: false,
    before_after: false,
    seasonal_promo: false,
  },
};

// ── ELECTRICAL ──
const ELECTRICIAN: TradeVariant = {
  slug: "electrician",
  label: "Electrical",
  palette: { primary: "#181818", accent: "#D97706", soft: "#fdf6e9" },
  hero: {
    style: "classic",
    eyebrow: "Licensed master electricians",
    headline: (city) => `Safe Electrical Work in ${city}`,
    headline_italic_tail: "done to code, done right.",
    subheadline: (name, city) =>
      `${name} is the ${city}-area master electrician homeowners call when safety isn't negotiable. Panel upgrades, EV chargers, whole-home rewires — all inspection-ready.`,
    cta_primary: "Get Free Estimate",
    cta_secondary: "Our services",
  },
  sections: {
    services_eyebrow: "Electrical services",
    services_headline: "Safe. Certified.",
    services_italic_tail: "Inspection-ready.",
    work_eyebrow: "Our work",
    work_headline: "Code-compliant work",
    work_italic_tail: "you can trust.",
    work_body: (city) => `Every job passes inspection the first time. Here's a look at some recent installs around ${city}.`,
    about_eyebrow: "About us",
    about_headline: "Safety first.",
    about_italic_tail: "Always.",
    reviews_eyebrow: "What people say",
    reviews_headline: "Homeowners who",
    reviews_italic_tail: "sleep better at night.",
    cta_eyebrow: "Ready when you are",
    cta_headline: "Let's power your",
    cta_italic_tail: "home the right way.",
    cta_body: (name, city) =>
      `${name} is standing by for your electrical project${city ? ` in ${city}` : ""}. Free estimates, transparent pricing, and work that always passes inspection.`,
  },
  services: [
    { name: "Panel Upgrades", description: "200-amp and 400-amp service upgrades for modern home demand. Permit and inspection handled." },
    { name: "EV Charger Install", description: "Level 2 chargers from Tesla, ChargePoint, and JuiceBox. Load calc and dedicated circuit included." },
    { name: "Whole-Home Rewire", description: "Full rewires for older homes with knob-and-tube or aluminum. Safe, code-compliant, insurance-friendly." },
    { name: "Outlets & Switches", description: "New outlets, USB outlets, smart switches, and dimmers. Same-day install on most jobs." },
    { name: "Generator Install", description: "Whole-home standby generators from Generac and Kohler. Automatic transfer switch included." },
    { name: "Troubleshooting", description: "Flickering lights, tripping breakers, phantom outages — we find the root cause fast." },
  ],
  value_props: ["Licensed Master Electrician", "Code Compliant Work", "Free Estimates", "Safety First, Always"],
  certifications: ["Master Electrician", "Licensed & Bonded", "Tesla Certified Installer", "A+ BBB Rated", "OSHA Trained"],
  flags: {
    emergency_bar: false,
    financing_callout: true,
    financing_text: "Financing available on panel upgrades and EV charger installs. 0% APR for 12 months.",
    process_timeline: false,
    before_after: false,
    seasonal_promo: false,
  },
};

// ── HVAC ──
const HVAC: TradeVariant = {
  slug: "hvac",
  label: "Heating & Cooling",
  palette: { primary: "#181818", accent: "#EA580C", soft: "#fdf0e6" },
  hero: {
    style: "emergency",
    eyebrow: "Comfort in every season",
    headline: (city) => `HVAC Experts in ${city}`,
    headline_italic_tail: "heating, cooling, done right.",
    subheadline: (name, city) =>
      `${name} keeps ${city} homes comfortable all year. Same-day service, transparent flat-rate pricing, and NATE-certified techs who actually explain what they're doing.`,
    cta_primary: "Schedule Service",
    cta_secondary: "View services",
  },
  sections: {
    services_eyebrow: "HVAC services",
    services_headline: "Comfort solutions",
    services_italic_tail: "for every season.",
    work_eyebrow: "Recent installs",
    work_headline: "Quality systems,",
    work_italic_tail: "expert installs.",
    work_body: (city) => `High-efficiency systems installed clean, quiet, and on-time across ${city}.`,
    about_eyebrow: "About us",
    about_headline: "NATE certified.",
    about_italic_tail: "Honestly priced.",
    reviews_eyebrow: "What people say",
    reviews_headline: "Customers who",
    reviews_italic_tail: "never lost their cool.",
    cta_eyebrow: "Standing by",
    cta_headline: "Too hot? Too cold?",
    cta_italic_tail: "We're on it.",
    cta_body: (name, city) =>
      `${name} offers same-day service${city ? ` in ${city}` : ""} with flat-rate pricing and NATE-certified techs. Comfort restored, guaranteed.`,
  },
  services: [
    { name: "AC Repair", description: "Same-day AC repair with a flat-rate quote before we start. Most brands, most systems, fixed fast." },
    { name: "Furnace Service", description: "Furnace repair, maintenance, and replacement. We service gas, oil, and electric systems." },
    { name: "New System Install", description: "High-efficiency Carrier, Trane, and Lennox systems. Proper load calc, clean ductwork, quiet operation." },
    { name: "Tune-ups & Maintenance", description: "Seasonal multi-point inspections to prevent breakdowns and lower your energy bills." },
    { name: "Indoor Air Quality", description: "Whole-home air purifiers, humidifiers, UV lights, and high-MERV filtration." },
    { name: "Mini-Split Systems", description: "Ductless mini-splits for additions, garages, and uneven-temperature rooms." },
  ],
  value_props: ["NATE Certified Techs", "Same-Day Service", "Flat-Rate Pricing", "Energy Star Partner"],
  certifications: ["NATE Certified", "Carrier Factory Authorized", "Trane Comfort Specialist", "Energy Star Partner", "A+ BBB Rated"],
  flags: {
    emergency_bar: true,
    emergency_bar_text: "Same-day service available — No overtime charges, ever.",
    financing_callout: true,
    financing_text: "0% APR financing on new systems for 60 months. Rebates up to $2,000 on high-efficiency equipment.",
    process_timeline: false,
    before_after: false,
    seasonal_promo: true,
    seasonal_promo_text: "Spring tune-up special: $89 full AC inspection — book before April ends.",
  },
};

// ── LANDSCAPING ──
const LANDSCAPER: TradeVariant = {
  slug: "landscaper",
  label: "Landscaping",
  palette: { primary: "#181818", accent: "#16A34A", soft: "#ecfbf0" },
  hero: {
    style: "portfolio",
    eyebrow: "Design-build landscaping",
    headline: (city) => `Outdoor Spaces ${city} Loves`,
    headline_italic_tail: "designed, built, and maintained.",
    subheadline: (name, city) =>
      `${name} transforms ${city} yards into the outdoor spaces homeowners actually use. Custom design, quality install, and year-round maintenance from one trusted team.`,
    cta_primary: "Start Your Project",
    cta_secondary: "See our portfolio",
  },
  sections: {
    services_eyebrow: "What we build",
    services_headline: "From design",
    services_italic_tail: "to maintenance.",
    work_eyebrow: "Our portfolio",
    work_headline: "Gardens that",
    work_italic_tail: "grow with you.",
    work_body: (city) => `Every project starts with a conversation about how you actually want to live outside. Here are a few favorites from around ${city}.`,
    about_eyebrow: "About us",
    about_headline: "Rooted in",
    about_italic_tail: "craftsmanship.",
    reviews_eyebrow: "What people say",
    reviews_headline: "Clients who fell",
    reviews_italic_tail: "in love with their yards.",
    cta_eyebrow: "Let's begin",
    cta_headline: "Ready to love",
    cta_italic_tail: "your outdoor space?",
    cta_body: (name, city) =>
      `${name} offers free design consultations${city ? ` across ${city}` : ""}. Let's turn your yard into the outdoor room you've been picturing.`,
  },
  services: [
    { name: "Landscape Design", description: "Custom hand-drawn plans with 3D renderings. We walk you through plants, hardscape, and lighting before a shovel hits the ground." },
    { name: "Hardscaping", description: "Paver patios, natural stone walkways, retaining walls, and outdoor kitchens built to last decades." },
    { name: "Planting & Gardens", description: "Curated native and ornamental planting plans. Sustainable, four-season, low-water." },
    { name: "Lawn Care", description: "Mowing, edging, fertilization, aeration, and seasonal cleanups by one consistent crew." },
    { name: "Outdoor Lighting", description: "Low-voltage landscape lighting for paths, accent trees, and architectural features." },
    { name: "Irrigation", description: "Smart controller systems with zone-specific scheduling. Water-efficient and app-controlled." },
  ],
  value_props: ["Licensed & Insured", "Award-Winning Design Team", "Sustainable Practices", "15+ Years Local"],
  certifications: ["ICPI Certified", "Licensed & Insured", "Unilock Authorized", "Belgard Authorized", "NALP Member"],
  flags: {
    emergency_bar: false,
    financing_callout: true,
    financing_text: "Financing available on full design-build projects. 12 months same-as-cash on approved credit.",
    process_timeline: true,
    process_steps: [
      { step: "Free consultation", detail: "We walk your property together and listen to how you want to use it." },
      { step: "Custom design", detail: "Hand-drawn plans with 3D renderings you can actually visualize." },
      { step: "Expert build", detail: "Our in-house crew executes every detail of the approved plan." },
      { step: "Year-round care", detail: "Optional maintenance to keep your new space thriving." },
    ],
    before_after: true,
    seasonal_promo: true,
    seasonal_promo_text: "Spring design slots are filling fast — book a free consultation before May.",
  },
};

// ── PAINTING ──
const PAINTER: TradeVariant = {
  slug: "painter",
  label: "Painting",
  palette: { primary: "#181818", accent: "#7C3AED", soft: "#f4efff" },
  hero: {
    style: "portfolio",
    eyebrow: "Fine residential painting",
    headline: (city) => `Painters ${city} Recommends`,
    headline_italic_tail: "finishes that last, crews you trust.",
    subheadline: (name, city) =>
      `${name} is ${city}'s choice for interior and exterior painting done right. Meticulous prep, premium paint, and a clean finish that still looks great ten years later.`,
    cta_primary: "Free Color Consult",
    cta_secondary: "See before & after",
  },
  sections: {
    services_eyebrow: "Painting services",
    services_headline: "Every brushstroke",
    services_italic_tail: "done with care.",
    work_eyebrow: "Before & after",
    work_headline: "Transformations",
    work_italic_tail: "that speak for themselves.",
    work_body: (city) => `A great paint job comes down to prep. Here are a few ${city}-area projects that show the difference.`,
    about_eyebrow: "About us",
    about_headline: "Prep obsessed.",
    about_italic_tail: "Finish driven.",
    reviews_eyebrow: "What clients say",
    reviews_headline: "Homeowners who",
    reviews_italic_tail: "love the details.",
    cta_eyebrow: "Free color consult",
    cta_headline: "Ready to fall in love",
    cta_italic_tail: "with your home again?",
    cta_body: (name, city) =>
      `${name} offers free in-home color consultations${city ? ` across ${city}` : ""}. Quality paint, skilled crews, and a finish you'll actually be proud of.`,
  },
  services: [
    { name: "Interior Painting", description: "Walls, ceilings, trim, and doors finished with Sherwin-Williams or Benjamin Moore premium paints. Furniture moved, floors protected." },
    { name: "Exterior Painting", description: "Full exterior repaints with pressure wash, scrape, prime, and two coats. Weather-resistant finishes backed by a written warranty." },
    { name: "Cabinet Refinishing", description: "Professional spray-finished kitchen cabinets in any color. A fraction of replacement cost, gorgeous results." },
    { name: "Deck & Fence Staining", description: "Clean, seal, and stain wood decks and fences for durable weather protection." },
    { name: "Drywall Repair", description: "Patch, sand, and texture-match repairs before painting so no seams show." },
    { name: "Color Consultation", description: "Free in-home consultation with a certified color specialist to pick the perfect palette." },
  ],
  value_props: ["Licensed & Insured", "Premium Paint Standard", "Written Warranty", "Clean, Respectful Crews"],
  certifications: ["PDCA Member", "Sherwin-Williams Preferred", "Ben Moore Authorized", "Licensed & Insured", "A+ BBB Rated"],
  flags: {
    emergency_bar: false,
    financing_callout: false,
    process_timeline: false,
    before_after: true,
    seasonal_promo: true,
    seasonal_promo_text: "Interior repaint special: 10% off projects booked before May 1st.",
  },
};

// ── GENERAL CONTRACTOR ──
const GC: TradeVariant = {
  slug: "general-contractor",
  label: "General Contracting",
  palette: { primary: "#181818", accent: "#A16207", soft: "#faf3e3" },
  hero: {
    style: "portfolio",
    eyebrow: "Design-build remodeling",
    headline: (city) => `Home Remodelers in ${city}`,
    headline_italic_tail: "on time, on budget, on point.",
    subheadline: (name, city) =>
      `${name} takes ${city} remodels from first sketch to final walkthrough. Fixed-price contracts, clean job sites, and zero surprises. Kitchens, baths, additions, and whole-home transformations.`,
    cta_primary: "Schedule Consultation",
    cta_secondary: "See our work",
  },
  sections: {
    services_eyebrow: "What we build",
    services_headline: "Full-service",
    services_italic_tail: "remodeling & additions.",
    work_eyebrow: "Recent projects",
    work_headline: "Spaces that make",
    work_italic_tail: "homes feel new again.",
    work_body: (city) => `Every project tells a story about how a family lives. Here are a few recent transformations from around ${city}.`,
    about_eyebrow: "About us",
    about_headline: "On time.",
    about_italic_tail: "On budget. On point.",
    reviews_eyebrow: "What clients say",
    reviews_headline: "Homeowners who",
    reviews_italic_tail: "love their new space.",
    cta_eyebrow: "Let's build it",
    cta_headline: "Dreaming of a",
    cta_italic_tail: "better home?",
    cta_body: (name, city) =>
      `${name} offers free in-home consultations${city ? ` across ${city}` : ""}. Fixed-price contracts, weekly updates, and a finished space you'll love for decades.`,
  },
  services: [
    { name: "Kitchen Remodels", description: "Full kitchen transformations with custom cabinetry, stone countertops, and premium appliance integration. Design to completion." },
    { name: "Bathroom Remodels", description: "Spa-quality primary baths and full guest bath transformations. Custom tile, heated floors, and luxury fixtures." },
    { name: "Home Additions", description: "Room additions, second stories, and in-law suites built to match your existing home seamlessly." },
    { name: "Whole-Home Renovations", description: "Complete interior transformations for dated homes. Open floor plans, modern finishes, structural changes." },
    { name: "Basement Finishing", description: "Finished basements with proper moisture control, egress, and the amenities you actually want." },
    { name: "Outdoor Living", description: "Decks, patios, outdoor kitchens, and four-season rooms that extend your living space." },
  ],
  value_props: ["Licensed & Insured GC", "Fixed-Price Contracts", "Weekly Progress Updates", "Lifetime Craftsmanship Warranty"],
  certifications: ["Licensed General Contractor", "NARI Member", "NAHB Certified", "A+ BBB Rated", "Bonded & Insured"],
  flags: {
    emergency_bar: false,
    financing_callout: true,
    financing_text: "Flexible project financing available. We partner with local lenders for competitive rates.",
    process_timeline: true,
    process_steps: [
      { step: "Discovery call", detail: "We learn your goals, budget, and timeline on a free consultation call." },
      { step: "Design & quote", detail: "Detailed plans, 3D renderings, and a fixed-price contract you approve before work starts." },
      { step: "Clean build", detail: "Daily cleanup, weekly updates, and a dedicated project manager from start to finish." },
      { step: "Final walkthrough", detail: "Punch-list, warranty paperwork, and a space you'll love for decades." },
    ],
    before_after: true,
    seasonal_promo: false,
  },
};

// ── HANDYMAN ──
const HANDYMAN: TradeVariant = {
  slug: "handyman",
  label: "Handyman Services",
  palette: { primary: "#181818", accent: "#BE123C", soft: "#fdebf0" },
  hero: {
    style: "classic",
    eyebrow: "Trusted local handyman",
    headline: (city) => `Handyman in ${city}`,
    headline_italic_tail: "one call, dozens of fixes.",
    subheadline: (name, city) =>
      `${name} is the ${city}-area handyman homeowners actually keep on speed dial. Flat-rate pricing, same-week scheduling, and quality work on every fix — big or small.`,
    cta_primary: "Book a Visit",
    cta_secondary: "See service menu",
  },
  sections: {
    services_eyebrow: "Service menu",
    services_headline: "Dozens of fixes,",
    services_italic_tail: "one trusted pro.",
    work_eyebrow: "Recent work",
    work_headline: "Small jobs,",
    work_italic_tail: "done right.",
    work_body: (city) => `From squeaky doors to bathroom tile, here are a few recent jobs around ${city}.`,
    about_eyebrow: "About us",
    about_headline: "Reliable.",
    about_italic_tail: "On time. On budget.",
    reviews_eyebrow: "What people say",
    reviews_headline: "Homeowners who",
    reviews_italic_tail: "keep us on speed dial.",
    cta_eyebrow: "Standing by",
    cta_headline: "Got a to-do list",
    cta_italic_tail: "that's been growing?",
    cta_body: (name, city) =>
      `${name} offers same-week scheduling${city ? ` in ${city}` : ""} with flat-rate pricing. One call, dozens of fixes — done the right way.`,
  },
  services: [
    { name: "General Repairs", description: "Drywall patches, door repairs, caulking, squeaky floors, and the dozens of little things on your list." },
    { name: "Mounting & Installation", description: "TVs, shelves, mirrors, curtain rods, ceiling fans, and smart home devices — mounted level and secure." },
    { name: "Bathroom Fixes", description: "Leaky faucets, running toilets, caulking, grout, and tile repair. Fast and clean." },
    { name: "Carpentry", description: "Trim, baseboards, crown molding, custom shelving, and small woodwork projects." },
    { name: "Exterior Repairs", description: "Fence repair, gate fixes, deck boards, power washing, and outdoor maintenance." },
    { name: "Assembly & Install", description: "IKEA furniture, playsets, grills, shelving — assembled properly and quickly." },
  ],
  value_props: ["Flat-Rate Pricing", "Same-Week Scheduling", "Licensed & Insured", "Satisfaction Guaranteed"],
  certifications: ["Licensed & Insured", "Background Checked", "A+ BBB Rated", "Veteran Owned", "5-Star Google"],
  flags: {
    emergency_bar: false,
    financing_callout: false,
    process_timeline: false,
    before_after: false,
    seasonal_promo: false,
  },
};

// ── GENERIC FALLBACK ──
const GENERIC: TradeVariant = {
  slug: "generic",
  label: "Professional Services",
  palette: { primary: "#181818", accent: "#B45309", soft: "#fbf5ea" },
  hero: {
    style: "classic",
    eyebrow: "Trusted local pros",
    headline: (city) => `Quality Service in ${city}`,
    headline_italic_tail: "done the right way.",
    subheadline: (name, city) =>
      `${name} delivers quality service to ${city} homeowners with honest pricing, reliable work, and the craftsmanship you deserve.`,
    cta_primary: "Get Free Estimate",
    cta_secondary: "See services",
  },
  sections: {
    services_eyebrow: "What we do",
    services_headline: "Full-service",
    services_italic_tail: "done right.",
    work_eyebrow: "Recent work",
    work_headline: "Craftsmanship",
    work_italic_tail: "you can count on.",
    work_body: (city) => `Every job we finish becomes part of the neighborhood. Here are a few recent projects from around ${city}.`,
    about_eyebrow: "About us",
    about_headline: "Local. Trusted.",
    about_italic_tail: "Reliable.",
    reviews_eyebrow: "What people say",
    reviews_headline: "Real words from",
    reviews_italic_tail: "real neighbors.",
    cta_eyebrow: "Ready when you are",
    cta_headline: "Let's get",
    cta_italic_tail: "your project started.",
    cta_body: (name, city) =>
      `${name} is standing by to help${city ? ` in ${city}` : ""}. Free estimates, honest pricing, quality that lasts.`,
  },
  services: [
    { name: "Professional Service", description: "Experienced professionals at your service with quality workmanship." },
    { name: "Repairs", description: "Fast, reliable repairs when you need them most." },
    { name: "Installations", description: "Expert installation of new systems and equipment." },
    { name: "Maintenance", description: "Keep things running smoothly with regular maintenance." },
    { name: "Consultations", description: "Free estimates and honest advice before any work begins." },
    { name: "Emergency Service", description: "When you need help fast, we're here to respond." },
  ],
  value_props: ["Licensed & Insured", "Free Estimates", "Quality Work", "Satisfaction Guaranteed"],
  certifications: ["Licensed & Insured", "A+ BBB Rated", "5-Star Google", "Family Owned", "Local Since Day One"],
  flags: {
    emergency_bar: false,
    financing_callout: false,
    process_timeline: false,
    before_after: false,
    seasonal_promo: false,
  },
};

// ── Registry ──

export const TRADE_VARIANTS: Record<string, TradeVariant> = {
  roofer: ROOFER,
  roofing: ROOFER,
  plumber: PLUMBER,
  plumbing: PLUMBER,
  electrician: ELECTRICIAN,
  electrical: ELECTRICIAN,
  hvac: HVAC,
  "hvac contractor": HVAC,
  "heating and cooling": HVAC,
  landscaper: LANDSCAPER,
  landscaping: LANDSCAPER,
  painter: PAINTER,
  painting: PAINTER,
  "general contractor": GC,
  "general contracting": GC,
  gc: GC,
  remodeler: GC,
  handyman: HANDYMAN,
  "handyman services": HANDYMAN,
  generic: GENERIC,
};

/**
 * Auto-route: normalize trade string and return the matching variant.
 * Falls back to GENERIC if no match.
 */
export function getTradeVariant(trade: string | undefined | null): TradeVariant {
  if (!trade) return GENERIC;
  const key = trade.toLowerCase().trim();
  return TRADE_VARIANTS[key] || GENERIC;
}
