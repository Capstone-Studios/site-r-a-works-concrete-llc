"use client";

/**
 * Contact form — Roberts-style two-column input grid.
 *
 * Submits to the CRM's `/api/site-submissions` endpoint. The endpoint URL is
 * passed in from the deploy pipeline via siteData.submissions.endpoint so the
 * template doesn't need to know anything about the CRM's domain.
 *
 * When the endpoint is missing (preview builds, local dev), the form falls
 * back to a `mailto:` link so it still works for the business owner.
 */

import { useState, type FormEvent } from "react";
import { Send, Check } from "lucide-react";

interface ContactFormProps {
  businessName: string;
  siteSlug: string;
  endpoint: string;
  services: string[];
  accent: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  businessName,
  siteSlug,
  endpoint,
  services,
  accent,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      site_slug: siteSlug,
      business_name: businessName,
      submitter_name: String(formData.get("name") || "").trim(),
      submitter_phone: String(formData.get("phone") || "").trim(),
      submitter_email: String(formData.get("email") || "").trim() || null,
      service_needed: String(formData.get("service") || "").trim() || null,
      message: String(formData.get("message") || "").trim() || null,
      submitted_at: new Date().toISOString(),
    };

    if (!payload.submitter_name || !payload.submitter_phone) {
      setStatus("error");
      setErrorMessage("Name and phone are required.");
      return;
    }

    // No endpoint configured — open a mailto: draft instead so the form still works.
    if (!endpoint) {
      const body = encodeURIComponent(
        `Name: ${payload.submitter_name}\nPhone: ${payload.submitter_phone}\n` +
          `Email: ${payload.submitter_email || "—"}\nService: ${payload.service_needed || "—"}\n\n${payload.message || ""}`
      );
      window.location.href = `mailto:?subject=New%20website%20lead%20for%20${encodeURIComponent(
        businessName
      )}&body=${body}`;
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please call us directly."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="p-10 bg-[var(--bg-surface)] border border-[var(--border)] text-center"
        style={{ borderRadius: "2px" }}
      >
        <div
          className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: accent }}
        >
          <Check className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
        <h3
          className="font-display mb-3"
          style={{ fontSize: "1.5rem", fontWeight: 800 }}
        >
          Thanks — message received.
        </h3>
        <p className="text-[var(--ink-soft)]" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
          We&apos;ll be in touch shortly. For urgent requests please call us directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 md:p-10 bg-[var(--bg-surface)] border border-[var(--border)]"
      style={{ borderRadius: "2px" }}
      noValidate
    >
      <p
        className="font-display mb-6"
        style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.2 }}
      >
        Request a free estimate
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="form-label" htmlFor="cf-name">
            Full Name *
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            className="form-input"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cf-phone">
            Phone *
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            className="form-input"
            placeholder="(555) 555-5555"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="form-label" htmlFor="cf-email">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            className="form-input"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cf-service">
            Service Needed
          </label>
          <select id="cf-service" name="service" className="form-input" defaultValue="">
            <option value="">Select a service…</option>
            {services.slice(0, 8).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="form-label" htmlFor="cf-message">
          Project Details
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          className="form-input resize-none"
          placeholder="Tell us about your project…"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full justify-center"
        style={{
          opacity: status === "submitting" ? 0.7 : 1,
          cursor: status === "submitting" ? "not-allowed" : "pointer",
        }}
      >
        <Send className="w-4 h-4" strokeWidth={2.5} />
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>

      {status === "error" && errorMessage && (
        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: accent, fontFamily: "var(--font-body)" }}
        >
          {errorMessage}
        </p>
      )}

      <p
        className="eyebrow mt-5 text-center"
        style={{ color: "var(--ink-faint)", fontSize: "0.68rem" }}
      >
        We respect your privacy. No spam, ever.
      </p>
    </form>
  );
}
