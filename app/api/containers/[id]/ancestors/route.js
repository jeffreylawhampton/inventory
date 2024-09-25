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
        { id },
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
    select: {
      color: true,
      name: true,
      id: true,
      parentContainer: true,
      location: true,
    },
  });
  return Response.json({ containers });
}
