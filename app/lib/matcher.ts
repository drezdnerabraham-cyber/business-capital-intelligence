import lendersConfig from "../../lenders/requirements.json";

export interface Application {
  id?: string;
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
  submitted_at?: string;
}

export interface Lender {
  id: string;
  name: string;
  email: string;
  priority: number;
  requirements: {
    industries: { allowed: string[]; blocked: string[] };
    min_time_in_business_months: number;
    entity_types: string[];
    states: string[];
    notes: string;
  };
  email_template: { subject: string; intro: string };
}

export interface MatchResult {
  lender: Lender;
  reasons: string[];
}

function normalizeIndustry(industry: string): string {
  return industry.toLowerCase().trim();
}

function lenderAcceptsApplication(lender: Lender, app: Application): { match: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const req = lender.requirements;
  const industry = normalizeIndustry(app.industry);

  // Industry check
  const blocked = req.industries.blocked.map((i) => i.toLowerCase());
  if (blocked.includes(industry)) {
    return { match: false, reasons: [`${lender.name} does not fund ${app.industry}`] };
  }

  const allowed = req.industries.allowed.map((i) => i.toLowerCase());
  if (!allowed.includes("any") && !allowed.includes(industry)) {
    return { match: false, reasons: [`${lender.name} does not fund ${app.industry} businesses`] };
  }

  // Time in business check
  if (app.time_in_business_months < req.min_time_in_business_months) {
    const needed = req.min_time_in_business_months;
    const has = app.time_in_business_months;
    return {
      match: false,
      reasons: [`${lender.name} requires ${needed} months in business; applicant has ${has}`],
    };
  }

  // Entity type check
  if (!req.entity_types.includes(app.entity_type)) {
    return {
      match: false,
      reasons: [`${lender.name} does not work with ${app.entity_type} entities`],
    };
  }

  // State check
  if (!req.states.includes("any") && !req.states.includes(app.state)) {
    return {
      match: false,
      reasons: [`${lender.name} does not fund businesses in ${app.state}`],
    };
  }

  reasons.push(`Meets all requirements for ${lender.name}`);
  if (req.notes) reasons.push(req.notes);

  return { match: true, reasons };
}

export function matchLender(app: Application): MatchResult | null {
  const lenders = [...(lendersConfig.lenders as Lender[])].sort((a, b) => a.priority - b.priority);

  for (const lender of lenders) {
    const { match, reasons } = lenderAcceptsApplication(lender, app);
    if (match) {
      return { lender, reasons };
    }
  }

  return null;
}

export function buildEmailDraft(app: Application, match: MatchResult): { subject: string; body: string; to: string } {
  const { lender } = match;
  const tib =
    app.time_in_business_months >= 12
      ? `${Math.floor(app.time_in_business_months / 12)} year(s) ${app.time_in_business_months % 12} month(s)`
      : `${app.time_in_business_months} month(s)`;

  const subject = lender.email_template.subject
    .replace("{business_name}", app.business_name)
    .replace("{industry}", app.industry)
    .replace("{state}", app.state);

  const body = `${lender.email_template.intro}

──────────────────────────────
BUSINESS INFORMATION
──────────────────────────────
Business Name:      ${app.business_name}
Owner Name:         ${app.owner_name}
Industry:           ${app.industry}
Entity Type:        ${app.entity_type}
Time in Business:   ${tib}
Address:            ${app.address}, ${app.city}, ${app.state}
Email:              ${app.email}
Phone:              ${app.phone}
${app.additional_notes ? `\nAdditional Notes:\n${app.additional_notes}` : ""}
──────────────────────────────
Application submitted: ${new Date(app.submitted_at ?? Date.now()).toLocaleString("en-US", { timeZone: "America/New_York" })} ET

Please let me know if you need anything else.

Thank you,
[Your Name]
[Your Company]
[Your Phone]`;

  return { subject, body, to: lender.email };
}

export function buildMailtoLink(app: Application, match: MatchResult): string {
  const { subject, body, to } = buildEmailDraft(app, match);
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
