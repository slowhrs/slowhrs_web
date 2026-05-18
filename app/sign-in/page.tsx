import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth/member";
import SignInForm from "./SignInForm";

type SignInSearchParams = {
  email?: string;
  next?: string;
  stale?: string;
};

function safeInitialNext(value: string | undefined): string {
  if (!value) return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";

  try {
    const url = new URL(value, "https://slowhrs.com");
    const path = `${url.pathname}${url.search}${url.hash}`;
    if (url.pathname === "/" || url.pathname === "/events") return path;
    if (url.pathname === "/dashboard" || url.pathname.startsWith("/dashboard/")) return path;
  } catch {
    return "/dashboard";
  }

  return "/dashboard";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<SignInSearchParams>;
}) {
  const member = await getMember();
  if (member) redirect("/dashboard");

  const params = await searchParams;

  return (
    <SignInForm
      initialEmail={params.email ?? ""}
      nextPath={safeInitialNext(params.next)}
      showStaleBanner={params.stale === "1"}
    />
  );
}
