import prisma from "@/app/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET() {
  const {
    user: { email },
  } = await getSession();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      items: {
        where: {
          favorite: true,
        },
        include: {
          images: true,
          categories: {
            include: {
              color: true,
            },
          },
          container: {
            select: {
              name: true,
              id: true,
              color: {
                select: {
                  id: true,
                  hex: true,
                },
              },
              parentContainer: {
                select: {
                  id: true,
                  name: true,
                  parentContainer: {
                    select: {
                      id: true,
                      name: true,
                      parentContainer: {
                        select: {
                          id: true,
                          name: true,
                          parentContainer: {
                            select: {
                              id: true,
                              name: true,
                              parentContainer: {
                                select: {
                                  id: true,
                                  name: true,
                                  parentContainer: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          location: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  return Response.json(user);
}
