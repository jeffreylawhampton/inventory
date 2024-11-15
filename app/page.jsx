import { upsertUser } from "./actions";
import { getSession } from "@auth0/nextjs-auth0";
import HomePage from "./homepage";

export default async function Page() {
  const { user } = await getSession();
  upsertUser(user);

  return (
    <>
      {user ? (
        `Welcome ${user.given_name}`
      ) : (
        <a href="/api/auth/login">Log in</a>
      )}
      <HomePage />
    </>
  );
}
