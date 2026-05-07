import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, instagram, email, city, role, contribution } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    // ── Store in Supabase ──────────────────────────────────
    const supabase = createServerClient();
    const { error: dbError } = await supabase.from("membership_applications").insert({
      name,
      instagram,
      email,
      city,
      role,
      contribution,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("[membership] Supabase insert error:", dbError);
    }

    // ── Notify team via Resend ─────────────────────────────
    const notificationEmail = process.env.NOTIFICATION_EMAIL || "hello@slowhrs.com";

    await resend.emails.send({
      from: "SLOWHRS <onboarding@resend.dev>",
      to: notificationEmail,
      subject: `New Membership Application — ${name}`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 0">
          <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:24px">SLOWHRS — Membership Application</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1a1a1a">
            <tr><td style="padding:6px 12px;font-weight:600;text-transform:uppercase;font-size:11px;color:#888">NAME</td><td style="padding:6px 12px">${name}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;text-transform:uppercase;font-size:11px;color:#888">IG</td><td style="padding:6px 12px">${instagram}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;text-transform:uppercase;font-size:11px;color:#888">EMAIL</td><td style="padding:6px 12px">${email}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;text-transform:uppercase;font-size:11px;color:#888">CITY</td><td style="padding:6px 12px">${city}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;text-transform:uppercase;font-size:11px;color:#888">ROLE</td><td style="padding:6px 12px">${role}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;text-transform:uppercase;font-size:11px;color:#888">CONTRIBUTION</td><td style="padding:6px 12px">${contribution}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0" />
          <p style="font-size:10px;color:#bbb">Sent via SLOWHRS membership form</p>
        </div>
      `,
    });

    // ── Confirm to applicant ───────────────────────────────
    await resend.emails.send({
      from: "SLOWHRS <onboarding@resend.dev>",
      to: email,
      subject: "received. we review weekly.",
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px 0;text-align:center">
          <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin-bottom:20px">SLOWHRS</p>
          <p style="font-size:16px;color:#1a1a1a;line-height:1.5">Your membership application has been received.<br/>We review weekly. You'll hear from us.</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px auto;max-width:120px" />
          <p style="font-size:10px;color:#bbb">slowhrs.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[membership] Unhandled error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
