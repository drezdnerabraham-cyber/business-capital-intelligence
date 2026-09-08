import { NextRequest, NextResponse } from "next/server";
import { matchLender, buildMailtoLink, Application } from "@/lib/matcher";

// Live preview — match without saving. Used by admin to regenerate mailto links.
export async function POST(req: NextRequest) {
  const app: Application = await req.json();
  const match = matchLender(app);

  if (!match) {
    return NextResponse.json({ matched: false, lender: null, mailto_link: null });
  }

  return NextResponse.json({
    matched: true,
    lender: match.lender.name,
    lender_email: match.lender.email,
    reasons: match.reasons,
    mailto_link: buildMailtoLink(app, match),
  });
}
