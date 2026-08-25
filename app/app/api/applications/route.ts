import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { matchLender, buildMailtoLink, Application } from "@/lib/matcher";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const app: Application = {
    business_name: body.business_name,
    owner_name: body.owner_name,
    email: body.email,
    phone: body.phone,
    address: body.address,
    city: body.city,
    state: body.state,
    industry: body.industry,
    entity_type: body.entity_type,
    time_in_business_months: Number(body.time_in_business_months),
    additional_notes: body.additional_notes ?? "",
    submitted_at: new Date().toISOString(),
  };

  const match = matchLender(app);

  const { data, error } = await supabase
    .from("applications")
    .insert({
      ...app,
      matched_lender_id: match?.lender.id ?? null,
      matched_lender_name: match?.lender.name ?? null,
      match_reasons: match?.reasons ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
  }

  const mailtoLink = match ? buildMailtoLink({ ...app, id: data.id }, match) : null;

  return NextResponse.json({
    id: data.id,
    matched_lender: match?.lender.name ?? null,
    mailto_link: mailtoLink,
  });
}

export async function GET() {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, email_sent } = await req.json();
  const { error } = await supabase.from("applications").update({ email_sent }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
