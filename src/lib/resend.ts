import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

function getFrom(): string {
  return process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
}

export async function sendApplicationReceipt(to: string, name: string) {
  return resend.emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    subject: 'got your application — slowhrs',
    text: `hi ${name},\n\nwe got your application. reviewing within 7 days.\n\n— slowhrs`,
  });
}

export async function sendDenial(to: string, name: string) {
  return resend.emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    subject: 'slowhrs — application update',
    text: `hi ${name},\n\nthanks for applying. we're not extending an invitation right now. it's not personal — we're keeping the room small.\n\n— slowhrs`,
  });
}

export async function sendInquiryNotification(inquiry: {
  category: string;
  name: string;
  email: string;
  instagram?: string;
  details: string;
}) {
  const to = process.env.INQUIRY_EMAIL_TO || 'hello@slowhrs.com';
  return resend.emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    replyTo: inquiry.email,
    subject: `new ${inquiry.category} inquiry — ${inquiry.name}`,
    text: `category: ${inquiry.category}\nname: ${inquiry.name}\nemail: ${inquiry.email}\ninstagram: ${inquiry.instagram ?? '—'}\n\ndetails:\n${inquiry.details}`,
  });
}

export async function sendBroadcast(to: string[], subject: string, body: string) {
  const chunks = chunk(to, 100);
  let total = 0;
  for (const c of chunks) {
    await resend.batch.send(
      c.map((addr) => ({
        from: `SLOWHRS <${getFrom()}>`,
        to: addr,
        subject,
        text: body,
      }))
    );
    total += c.length;
  }
  return total;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
