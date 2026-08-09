import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, replyTo, from }) {
  const result = await resend.emails.send({
    from: from || process.env.EMAIL_FROM || "My Words Matter <onboarding@resend.dev>",
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (result.error) {
    console.error("Resend rejected the request:", JSON.stringify(result.error, null, 2));
    throw new Error(result.error.message || "Failed to send email");
  }

  return result.data;
}