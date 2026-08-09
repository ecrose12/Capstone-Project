import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { resolveAdmin } from "@/lib/adminAuth";
import { sendEmail } from "@/lib/email";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request, { params }) {
  const { isAdmin } = await resolveAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const { message } = await request.json();

  const trimmed = message?.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Reply message cannot be empty" }, { status: 400 });
  }

  const svc = serviceClient();
  const { data: original, error: fetchError } = await svc
    .from("support_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!original) {
    return NextResponse.json({ error: "Support request not found" }, { status: 404 });
  }

  await sendEmail({
    to: original.email,
    from: "My Words Matter Support <support@mywordsmatter.app>",
    subject: `Re: Your message to My Words Matter Support`,
    html: `
      <p>Hi ${original.name},</p>
      <p>${trimmed.replace(/\n/g, "<br>")}</p>
      <hr>
      <p style="color:#666;font-size:0.9em;">Your original message: "${original.message}"</p>
    `,
  });

  const { error: updateError } = await svc
    .from("support_requests")
    .update({
      status: "resolved",
      replied_at: new Date().toISOString(),
      reply_message: trimmed,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
