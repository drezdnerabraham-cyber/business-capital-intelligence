"use client";

import { useState } from "react";

const INDUSTRIES = [
  "Restaurant / Food Service",
  "Retail",
  "Trucking / Transportation",
  "Construction",
  "Healthcare / Medical",
  "Salon / Beauty",
  "Auto / Automotive",
  "Hospitality / Hotel",
  "Franchise",
  "E-commerce",
  "Manufacturing",
  "Professional Services",
  "Real Estate",
  "Technology",
  "Other",
];

const ENTITY_TYPES = ["LLC", "Corporation", "Sole Proprietor", "Partnership", "S-Corporation", "Non-Profit"];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
  "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const TIB_OPTIONS = [
  { label: "Less than 3 months", value: "2" },
  { label: "3–6 months", value: "4" },
  { label: "6–12 months", value: "9" },
  { label: "1–2 years", value: "18" },
  { label: "2–3 years", value: "30" },
  { label: "3+ years", value: "48" },
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ApplicationPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [matchedLender, setMatchedLender] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    const data = await res.json();
    setMatchedLender(data.matched_lender ?? null);
    setStatus("success");
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 max-w-lg w-full text-center">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Application Received</h2>
          <p className="text-slate-500 mb-6">
            Thank you! We&apos;ve received your application and will be in touch shortly.
          </p>
          {matchedLender && (
            <p className="text-sm text-slate-400">Your application is being reviewed for funding options.</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Business Funding Application</h1>
          <p className="text-slate-500 mt-2">Takes about 2 minutes. No credit pull required to apply.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6"
        >
          {/* Business Info */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Business Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name *</label>
                <input
                  name="business_name"
                  required
                  placeholder="Acme LLC"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
                <select
                  name="industry"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select industry</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Entity Type *</label>
                <select
                  name="entity_type"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select type</option>
                  {ENTITY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Time in Business *</label>
                <select
                  name="time_in_business_months"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>How long have you been in business?</option>
                  {TIB_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Business Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Street Address *</label>
                <input
                  name="address"
                  required
                  placeholder="123 Main St"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                <input
                  name="city"
                  required
                  placeholder="New York"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                <select
                  name="state"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>State</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Owner Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner / Contact Name *</label>
                <input
                  name="owner_name"
                  required
                  placeholder="John Smith"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="(555) 000-0000"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes (optional)</label>
            <textarea
              name="additional_notes"
              rows={3}
              placeholder="Anything else we should know about your business or funding needs..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </section>

          {status === "error" && (
            <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {status === "submitting" ? "Submitting…" : "Submit Application"}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Your information is kept confidential and used only to match you with funding options.
          </p>
        </form>
      </div>
    </main>
  );
}
