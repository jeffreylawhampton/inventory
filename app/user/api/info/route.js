import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();

  const dbUser = await prisma.user.findUnique({
    where: {
      auth0Id: user.sub,
    },
    select: {
      id: true,
      name: true,
      auth0Id: true,
      image: true,
    },
  });
  return Response.json(dbUser);
}
