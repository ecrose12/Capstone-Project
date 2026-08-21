import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
import { sendEmail } from "@/lib/email";

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { parentEmail } = await request.json();
  if (!parentEmail || !parentEmail.includes("@")) {
    return NextResponse.json({ error: "A valid parent/caregiver email is required" }, { status: 400 });
  }

  const svc = serviceClient();
  const { error } = await svc.from("child_access_requests").insert({
    child_user_id: user.id,
    parent_email: parentEmail.trim().toLowerCase(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mywordsmatter.app";
    await sendEmail({
      to: parentEmail.trim(),
      subject: "Your child would like to use My Words Matter",
      html: `
        <p>Hi,</p>
        <p>
          Someone using the email <strong>${user.email}</strong> has signed up
          for My Words Matter and indicated they're under 13. To use the app,
          they need a parent or caregiver to set up an account and give
          permission.
        </p>
        <p>
          <a href="${appUrl}/signup">Set up your Parent/Caregiver account</a>
          to get started. Once your account is ready, you'll be able to pair
          this child's account with yours.
        </p>
        <p>If you weren't expecting this, you can safely ignore this email.</p>
      `,
    });
  } catch (emailError) {
    console.error("Failed to send parent notification email:", emailError);
  }

  return NextResponse.json({ requested: true });
}