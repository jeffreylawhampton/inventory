import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();

  const locations = await prisma.location.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    select: {
      id: true,
      name: true,
      userId: true,
      _count: {
        select: {
          items: true,
          containers: true,
        },
      },
    },
  });
  return Response.json({ locations });
}
