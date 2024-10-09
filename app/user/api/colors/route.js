import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { sortBy } from "lodash";

export async function GET() {
  const {
    user: { email },
  } = await getSession();

  const user = await prisma.user.findUnique({
    where: {
      email,
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

  return Response.json(user);
}
