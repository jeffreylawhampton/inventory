import { createUser } from "./actions";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "./lib/prisma";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getSession();

  const existingUser = await prisma.user.findUnique({
    where: {
      auth0Id: user.sub,
    },
  });

  if (!existingUser) {
    await createUser({ name: user.name, email: user.email, auth0Id: user.sub });
  }

  return redirect("/locations");
}
