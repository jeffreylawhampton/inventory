import { upsertUser } from "./actions";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getUser } from "./actions";

export default withPageAuthRequired(async function Page() {
  const { user } = await getSession();
  upsertUser(user);

  return (
    <>{user ? `Welcome ${user.name}` : <a href="/api/auth/login">Log in</a>}</>
  );
});
