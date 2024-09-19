"use server";
import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export const createColor = async ({ hex, userId }) => {
  userId = parseInt(userId);
  return await prisma.color.create({
    data: {
      userId,
      hex: hex,
    },
  });
};

export const deleteColor = async ({ id }) => {
  id = parseInt(id);
  const { user } = await getSession();
  return await prisma.color.delete({
    where: {
      user: {
        email: user.email,
      },
      id,
    },
  });
};
