import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set. Mocking email send to:", to);
    console.warn("Subject:", subject);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: "AFLEWO Admissions <hello@aflewo.org>",
      to: [to],
      subject: subject,
      html: html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend error:", error);
    return { success: false, error };
  }
}

export function generateApplicationEmailHtml(name: string, track: string, chapter: string) {
  return `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #d4af37;">Application Received</h2>
      <p>Dear ${name},</p>
      <p>Thank you for stepping up to serve. We have successfully received your application for <strong>${track}</strong> at the <strong>${chapter}</strong> chapter.</p>
      <p>Our chapter coordinators will review your submission and reach out within 48 hours with next steps.</p>
      <br/>
      <p>In His Service,</p>
      <p><strong>The AFLEWO Team</strong></p>
    </div>
  `;
}

export function generateAlumniEmailHtml(name: string, chapter: string) {
  return `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #d4af37;">Welcome Back to the Fold</h2>
      <p>Dear ${name},</p>
      <p>Thank you for re-registering as an AFLEWO Alumni for the <strong>${chapter}</strong> chapter.</p>
      <p>Your legacy is the foundation we build on. We will be in touch shortly regarding our upcoming Alumni activities and the 2026 Grace for Wholeness mobilization.</p>
      <br/>
      <p>In His Service,</p>
      <p><strong>The AFLEWO Team</strong></p>
    </div>
  `;
}
