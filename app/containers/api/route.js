import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();

  const containers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
  });
  return Response.json({ containers });
}
