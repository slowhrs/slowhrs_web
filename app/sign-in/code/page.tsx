import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth/member";
import CodeForm from "./CodeForm";

type CodeSearchParams = {
  email?: string;
  next?: string;
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

export const dynamic = "force-dynamic";

export default async function SignInCodePage({
  searchParams,
}: {
  searchParams: Promise<CodeSearchParams>;
}) {
  const member = await getMember();
  if (member) redirect("/dashboard");

  const params = await searchParams;

  return (
    <CodeForm
      initialEmail={(params.email ?? "").toLowerCase().trim()}
      nextPath={safeInitialNext(params.next)}
    />
  );
}
