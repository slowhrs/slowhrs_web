import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, ...fields } = body;

    if (!category || !fields.email) {
      return NextResponse.json(
        { error: "Category and email are required." },
        { status: 400 }
      );
    }

    // ── Store in Supabase ──────────────────────────────────
    const supabase = createServerClient();
    const { error: dbError } = await supabase.from("inquiries").insert({
      category,
      data: fields,
      email: fields.email,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("[inquiry] Supabase insert error:", dbError);
      // Continue to send email even if DB fails
    }

    // ── Send notification email via Resend ─────────────────
    const notificationEmail = process.env.NOTIFICATION_EMAIL || "hello@slowhrs.com";

    const fieldRows = Object.entries(fields)
      .map(([key, val]) => `<tr><td style="padding:6px 12px;font-weight:600;text-transform:uppercase;font-size:11px;color:#888;vertical-align:top">${key}</td><td style="padding:6px 12px">${val}</td></tr>`)
      .join("");

    await resend.emails.send({
      from: "SLOWHRS <onboarding@resend.dev>",
      to: notificationEmail,
      subject: `New Inquiry — ${category}`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 0">
          <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#888;margin-bottom:24px">SLOWHRS — Inquiry Received</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1a1a1a">
            <tr><td style="padding:6px 12px;font-weight:600;text-transform:uppercase;font-size:11px;color:#888">CATEGORY</td><td style="padding:6px 12px">${category}</td></tr>
            ${fieldRows}
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0" />
          <p style="font-size:10px;color:#bbb">Sent via SLOWHRS inquiry form</p>
        </div>
      `,
    });

    // ── Send confirmation to submitter ─────────────────────
    await resend.emails.send({
      from: "SLOWHRS <onboarding@resend.dev>",
      to: fields.email,
      subject: "received. we'll be in touch.",
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px 0;text-align:center">
          <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin-bottom:20px">SLOWHRS</p>
          <p style="font-size:16px;color:#1a1a1a;line-height:1.5">Your <strong>${category}</strong> inquiry has been received.<br/>We review everything. Expect a response soon.</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:28px auto;max-width:120px" />
          <p style="font-size:10px;color:#bbb">slowhrs.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[inquiry] Unhandled error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
