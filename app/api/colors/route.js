import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET() {
  const { user } = await getSession();

  const dbUser = await prisma.user.findUnique({
    where: {
      auth0Id: user.sub,
    },
    select: {
      id: true,
      name: true,
      colors: {
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      },
    },
  });

  return Response.json(dbUser);
}
