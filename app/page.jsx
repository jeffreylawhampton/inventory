import { createUser } from "./actions";
import { getSession } from "@auth0/nextjs-auth0";
import HomePage from "./homepage";
import prisma from "./lib/prisma";

export default async function Page() {
  const { user } = await getSession();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!existingUser) {
    await createUser(user);
  }

  return <HomePage />;
}
