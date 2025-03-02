"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";

export const addFaves = async ({ type, list }) => {
  const { user } = await getSession();
  await prisma[type].updateMany({
    where: {
      user: {
        email: user.email,
      },
      id: { in: list },
    },
    data: {
      favorite: true,
    },
  });
};

export async function deleteMany({ type, list }) {
  const { user } = await getSession();
  await prisma[type].deleteMany({
    where: {
      user: {
        email: user.email,
      },
      id: {
        in: list,
      },
    },
  });
  revalidatePath("/");
}

export const removeFavorite = async ({ type, id }) => {
  const { user } = await getSession();
  return await prisma[type].update({
    where: {
      user: {
        email: user.email,
      },
      id: parseInt(id),
    },
    data: {
      favorite: false,
    },
  });
};
