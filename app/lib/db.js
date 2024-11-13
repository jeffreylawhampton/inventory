"use server";
import prisma from "./prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function toggleFavorite({ type, id, add }) {
  id = parseInt(id);
  const { user } = await getSession();
  await prisma[type].update({
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
}
