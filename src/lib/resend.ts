import { Resend } from 'resend';

type ResendEmailPayload = Parameters<Resend['emails']['send']>[0];
type ResendBatchPayload = Parameters<Resend['batch']['send']>[0];
type ResendErrorLike = {
  name?: string;
  message?: string;
  statusCode?: number;
};

type MockResend = {
  emails: {
    send: (payload: ResendEmailPayload) => Promise<{ data: { id: string }; error: null }>;
  };
  batch: {
    send: (payload: ResendBatchPayload) => Promise<{ data: { id: string }; error: null }>;
  };
};

let resendInstance: Resend | MockResend | null = null;

function getResend() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY?.trim();

    if (!apiKey) {
      if (isProductionRuntime()) {
        throw new Error('[resend] RESEND_API_KEY is required in production');
      }

      console.warn('[resend] RESEND_API_KEY not set; using local mock email client');
      resendInstance = {
        emails: {
          send: async (payload: ResendEmailPayload) => {
            console.log('[resend mock] Email intercepted (no API key):', payload);
            return { data: { id: 'mock_id' }, error: null };
          }
        },
        batch: {
          send: async (payload: ResendBatchPayload) => {
            console.log('[resend mock] Batch emails intercepted (no API key):', payload);
            return { data: { id: 'mock_batch_id' }, error: null };
          }
        }
      };
    } else {
      resendInstance = new Resend(apiKey);
    }
  }
  return resendInstance;
}

function getFrom(): string {
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!from) {
    if (isProductionRuntime()) {
      throw new Error('[resend] RESEND_FROM_EMAIL is required in production');
    }

    return 'onboarding@resend.dev';
  }

  if (isProductionRuntime() && /@resend\.dev$/i.test(from)) {
    throw new Error('[resend] RESEND_FROM_EMAIL must use a verified sending domain in production');
  }

  return from;
}

function getOwnerEmail(): string {
  const ownerEmail = process.env.INQUIRY_EMAIL_TO?.trim();

  if (!ownerEmail) {
    if (isProductionRuntime()) {
      throw new Error('[resend] INQUIRY_EMAIL_TO is required in production');
    }

    return 'hello@slowhrs.com';
  }

  return ownerEmail;
}

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

function summarizeResendError(error: unknown): ResendErrorLike {
  if (!error || typeof error !== 'object') return { message: String(error) };

  const err = error as ResendErrorLike;
  return {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
  };
}

async function sendEmail(payload: ResendEmailPayload, context: string) {
  const result = await getResend().emails.send(payload);

  if (result.error) {
    const summary = summarizeResendError(result.error);
    console.error(`[resend] ${context} failed:`, summary);
    throw new Error(`[resend] ${context} failed: ${summary.message ?? 'unknown Resend error'}`);
  }

  console.log(`[resend] ${context} accepted:`, { id: result.data?.id });
  return result;
}

async function sendBatch(payload: ResendBatchPayload, context: string) {
  const result = await getResend().batch.send(payload);

  if (result.error) {
    const summary = summarizeResendError(result.error);
    console.error(`[resend] ${context} failed:`, summary);
    throw new Error(`[resend] ${context} failed: ${summary.message ?? 'unknown Resend error'}`);
  }

  console.log(`[resend] ${context} accepted`);
  return result;
}

function getSiteOrigin(): string {
  const configuredOrigin = normalizeProductionOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (configuredOrigin) return configuredOrigin;

  return 'https://slowhrs.com';
}

function normalizeProductionOrigin(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

export async function sendApplicationReceipt(to: string, name: string) {
  return sendEmail({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    subject: 'got your application — slowhrs',
    text: `hi ${name},\n\nwe got your application. reviewing within 7 days.\n\n— slowhrs`,
  }, 'application receipt');
}

export async function sendApplicationNotification(application: {
  full_name: string;
  email: string;
  instagram?: string | null;
  city?: string | null;
  what_you_do?: string | null;
  why_apply: string;
}) {
  return sendEmail({
    from: `SLOWHRS <${getFrom()}>`,
    to: getOwnerEmail(),
    replyTo: application.email,
    subject: `new application — ${application.full_name}`,
    text: `name: ${application.full_name}\nemail: ${application.email}\ninstagram: ${application.instagram ?? '—'}\ncity: ${application.city ?? '—'}\nwhat they do: ${application.what_you_do ?? '—'}\n\nwhy they're applying:\n${application.why_apply}`,
  }, 'application notification');
}

export async function sendApprovalEmail(to: string, name: string) {
  const signInUrl = new URL('/sign-in', getSiteOrigin());
  signInUrl.searchParams.set('email', to.toLowerCase().trim());
  signInUrl.searchParams.set('next', '/dashboard');
  const escapedName = escapeHtml(name);
  const escapedSignInUrl = escapeHtml(signInUrl.toString());

  return sendEmail({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    subject: 'welcome to slowhrs',
    html: `
      <div style="background:#050505;color:#ededeb;font-family:Arial,sans-serif;padding:28px;line-height:1.6">
        <p style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#e60016">slowhrs approval</p>
        <h1 style="font-family:Georgia,serif;font-style:italic;font-weight:400;margin:18px 0 10px">welcome, ${escapedName}.</h1>
        <p>your application has been approved. tap below, confirm this email, then open the magic link we send you.</p>
        <p style="margin:28px 0">
          <a href="${escapedSignInUrl}" style="border:1px solid #e60016;color:#e60016;padding:12px 18px;text-decoration:none;text-transform:uppercase;font-size:11px;letter-spacing:0.18em">enter the room</a>
        </p>
        <p style="font-size:12px;color:#9b9b97">if the button does not open, paste this link:<br><a href="${escapedSignInUrl}" style="color:#e60016">${escapedSignInUrl}</a></p>
        <p style="font-size:12px;color:#9b9b97">— slowhrs</p>
      </div>
    `,
    text: `hi ${name},\n\nyour application has been approved. welcome.\n\nenter here:\n${signInUrl.toString()}\n\nthat page sends your one-time magic login link to this email.\n\n— slowhrs`,
  }, 'approval email');
}

export async function sendRejectionEmail(to: string, name: string) {
  return sendEmail({
    from: `SLOWHRS <${getFrom()}>`,
    to,
    subject: 'slowhrs — application update',
    text: `hi ${name},\n\nthanks for applying. we're not extending an invitation right now. it's not personal — we're keeping the room small.\n\n— slowhrs`,
  }, 'rejection email');
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
  return sendEmail({
    from: `SLOWHRS <${getFrom()}>`,
    to: getOwnerEmail(),
    replyTo: inquiry.email,
    subject: `new ${inquiry.category} inquiry — ${inquiry.name}`,
    text: `category: ${inquiry.category}\nname: ${inquiry.name}\nemail: ${inquiry.email}\ninstagram: ${inquiry.instagram ?? '—'}\n\ndetails:\n${inquiry.details}`,
  }, 'inquiry notification');
}

export async function sendOrderNotification(order: {
  productTitle: string;
  size: string;
  customerEmail: string;
  amount: string;
}) {
  return sendEmail({
    from: `SLOWHRS <${getFrom()}>`,
    to: getOwnerEmail(),
    subject: `order placed — ${order.productTitle} (${order.size})`,
    text: `product: ${order.productTitle}\nsize: ${order.size}\ncustomer: ${order.customerEmail}\namount: ${order.amount}\n\nship it.`,
  }, 'order notification');
}

export async function sendOrderPaymentLinkEmail(order: {
  to: string;
  name: string;
  productTitle: string;
  size: string;
  checkoutUrl: string;
}) {
  return sendEmail({
    from: `SLOWHRS <${getFrom()}>`,
    to: order.to,
    subject: `payment link — ${order.productTitle}`,
    text: `hi ${order.name},\n\napproved. secure your ${order.productTitle} (${order.size}) here:\n${order.checkoutUrl}\n\nlink expires when checkout expires.\n\n— slowhrs`,
  }, 'order payment link');
}

export async function sendBroadcast(to: string[], subject: string, body: string) {
  const chunks = chunk(to, 100);
  let total = 0;
  for (const c of chunks) {
    await sendBatch(
      c.map((addr) => ({
        from: `SLOWHRS <${getFrom()}>`,
        to: addr,
        subject,
        text: body,
      })),
      'broadcast batch'
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
