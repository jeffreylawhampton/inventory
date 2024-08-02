import prisma from "../lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function getUserData(selectors) {
  const { user } = await getSession();
  const selectorMap = selectors.map((selector) => `${selector}: true`);
  return await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: selectorMap,
  });
}
