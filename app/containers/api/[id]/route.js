import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();
  id = parseInt(id);
  const container = await prisma.container.findFirst({
    where: {
      id,
      user: {
        email: user.email,
      },
    },
    include: {
      items: true,
      containers: true,
    },
  });
  return Response.json({ container });
}
