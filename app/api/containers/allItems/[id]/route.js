import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";

export async function GET(request, { params: { id } }) {
  const { user } = await getSession();

  id = parseInt(id);
  const items = await prisma.item.findMany({
    where: {
      user: {
        email: user.email,
      },
      OR: [
        { containerId: id },

        { container: { parentContainer: { id } } },
        { container: { parentContainer: { parentContainer: { id } } } },
        {
          container: {
            parentContainer: { parentContainer: { parentContainer: { id } } },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: { parentContainer: { parentContainer: { id } } },
            },
          },
        },
        {
          container: {
            parentContainer: {
              parentContainer: {
                parentContainer: {
                  parentContainer: { parentContainer: { id } },
                },
              },
            },
          },
        },
        {
          container: {
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
        },
      ],
    },
    include: {
      images: true,
      container: true,
      location: true,
      categories: {
        include: {
          color: true,
        },
      },
    },
  });
  return Response.json({ items });
}
