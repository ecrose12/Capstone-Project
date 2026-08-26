import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body?.name?.trim();
  const email = body?.email?.trim();
  const message = body?.message?.trim();

  if (!name || !email || !email.includes("@") || !message) {
    return NextResponse.json({ error: "Please fill in all fields with a valid email" }, { status: 400 });
  }

  const svc = serviceClient();
  const { error } = await svc.from("support_requests").insert({ name, email, message });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // support@mywordsmatter.app always receives support requests, regardless
  // of environment configuration. SUPPORT_TEAM_EMAILS can add *additional*
  // recipients (e.g. a project partner) but can't accidentally remove this one.
  const DEFAULT_SUPPORT_EMAIL = "support@mywordsmatter.app";

  try {
    const extraEmails = (process.env.SUPPORT_TEAM_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean)
      .filter((e) => e.toLowerCase() !== DEFAULT_SUPPORT_EMAIL.toLowerCase());

    const teamEmails = [DEFAULT_SUPPORT_EMAIL, ...extraEmails];

    await sendEmail({
      to: teamEmails,
      subject: `New Support Request from ${name}`,
      replyTo: email,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch (emailError) {
    console.error("Failed to send support notification email:", emailError);
  }

  return NextResponse.json({ sent: true });
}