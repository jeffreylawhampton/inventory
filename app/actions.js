"use server";
import prisma from "./lib/prisma";

export async function upsertUser({ id, name, email }) {
  id = id ? parseInt(id) : 0;
  try {
    return await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
        email,
      },
      create: {
        name,
        email,
      },
    });
  } catch (e) {
    throw e;
  }
}
