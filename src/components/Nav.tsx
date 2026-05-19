import { getMember } from "@/lib/auth/member";
import NavClient from "@/components/NavClient";

export default async function Nav() {
  const member = await getMember();
  return (
    <NavClient
      memberHref={member ? "/dashboard" : "/sign-in"}
      memberLabel={member ? "the room" : "sign in"}
    />
  );
}
