/**
 * Roberts Exterior Services — faithful port.
 *
 * One-pager renderer whose visual design deliberately mirrors
 * https://robertsexteriorservices.com/ (cream + serif + accent color,
 * dark-hero with overlay, stacked about images, scale-x service hover,
 * large quote glyph, contact form + map, dark footer).
 *
 * Per-trade customization is limited to:
 *   - palette (accent color)
 *   - copy (eyebrows, headlines, service defaults)
 *   - feature flags (emergency bar, financing, process timeline)
 *
 * Everything else — typography, layout, section order, animations — is
 * identical across every site so the brand feel stays consistent.
 *
 * Photo fallbacks: when `data.photos` is sparse, we substitute from
 * `/fallback/*.jpg` (committed to the template repo) so the page never
 * shows empty slots.
 */

import {
  Phone,
  Star,
  ArrowRight,
  MapPin,
  Mail,
  Clock,
  AlertCircle,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { getTradeVariant } from "./trade-variants";
import ContactForm from "./contact-form";

// ── Types ──────────────────────────────────────────────────────────────

export interface SiteData {
  business: {
    name: string;
    trade: string;
    trade_label: string;
    city: string;
    state: string;
    address?: string | null;
    phone: string;
    phone_href: string;
    email?: string | null;
    website?: string | null;
    google_maps_url?: string | null;
    owner_name?: string | null;
    google_rating: number | null;
    review_count: number;
    years_in_business?: number | null;
    license_number?: string | null;
    hours?: string[] | null;
    service_areas: string[];
    top_services: string[];
  };
  brand: {
    theme: "dark" | "light";
    archetype_tagline?: string;
  };
  copy: {
    hero_headline: string;
    hero_subheadline: string;
    hero_cta_primary: string;
    trust_microcopy: string;
    owner_bio: string;
    best_review?: { text: string; author: string; rating: number } | null;
  };
  design_tokens: {
    colors: Record<string, string>;
  };
  services: Array<{ name: string; description: string }>;
  value_props: string[];
  reviews: Array<{ author: string; rating: number; text: string; date?: string }>;
  photos?: string[];
  submissions?: {
    site_slug?: string;
    endpoint?: string;
    notify_email?: string | null;
  };
  seo: {
    meta_title: string;
    meta_description: string;
  };
}

// ── Constants ──────────────────────────────────────────────────────────

// Roberts photos committed to /public/fallback/ — used when the lead's own
// research didn't produce enough photos. Keeps every site visually complete.
const FALLBACK_PHOTOS = [
  "/fallback/overall.jpg",
  "/fallback/gallery-1.jpg",
  "/fallback/gallery-2.jpg",
  "/fallback/gallery-5.jpg",
  "/fallback/gallery-6.jpg",
  "/fallback/gallery-8.jpg",
];

// ── Helpers ────────────────────────────────────────────────────────────

/** Pad the photo list with fallback assets so every slot has an image. */
function withFallback(photos: string[] | undefined, minCount: number): string[] {
  const real = (photos || []).filter((p) => typeof p === "string" && p.length > 0);
  if (real.length >= minCount) return real;
  const padded = [...real];
  let i = 0;
  while (padded.length < minCount) {
    padded.push(FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length]);
    i++;
  }
  return padded;
}

function hasValidReviews(reviews: SiteData["reviews"]): boolean {
  return (
    Array.isArray(reviews) &&
    reviews.some((r) => r.text && r.text.length > 20 && r.author && r.author.length > 0)
  );
}

// ── Renderer ───────────────────────────────────────────────────────────

export function SiteRenderer({ data }: { data: SiteData }) {
  const biz = data.business;
  const copy = data.copy;
  const variant = getTradeVariant(biz.trade);
  const flags = variant.flags;

  // Trade palette injects accent + soft tint; everything else comes from globals.css.
  const accent = data.design_tokens?.colors?.brand_accent || variant.palette.accent;
  const soft = variant.palette.soft;
  const cssVars: React.CSSProperties = {
    "--brand-accent": accent,
    "--brand-accent-hover": accent,
    "--brand-soft": soft,
  } as React.CSSProperties;

  // Photos — pad with Roberts fallbacks so the page never looks empty.
  const photos = withFallback(data.photos, 7);
  const heroBg = photos[0];
  const aboutMain = photos[1];
  const aboutAccent = photos[2];
  const galleryPhotos = photos.slice(3, 9);
  const ctaBg = photos[6] || photos[0];

  // Filter reviews to substantive ones.
  const reviews = (data.reviews || []).filter(
    (r) => r.text && r.text.length > 20 && r.author && r.author.length > 0
  );
  const showReviews = hasValidReviews(reviews);
  const visibleReviews = reviews.slice(0, 3);

  // Variant defaults when sparse
  const services =
    data.services && data.services.length > 0 ? data.services.slice(0, 8) : variant.services.slice(0, 8);
  const valueProps =
    data.value_props && data.value_props.length > 0 ? data.value_props : variant.value_props;
  const certifications = variant.certifications;

  // Data flags for progressive disclosure
  const phone = biz.phone;
  const phoneHref = biz.phone_href;
  const rating = biz.google_rating;
  const reviewCount = biz.review_count || 0;
  const hasRating = rating !== null && rating !== undefined && rating > 0;
  const hasReviewCount = reviewCount > 0;
  const city = biz.city || "your area";
  const hasOwner = !!biz.owner_name && biz.owner_name.trim().length > 0;
  const hasYears = !!biz.years_in_business && biz.years_in_business > 0;
  const hasLicense = !!biz.license_number && biz.license_number.trim().length > 0;
  const hasAddress = !!biz.address && biz.address.trim().length > 0;
  const hasEmail = !!biz.email && biz.email.includes("@");
  const hasHours = Array.isArray(biz.hours) && biz.hours.length > 0;
  const hasMapsUrl = !!biz.google_maps_url && biz.google_maps_url.startsWith("http");

  const heroHeadline = copy.hero_headline || variant.hero.headline(city);
  const heroItalicTail = variant.hero.headline_italic_tail;
  const heroSub = copy.hero_subheadline || variant.hero.subheadline(biz.name, city);
  const heroCtaPrimary = copy.hero_cta_primary || variant.hero.cta_primary;
  const heroCtaSecondary = variant.hero.cta_secondary;

  // Map embed URL — uses the business address when available, falls back to city.
  const mapQuery = encodeURIComponent(
    biz.address || `${biz.name}, ${city}${biz.state ? `, ${biz.state}` : ""}`
  );
  const mapEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <div style={cssVars} className="bg-[var(--bg-base)] text-[var(--ink)]">
      {/* ── EMERGENCY BAR (plumbing/HVAC only) ── */}
      {flags.emergency_bar && phone && (
        <a
          href={phoneHref}
          className="block w-full text-center text-[13px] font-bold tracking-[0.1em] uppercase text-white py-2.5 px-4 transition-colors"
          style={{ backgroundColor: accent, fontFamily: "var(--font-eyebrow)" }}
        >
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
            {flags.emergency_bar_text}
            <span className="hidden sm:inline opacity-85">· Call {phone}</span>
          </span>
        </a>
      )}

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 bg-[var(--bg-surface)]"
        style={{ borderBottom: `2px solid ${accent}` }}
      >
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
          <a href="#top" className="flex items-baseline gap-1.5">
            <span
              className="font-display text-[22px] tracking-tight text-[var(--ink)]"
              style={{ fontWeight: 900 }}
            >
              {biz.name.split(" ")[0]}
            </span>
            <span
              className="font-display text-[22px] italic"
              style={{ color: accent, fontWeight: 400 }}
            >
              {biz.name.split(" ").slice(1).join(" ") || biz.trade_label}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="nav-link">Services</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#work" className="nav-link">Our Work</a>
            {showReviews && <a href="#reviews" className="nav-link">Reviews</a>}
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          {phone && (
            <a
              href={phoneHref}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase text-white transition-all hover:brightness-110"
              style={{
                backgroundColor: accent,
                fontFamily: "var(--font-eyebrow)",
                borderRadius: "2px",
              }}
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
              {phone}
            </a>
          )}
        </div>
      </nav>

      {/* ── HERO — full viewport dark background + overlay text ── */}
      <section
        id="top"
        className="relative min-h-[88vh] md:min-h-[94vh] flex items-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.78) 100%)",
          }}
        />
        <div className="hero-accent-line hidden md:block" />

        <div className="relative max-w-[1240px] mx-auto px-6 md:px-10 py-24 md:py-36 w-full">
          <div className="max-w-3xl">
            <p className="eyebrow-accent fade-up mb-6" style={{ color: accent }}>
              — {variant.hero.eyebrow}
            </p>

            <h1
              className="font-display text-white fade-up-delay-1"
              style={{
                fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                fontWeight: 900,
              }}
            >
              {heroHeadline}{" "}
              <span className="italic" style={{ color: accent, fontWeight: 400 }}>
                {heroItalicTail}
              </span>
            </h1>

            <p
              className="fade-up-delay-2 mt-8 max-w-xl text-white/75"
              style={{
                fontWeight: 300,
                fontSize: "clamp(1rem, 1.35vw, 1.2rem)",
                lineHeight: 1.7,
              }}
            >
              {heroSub}
            </p>

            <div className="fade-up-delay-3 mt-12 flex flex-col sm:flex-row items-start gap-4">
              {phone && (
                <a href={phoneHref} className="btn-primary">
                  <Phone className="w-4 h-4" strokeWidth={2.5} />
                  {heroCtaPrimary}
                </a>
              )}
              <a href="#services" className="btn-secondary">
                {heroCtaSecondary}
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>
            </div>

            {(hasRating || hasReviewCount) && (
              <div className="fade-up-delay-4 mt-12 flex items-center gap-6 pt-8 border-t border-white/15 max-w-md">
                {hasRating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5"
                          fill={i <= Math.round(rating!) ? "#f5b942" : "none"}
                          stroke="#f5b942"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <span
                      className="eyebrow"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {rating} Google
                    </span>
                  </div>
                )}
                {hasReviewCount && (
                  <span className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {reviewCount}+ Reviews
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CERT STRIP ── */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-base)] py-8">
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {certifications.map((c, i) => (
            <span key={c} className="flex items-center gap-3">
              <span
                className="eyebrow"
                style={{ color: "var(--ink-faint)", fontSize: "0.72rem" }}
              >
                {c}
              </span>
              {i < certifications.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-[var(--ink-faint)]" />
              )}
            </span>
          ))}
        </div>
      </section>

      {/* ── SEASONAL PROMO ── */}
      {flags.seasonal_promo && flags.seasonal_promo_text && (
        <section className="py-5" style={{ backgroundColor: "var(--brand-soft)" }}>
          <div className="max-w-[1240px] mx-auto px-6 md:px-10 flex items-center justify-center gap-3 text-[13px]">
            <Sparkles className="w-4 h-4 shrink-0" style={{ color: accent }} strokeWidth={2} />
            <span>{flags.seasonal_promo_text}</span>
          </div>
        </section>
      )}

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 md:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 reveal">
            <p className="eyebrow-accent mb-4" style={{ color: accent }}>
              — {variant.sections.services_eyebrow}
            </p>
            <h2
              className="font-display mx-auto max-w-3xl"
              style={{
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                fontWeight: 900,
              }}
            >
              {variant.sections.services_headline}{" "}
              <span className="italic" style={{ color: accent, fontWeight: 400 }}>
                {variant.sections.services_italic_tail}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const servicePhoto = photos[(idx + 1) % photos.length];
              return (
                <div key={idx} className="service-card reveal">
                  <div className="card-image" style={{ height: "170px", position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url(${servicePhoto})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="font-display mb-2 text-[var(--ink)]"
                      style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.15 }}
                    >
                      {service.name}
                    </h3>
                    <p
                      className="text-[var(--ink-soft)]"
                      style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ABOUT — stacked images + check list + callout ── */}
      <section id="about" className="py-24 md:py-32 bg-[var(--bg-base)]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 reveal">
              <div className="stacked-photos">
                <div
                  className="main-photo"
                  style={{
                    backgroundImage: `url(${aboutMain})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  className="accent-photo"
                  style={{
                    backgroundImage: `url(${aboutAccent})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-7 reveal">
              <p className="eyebrow-accent mb-4" style={{ color: accent }}>
                — {variant.sections.about_eyebrow}
              </p>
              <h2
                className="font-display mb-6"
                style={{
                  fontSize: "clamp(2rem, 3.75vw, 3.25rem)",
                  lineHeight: 1.08,
                  fontWeight: 900,
                }}
              >
                {variant.sections.about_headline}{" "}
                <span className="italic" style={{ color: accent, fontWeight: 400 }}>
                  {variant.sections.about_italic_tail}
                </span>
              </h2>

              <p
                className="mb-8 text-[var(--ink-soft)]"
                style={{ fontSize: "1.05rem", lineHeight: 1.75 }}
              >
                {copy.owner_bio}
              </p>

              {valueProps.length > 0 && (
                <ul className="check-list mb-8">
                  {valueProps.slice(0, 5).map((prop) => (
                    <li key={prop}>{prop}</li>
                  ))}
                </ul>
              )}

              {(hasOwner || hasYears || hasLicense) && (
                <div
                  className="p-6"
                  style={{
                    backgroundColor: "var(--brand-soft)",
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: "2px",
                  }}
                >
                  {hasOwner && (
                    <p
                      className="font-display mb-1"
                      style={{ fontSize: "1.25rem", fontWeight: 700 }}
                    >
                      {biz.owner_name}
                      {hasYears && (
                        <span
                          className="eyebrow ml-3"
                          style={{ color: "var(--ink-faint)" }}
                        >
                          {biz.years_in_business}+ YRS
                        </span>
                      )}
                    </p>
                  )}
                  {hasLicense && (
                    <p
                      className="eyebrow mt-1"
                      style={{ color: "var(--ink-soft)", fontSize: "0.75rem" }}
                    >
                      License {biz.license_number}
                    </p>
                  )}
                  {!hasOwner && hasYears && (
                    <p
                      className="font-display"
                      style={{ fontSize: "1.25rem", fontWeight: 700 }}
                    >
                      {biz.years_in_business}+ years serving {city}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINANCING CALLOUT ── */}
      {flags.financing_callout && flags.financing_text && (
        <section className="py-16" style={{ backgroundColor: "var(--brand-soft)" }}>
          <div className="max-w-4xl mx-auto px-6 md:px-10 flex items-start gap-6">
            <div
              className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accent }}
            >
              <CreditCard className="w-5 h-5 text-white" strokeWidth={2.25} />
            </div>
            <div className="flex-1">
              <p className="eyebrow-accent mb-2" style={{ color: accent }}>
                — Flexible Financing
              </p>
              <p
                className="font-display"
                style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3 }}
              >
                {flags.financing_text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY — first tile spans 2 cols ── */}
      <section id="work" className="py-24 md:py-32 bg-[var(--bg-alt)]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 reveal">
            <p className="eyebrow-accent mb-4" style={{ color: accent }}>
              — {variant.sections.work_eyebrow}
            </p>
            <h2
              className="font-display mx-auto max-w-3xl"
              style={{
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                fontWeight: 900,
              }}
            >
              {variant.sections.work_headline}{" "}
              <span className="italic" style={{ color: accent, fontWeight: 400 }}>
                {variant.sections.work_italic_tail}
              </span>
            </h2>
            <p
              className="mt-6 mx-auto max-w-2xl text-[var(--ink-soft)]"
              style={{ fontSize: "1rem", lineHeight: 1.7 }}
            >
              {variant.sections.work_body(city)}
            </p>
          </div>

          <div
            className="grid gap-[10px]"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {galleryPhotos.slice(0, 6).map((url, i) => (
              <div
                key={i}
                className="gallery-tile reveal"
                style={{
                  gridColumn: i === 0 ? "span 2" : "span 1",
                  aspectRatio: i === 0 ? "2 / 1" : "1 / 1",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS TIMELINE ── */}
      {flags.process_timeline && flags.process_steps && flags.process_steps.length > 0 && (
        <section className="py-24 bg-[var(--bg-base)]">
          <div className="max-w-[1240px] mx-auto px-6 md:px-10">
            <div className="max-w-2xl mx-auto text-center mb-14 reveal">
              <p className="eyebrow-accent mb-4" style={{ color: accent }}>
                — How It Works
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}
              >
                A clear path{" "}
                <span className="italic" style={{ color: accent, fontWeight: 400 }}>
                  from quote to finish.
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {flags.process_steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-7 bg-[var(--bg-surface)] border border-[var(--border)] reveal"
                  style={{ borderRadius: "2px" }}
                >
                  <div
                    className="eyebrow-accent mb-3"
                    style={{ color: accent, fontSize: "0.7rem" }}
                  >
                    Step {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3
                    className="font-display mb-2"
                    style={{ fontSize: "1.25rem", fontWeight: 700 }}
                  >
                    {step.step}
                  </h3>
                  <p
                    className="text-[var(--ink-soft)]"
                    style={{ fontSize: "0.9rem", lineHeight: 1.65 }}
                  >
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── REVIEWS — large quote glyph ── */}
      {showReviews && (
        <section id="reviews" className="py-24 md:py-32 bg-[var(--bg-base)]">
          <div className="max-w-[1240px] mx-auto px-6 md:px-10">
            <div className="text-center mb-16 reveal">
              <p className="eyebrow-accent mb-4" style={{ color: accent }}>
                — {variant.sections.reviews_eyebrow}
              </p>
              <h2
                className="font-display mx-auto max-w-3xl"
                style={{
                  fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                  lineHeight: 1.1,
                  fontWeight: 900,
                }}
              >
                {variant.sections.reviews_headline}{" "}
                <span className="italic" style={{ color: accent, fontWeight: 400 }}>
                  {variant.sections.reviews_italic_tail}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleReviews.map((review, i) => (
                <div
                  key={i}
                  className="p-8 bg-[var(--bg-surface)] border border-[var(--border)] relative reveal"
                  style={{ borderRadius: "2px" }}
                >
                  <div className="quote-glyph absolute top-4 left-5" aria-hidden="true">
                    &ldquo;
                  </div>
                  <p
                    className="mt-10 text-[var(--ink-soft)]"
                    style={{ fontSize: "0.95rem", lineHeight: 1.75 }}
                  >
                    {review.text.length > 260 ? review.text.slice(0, 260) + "…" : review.text}
                  </p>
                  <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center justify-between">
                    <div>
                      <p
                        className="font-display text-[var(--ink)]"
                        style={{ fontSize: "1rem", fontWeight: 700 }}
                      >
                        {review.author}
                      </p>
                      {review.date && (
                        <p
                          className="eyebrow mt-0.5"
                          style={{ color: "var(--ink-faint)", fontSize: "0.68rem" }}
                        >
                          {review.date}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-3.5 h-3.5"
                          fill={s <= (review.rating || 5) ? "#f5b942" : "none"}
                          stroke="#f5b942"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT — form + map + icon stack ── */}
      <section id="contact" className="py-24 md:py-32" style={{ backgroundColor: "var(--bg-deep)" }}>
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="max-w-3xl mb-16 reveal">
            <p className="eyebrow-accent mb-4" style={{ color: accent }}>
              — Get In Touch
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                fontWeight: 900,
              }}
            >
              Let&apos;s talk about{" "}
              <span className="italic" style={{ color: accent, fontWeight: 400 }}>
                your project.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="reveal space-y-8">
              <div className="space-y-5">
                {phone && (
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accent }}
                    >
                      <Phone className="w-4 h-4 text-white" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="eyebrow mb-1">Call</p>
                      <a
                        href={phoneHref}
                        className="font-display text-[var(--ink)] hover:opacity-70 transition-opacity"
                        style={{ fontSize: "1.35rem", fontWeight: 700 }}
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}
                {hasEmail && (
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accent }}
                    >
                      <Mail className="w-4 h-4 text-white" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="eyebrow mb-1">Email</p>
                      <a
                        href={`mailto:${biz.email}`}
                        className="font-display text-[var(--ink)] hover:opacity-70 transition-opacity break-all"
                        style={{ fontSize: "1.1rem", fontWeight: 700 }}
                      >
                        {biz.email}
                      </a>
                    </div>
                  </div>
                )}
                {hasAddress && (
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accent }}
                    >
                      <MapPin className="w-4 h-4 text-white" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="eyebrow mb-1">Visit</p>
                      <p className="text-[var(--ink)]" style={{ fontSize: "1rem", lineHeight: 1.55 }}>
                        {biz.address}
                      </p>
                    </div>
                  </div>
                )}
                {hasHours && (
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accent }}
                    >
                      <Clock className="w-4 h-4 text-white" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="eyebrow mb-1">Hours</p>
                      <div
                        className="space-y-0.5 text-[var(--ink-soft)]"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {biz.hours!.slice(0, 7).map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="aspect-[4/3] border-8 border-[var(--bg-surface)] shadow-lg overflow-hidden"
                style={{ borderRadius: "2px" }}
              >
                <iframe
                  title={`${biz.name} location`}
                  src={mapEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="reveal">
              <ContactForm
                businessName={biz.name}
                siteSlug={data.submissions?.site_slug || ""}
                endpoint={data.submissions?.endpoint || ""}
                services={services.map((s) => s.name)}
                accent={accent}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${ctaBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.75) 100%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 md:px-10 text-center reveal">
          <p className="eyebrow-accent mb-5" style={{ color: accent }}>
            — {variant.sections.cta_eyebrow}
          </p>
          <h2
            className="font-display text-white mb-8"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
              lineHeight: 1.05,
              fontWeight: 900,
            }}
          >
            {variant.sections.cta_headline}{" "}
            <span className="italic" style={{ color: accent, fontWeight: 400 }}>
              {variant.sections.cta_italic_tail}
            </span>
          </h2>
          <p
            className="text-white/75 mb-10 mx-auto max-w-xl"
            style={{ fontSize: "1.05rem", lineHeight: 1.7, fontWeight: 300 }}
          >
            {variant.sections.cta_body(biz.name, city)}
          </p>
          {phone && (
            <a href={phoneHref} className="btn-primary" style={{ padding: "1.1rem 2.25rem" }}>
              <Phone className="w-4 h-4" strokeWidth={2.5} />
              Call {phone}
            </a>
          )}
        </div>
      </section>

      {/* ── DARK FOOTER ── */}
      <footer
        className="py-16"
        style={{
          backgroundColor: "var(--bg-contrast)",
          borderTop: `3px solid ${accent}`,
          color: "#ffffff",
        }}
      >
        <div className="max-w-[1240px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <p
                className="font-display mb-3 text-white"
                style={{ fontSize: "1.4rem", fontWeight: 900 }}
              >
                {biz.name.split(" ")[0]}{" "}
                <span className="italic" style={{ color: accent, fontWeight: 400 }}>
                  {biz.name.split(" ").slice(1).join(" ") || biz.trade_label}
                </span>
              </p>
              <p className="text-white/60" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
                Quality {biz.trade_label.toLowerCase()} for homeowners
                {biz.city ? ` in ${biz.city}` : ""}. Licensed, insured, and proudly local.
              </p>
              {hasLicense && (
                <p
                  className="eyebrow mt-4"
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}
                >
                  LIC {biz.license_number}
                </p>
              )}
            </div>

            <div>
              <p className="eyebrow mb-4" style={{ color: accent }}>
                Contact
              </p>
              <div className="space-y-2 text-white/70" style={{ fontSize: "0.9rem" }}>
                {phone && (
                  <a href={phoneHref} className="block hover:text-white transition-colors">
                    {phone}
                  </a>
                )}
                {hasEmail && (
                  <a
                    href={`mailto:${biz.email}`}
                    className="block hover:text-white transition-colors break-all"
                  >
                    {biz.email}
                  </a>
                )}
                {hasMapsUrl && (
                  <a
                    href={biz.google_maps_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-white transition-colors"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4" style={{ color: accent }}>
                {hasHours ? "Hours" : "Location"}
              </p>
              <div className="space-y-1.5 text-white/70" style={{ fontSize: "0.85rem" }}>
                {hasAddress && <p>{biz.address}</p>}
                {!hasAddress && biz.city && (
                  <p>
                    {biz.city}
                    {biz.state ? `, ${biz.state}` : ""}
                  </p>
                )}
                {hasHours && (
                  <div className="mt-3 space-y-0.5" style={{ fontSize: "0.8rem" }}>
                    {biz.hours!.slice(0, 7).map((line, i) => (
                      <p key={i} className="text-white/50">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4" style={{ color: accent }}>
                Service Area
              </p>
              <p className="text-white/70" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                {biz.service_areas && biz.service_areas.length > 0
                  ? biz.service_areas.join(" · ")
                  : biz.city || "Local area"}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
              © {new Date().getFullYear()} {biz.name}. All rights reserved.
            </p>
            <p
              className="eyebrow"
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}
            >
              Site by <span style={{ color: accent }}>Capstone Studios</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ── MOBILE STICKY CALL ── */}
      {phone && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3"
          style={{
            backgroundColor: "rgba(250,249,246,0.96)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <a href={phoneHref} className="btn-primary w-full justify-center">
            <Phone className="w-4 h-4" strokeWidth={2.5} />
            Call {phone}
          </a>
        </div>
      )}
    </div>
  );
}

export default SiteRenderer;
