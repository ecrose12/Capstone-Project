import { createClient } from "@/lib/supabase/server";

// Checks the current signed-in user's email against ADMIN_EMAILS.
// Returns { isAdmin, email } — used to gate the support inbox and reply routes.
export async function resolveAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { isAdmin: false, email: null };
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin = adminEmails.includes(user.email.toLowerCase());
  return { isAdmin, email: user.email };
}