"use client";

import { useEffect, useState, useCallback } from "react";
import { buildMailtoLink } from "@/lib/matcher";
import lendersConfig from "../../../lenders/requirements.json";

interface ApplicationRow {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  industry: string;
  entity_type: string;
  time_in_business_months: number;
  additional_notes?: string;
  matched_lender_id: string | null;
  matched_lender_name: string | null;
  match_reasons: string[] | null;
  email_sent: boolean;
  submitted_at: string;
}

function formatTIB(months: number): string {
  if (months >= 12) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    return m > 0 ? `${y}y ${m}mo` : `${y}y`;
  }
  return `${months}mo`;
}

function statusBadge(app: ApplicationRow) {
  if (app.email_sent) {
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">Sent</span>;
  }
  if (app.matched_lender_name) {
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Ready</span>;
  }
  return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">No Match</span>;
}

export default function AdminPage() {
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ApplicationRow | null>(null);
  const [filter, setFilter] = useState<"all" | "ready" | "sent" | "unmatched">("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApps(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = apps.filter((a) => {
    if (filter === "ready") return !!a.matched_lender_name && !a.email_sent;
    if (filter === "sent") return a.email_sent;
    if (filter === "unmatched") return !a.matched_lender_name;
    return true;
  });

  async function markSent(id: string) {
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email_sent: true }),
    });
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, email_sent: true } : a));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, email_sent: true } : prev);
  }

  function getMailtoForApp(app: ApplicationRow): string | null {
    if (!app.matched_lender_id) return null;
    const lender = lendersConfig.lenders.find((l) => l.id === app.matched_lender_id);
    if (!lender) return null;
    return buildMailtoLink(
      {
        ...app,
        time_in_business_months: Number(app.time_in_business_months),
        submitted_at: app.submitted_at,
      },
      { lender: lender as Parameters<typeof buildMailtoLink>[1]["lender"], reasons: app.match_reasons ?? [] }
    );
  }

  const counts = {
    all: apps.length,
    ready: apps.filter((a) => !!a.matched_lender_name && !a.email_sent).length,
    sent: apps.filter((a) => a.email_sent).length,
    unmatched: apps.filter((a) => !a.matched_lender_name).length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Applications Dashboard</h1>
          <p className="text-sm text-slate-500">{apps.length} total applications</p>
        </div>
        <button
          onClick={load}
          className="text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          Refresh
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — list */}
        <aside className="w-96 border-r border-slate-200 bg-white flex flex-col">
          {/* Filter tabs */}
          <div className="flex border-b border-slate-100 text-sm">
            {(["all", "ready", "sent", "unmatched"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2.5 font-medium capitalize transition-colors ${
                  filter === f
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f} <span className="ml-1 text-xs opacity-60">({counts[f]})</span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <p className="p-6 text-sm text-slate-400">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="p-6 text-sm text-slate-400">No applications in this view.</p>
            ) : (
              filtered.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                    selected?.id === app.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium text-slate-900 text-sm truncate">{app.business_name}</span>
                    {statusBadge(app)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {app.industry} · {app.state} · {formatTIB(app.time_in_business_months)}
                  </div>
                  {app.matched_lender_name && (
                    <div className="text-xs text-blue-600 mt-0.5 truncate">→ {app.matched_lender_name}</div>
                  )}
                  <div className="text-xs text-slate-400 mt-0.5">
                    {new Date(app.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Right panel — detail */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm">Select an application to review</p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Status bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{selected.business_name}</h2>
                  {statusBadge(selected)}
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(selected.submitted_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* Lender match card */}
              {selected.matched_lender_name ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-1">Matched Lender</p>
                      <p className="text-lg font-bold text-blue-900">{selected.matched_lender_name}</p>
                      {selected.match_reasons && (
                        <ul className="mt-2 space-y-1">
                          {selected.match_reasons.map((r, i) => (
                            <li key={i} className="text-sm text-blue-700 flex items-start gap-1.5">
                              <span className="mt-0.5">✓</span>{r}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {!selected.email_sent ? (
                        <>
                          <a
                            href={getMailtoForApp(selected) ?? "#"}
                            onClick={() => {
                              setTimeout(() => markSent(selected.id), 1500);
                            }}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                          >
                            ✉ Draft Email
                          </a>
                          <button
                            onClick={() => markSent(selected.id)}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Mark as sent manually
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-green-700 font-semibold flex items-center gap-1">
                          ✓ Email Sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-amber-800">No lender match found</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This application doesn't meet the requirements for any configured lender. Check the
                    lender requirements in <code className="bg-amber-100 px-1 rounded">lenders/requirements.json</code>.
                  </p>
                </div>
              )}

              {/* Application details */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700">Application Details</h3>
                </div>
                <dl className="divide-y divide-slate-100">
                  {[
                    ["Owner", selected.owner_name],
                    ["Email", selected.email],
                    ["Phone", selected.phone],
                    ["Industry", selected.industry],
                    ["Entity Type", selected.entity_type],
                    ["Time in Business", formatTIB(selected.time_in_business_months)],
                    ["Address", `${selected.address}, ${selected.city}, ${selected.state}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex px-5 py-3 text-sm">
                      <dt className="w-40 font-medium text-slate-500 shrink-0">{label}</dt>
                      <dd className="text-slate-900">{value}</dd>
                    </div>
                  ))}
                  {selected.additional_notes && (
                    <div className="flex px-5 py-3 text-sm">
                      <dt className="w-40 font-medium text-slate-500 shrink-0">Notes</dt>
                      <dd className="text-slate-900 whitespace-pre-wrap">{selected.additional_notes}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Email preview */}
              {selected.matched_lender_name && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">Email Preview</h3>
                    <span className="text-xs text-slate-400">Opens in your email client</span>
                  </div>
                  <div className="p-5 font-mono text-xs text-slate-600 whitespace-pre-wrap bg-slate-50 overflow-x-auto">
                    {(() => {
                      const lender = lendersConfig.lenders.find((l) => l.id === selected.matched_lender_id);
                      if (!lender) return null;
                      const tib = selected.time_in_business_months >= 12
                        ? `${Math.floor(selected.time_in_business_months / 12)} year(s) ${selected.time_in_business_months % 12} month(s)`
                        : `${selected.time_in_business_months} month(s)`;

                      return `To: ${lender.email}
Subject: ${lender.email_template.subject.replace("{business_name}", selected.business_name).replace("{industry}", selected.industry).replace("{state}", selected.state)}

${lender.email_template.intro}

──────────────────────────────
BUSINESS INFORMATION
──────────────────────────────
Business Name:      ${selected.business_name}
Owner Name:         ${selected.owner_name}
Industry:           ${selected.industry}
Entity Type:        ${selected.entity_type}
Time in Business:   ${tib}
Address:            ${selected.address}, ${selected.city}, ${selected.state}
Email:              ${selected.email}
Phone:              ${selected.phone}${selected.additional_notes ? `\n\nAdditional Notes:\n${selected.additional_notes}` : ""}
──────────────────────────────`;
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
