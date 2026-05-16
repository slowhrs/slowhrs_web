import { Resend } from 'resend';

let resendInstance: any = null;

function getResend() {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[resend] RESEND_API_KEY not set — emails will fail silently');
      resendInstance = {
        emails: {
          send: async (payload: any) => {
            console.log('[resend mock] Email intercepted (no API key):', payload);
            return { data: { id: 'mock_id' }, error: null };
          }
        },
        batch: {
          send: async (payload: any) => {
            console.log('[resend mock] Batch emails intercepted (no API key):', payload);
            return { data: { id: 'mock_batch_id' }, error: null };
          }
        }
      };
    } else {
      resendInstance = new Resend(process.env.RESEND_API_KEY);
    }
  }
  return resendInstance;
}

function getFrom(): string {
  return process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
}

function getOwnerEmail(): string {
  return process.env.INQUIRY_EMAIL_TO || 'hello@slowhrs.com';
}

export async function sendApplicationReceipt(to: string, name: string) {
  return getResend().emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    subject: 'got your application — slowhrs',
    text: `hi ${name},\n\nwe got your application. reviewing within 7 days.\n\n— slowhrs`,
  });
}

export async function sendApplicationNotification(application: {
  full_name: string;
  email: string;
  instagram?: string | null;
  city?: string | null;
  what_you_do?: string | null;
  why_apply: string;
}) {
  return getResend().emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to: getOwnerEmail(),
    replyTo: application.email,
    subject: `new application — ${application.full_name}`,
    text: `name: ${application.full_name}\nemail: ${application.email}\ninstagram: ${application.instagram ?? '—'}\ncity: ${application.city ?? '—'}\nwhat they do: ${application.what_you_do ?? '—'}\n\nwhy they're applying:\n${application.why_apply}`,
  });
}

export async function sendApprovalEmail(to: string, name: string) {
  return getResend().emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    subject: 'welcome to slowhrs',
    text: `hi ${name},\n\nyour application has been approved. welcome.\n\n— slowhrs`,
  });
}

export async function sendRejectionEmail(to: string, name: string) {
  return getResend().emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    subject: 'slowhrs — application update',
    text: `hi ${name},\n\nthanks for applying. we're not extending an invitation right now. it's not personal — we're keeping the room small.\n\n— slowhrs`,
  });
}

export async function sendDenial(to: string, name: string) {
  return sendRejectionEmail(to, name);
}

export async function sendInquiryNotification(inquiry: {
  category: string;
  name: string;
  email: string;
  instagram?: string;
  details: string;
}) {
  return getResend().emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to: getOwnerEmail(),
    replyTo: inquiry.email,
    subject: `new ${inquiry.category} inquiry — ${inquiry.name}`,
    text: `category: ${inquiry.category}\nname: ${inquiry.name}\nemail: ${inquiry.email}\ninstagram: ${inquiry.instagram ?? '—'}\n\ndetails:\n${inquiry.details}`,
  });
}

export async function sendOrderNotification(order: {
  productTitle: string;
  size: string;
  customerEmail: string;
  amount: string;
}) {
  return getResend().emails.send({
    from: `SLOWHRS <${getFrom()}>`,
    to: getOwnerEmail(),
    subject: `order placed — ${order.productTitle} (${order.size})`,
    text: `product: ${order.productTitle}\nsize: ${order.size}\ncustomer: ${order.customerEmail}\namount: ${order.amount}\n\nship it.`,
  });
}

export async function sendBroadcast(to: string[], subject: string, body: string) {
  const resend = getResend();
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
