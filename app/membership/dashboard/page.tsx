import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTier, nextTier } from "@/lib/membership";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SLOWHRS | dashboard",
  description: "your membership.",
};

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membership");
  }

  // Fetch member data with admin client
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    redirect("/membership");
  }

  const tier = getTier(member);
  const next = nextTier(tier, member.hearts, member.is_contributor);
  const firstName = member.full_name.split(" ")[0].toLowerCase();
  const memberNum = String(member.member_number).padStart(5, "0");

  // Fetch upcoming events
  const { data: events } = await admin
    .from("events")
    .select("*")
    .eq("is_public", true)
    .eq("is_upcoming", true)
    .order("date", { ascending: true })
    .limit(3);

  // Fetch broadcasts for this tier
  const { data: broadcasts } = await admin
    .from("broadcasts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className="min-h-screen bg-bg pt-[52px]">
      <div className="max-w-[640px] mx-auto px-6 pt-20 md:pt-28 pb-24">
        {/* Welcome */}
        <h1
          className="font-display italic text-ink"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
        >
          welcome back, {firstName}.
        </h1>
        <p className="font-mono text-[10px] tracking-[0.2em] text-ink-dim uppercase mt-3">
          {tier.display} · sh-{memberNum}
        </p>

        {/* Member card */}
        <div
          className="mt-12 relative overflow-hidden p-8 md:p-10"
          style={{
            aspectRatio: "1.6 / 1",
            background: "linear-gradient(135deg, #0c0c0c, #1a0608)",
            border: "1px solid var(--color-red)",
            animation: "cardBreathe 4s ease-in-out infinite",
          }}
        >
          {/* Bottom accent */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-rose), transparent)",
            }}
          />

          {/* Logo */}
          <img
            src="/assets/logos/logo_main.png"
            alt=""
            className="w-[80px] opacity-60"
            aria-hidden="true"
          />

          {/* Tier + number */}
          <div className="absolute bottom-8 left-8 md:left-10">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-dim">
              {tier.display}
            </p>
            <p
              className="font-display italic text-ink mt-1"
              style={{ fontSize: "1.5rem" }}
            >
              SH-{memberNum}
            </p>
          </div>

          {/* Meta — bottom-right */}
          <div className="absolute bottom-8 right-8 md:right-10 text-right">
            <p className="font-mono text-[9px] tracking-[0.2em] text-ink-dim uppercase">
              tier {String(tier.number).padStart(2, "0")}
            </p>
            <p className="font-mono text-[9px] tracking-[0.2em] text-ink-dim uppercase mt-1">
              los angeles
            </p>
            <p className="font-mono text-[14px] tracking-[0.1em] text-ink-dim mt-2">
              {tier.meter}
            </p>
          </div>
        </div>

        {/* Next tier */}
        {next && (
          <p className="font-serif italic text-ink-dim text-sm mt-6 text-center">
            next tier: {next.name}
            {next.heartsToGo > 0 &&
              ` — ${next.heartsToGo} more event${next.heartsToGo > 1 ? "s" : ""} to unlock`}
            {next.note && ` (${next.note})`}
          </p>
        )}
        {!next && (
          <p className="font-serif italic text-ink-dim text-sm mt-6 text-center">
            you&apos;re at the top of the ladder.
          </p>
        )}

        {/* Upcoming events */}
        {events && events.length > 0 && (
          <div className="mt-16">
            <h2 className="font-mono text-[10px] tracking-[0.3em] text-ink-faint uppercase mb-6">
              upcoming events
            </h2>
            <div className="flex flex-col gap-4">
              {events.map((ev: { id: string; name: string; date: string; location: string | null; partiful_url: string | null }) => (
                <div
                  key={ev.id}
                  className="border border-border py-4 px-5 flex justify-between items-center"
                >
                  <div>
                    <p className="font-serif italic text-ink">{ev.name}</p>
                    <p className="font-mono text-[9px] tracking-[0.15em] text-ink-dim uppercase mt-1">
                      {new Date(ev.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        timeZone: "America/Los_Angeles",
                      })}{" "}
                      · {ev.location}
                    </p>
                  </div>
                  {ev.partiful_url && (
                    <a
                      href={ev.partiful_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] tracking-[0.15em] text-red uppercase shrink-0"
                    >
                      rsvp ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Broadcasts */}
        {broadcasts && broadcasts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-mono text-[10px] tracking-[0.3em] text-ink-faint uppercase mb-6">
              broadcasts
            </h2>
            <div className="flex flex-col gap-4">
              {broadcasts.map((b: { id: string; subject: string; body: string; sent_at: string | null }) => (
                <div key={b.id} className="border-b border-border pb-4">
                  <p className="font-serif italic text-ink">{b.subject}</p>
                  <p className="font-mono text-[11px] text-ink-dim mt-2 whitespace-pre-wrap leading-relaxed">
                    {b.body.slice(0, 200)}
                    {b.body.length > 200 ? "..." : ""}
                  </p>
                  {b.sent_at && (
                    <span className="font-mono text-[9px] text-ink-faint mt-2 block">
                      {new Date(b.sent_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign out */}
        <form
          action={async () => {
            "use server";
            const supabase = await createServerClient();
            await supabase.auth.signOut();
            redirect("/membership");
          }}
          className="mt-16 text-right"
        >
          <button
            type="submit"
            className="font-mono text-[10px] tracking-[0.2em] text-ink-faint uppercase hover:text-red transition-colors"
          >
            sign out ↗
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}
