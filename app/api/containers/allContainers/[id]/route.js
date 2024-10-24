import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();

  id = parseInt(id);
  const containers = await prisma.container.findMany({
    where: {
      user: {
        email: user.email,
      },
      OR: [
        { parentContainer: { id } },
        { parentContainer: { parentContainer: { id } } },
        { parentContainer: { parentContainer: { parentContainer: { id } } } },
        {
          parentContainer: {
            parentContainer: { parentContainer: { parentContainer: { id } } },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: { parentContainer: { parentContainer: { id } } },
            },
          },
        },
        {
          parentContainer: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainer: { id } },
                },
              },
            },
          },
        },
      ],
    },
    include: {
      location: true,
      color: true,

      items: {
        include: {
          categories: {
            include: {
              color: true,
            },
          },
        },
      },
    },
  });

  return Response.json({ containers });
}
