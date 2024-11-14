"use server";
import prisma from "./prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function toggleFavorite({ type, id, add }) {
  const { user } = await getSession();
  const updated = await prisma[type].update({
    where: {
      user: {
        email: user.email,
      },
      id,
    },
    data: {
      favorite: add,
    },
  });

  return updated ? true : false;
}
