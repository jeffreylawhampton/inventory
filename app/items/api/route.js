import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const { user } = await getSession();
  const items = await prisma.item.findMany({
    where: {
      user: {
        email: user?.email,
      },
    },
    include: {
      location: true,
      categories: true,
      container: true,
    },
  });

  return Response.json({ items });
}
