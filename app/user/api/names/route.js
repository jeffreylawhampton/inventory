import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { select } from "@nextui-org/react";

export async function POST(req) {
  const { user } = await getSession();

  const body = await req.json();

  let { type, id } = body;

  id = parseInt(id);

  const res = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      [type]: {
        where: {
          id,
        },
        select: {
          name: true,
        },
      },
    },
  });

  return Response.json({ message: "hy" });
}
