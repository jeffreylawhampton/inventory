import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { user } = await getSession();

  const locations = await prisma.location.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      user: {
        email: user.email,
      },
    },
    include: {
      _count: {
        select: {
          items: true,
          containers: true,
        },
      },
      items: {
        where: {
          containerId: null,
        },
        include: {
          images: true,
          categories: true,
        },
      },
      containers: {
        where: {
          parentContainerId: null,
        },
        include: {
          items: {
            include: {
              images: true,
              categories: true,
            },
          },
          containers: {
            include: {
              items: {
                include: {
                  images: true,
                  categories: true,
                },
              },
              containers: {
                include: {
                  items: {
                    include: {
                      images: true,
                      categories: true,
                    },
                  },
                  containers: {
                    include: {
                      items: {
                        include: {
                          images: true,
                          categories: true,
                        },
                      },
                      containers: {
                        include: {
                          items: {
                            include: {
                              images: true,
                              categories: true,
                            },
                          },
                          containers: {
                            include: {
                              items: {
                                include: {
                                  images: true,
                                  categories: true,
                                },
                              },
                              containers: {
                                include: {
                                  items: {
                                    include: {
                                      images: true,
                                      categories: true,
                                    },
                                  },
                                  containers: true,
                                  items: {
                                    include: {
                                      images: true,
                                      categories: true,
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
            },
          },
        },
      },
    },
  });
  return Response.json({ locations });
}

// export async function PUT(req) {
//   const { user } = await getSession();
//   const body = await req.json();
//   let { id, name } = body;
//   id = parseInt(id);

//   try {
//     await prisma.location.update({
//       where: {
//         id,
//         user: {
//           email: user.email,
//         },
//       },
//       data: { name },
//     });
//   } catch (e) {
//     throw new Error(e);
//   }
//   return NextResponse.json({ success: true }, { status: 200 });
// }

// export async function DELETE(req) {
//   const { user } = await getSession();
//   const body = await req.json();
//   let { id } = body;
//   id = parseInt(id);

//   try {
//     await prisma.location.delete({
//       where: {
//         id,
//         user: {
//           email: user.email,
//         },
//       },
//     });
//   } catch (e) {
//     throw new Error(e);
//   }
//   return NextResponse.json({ success: true }, { status: 200 });
// }

// export async function POST(req) {
//   const { user } = await getSession();
//   const body = await req.json();
//   const { name } = body;
//   try {
//     await prisma.location.create({
//       data: {
//         name,
//         user: {
//           connect: {
//             email: user.email,
//           },
//         },
//       },
//     });
//   } catch (e) {
//     throw new Error(e);
//   }
//   return NextResponse.json({ success: true }, { status: 200 });
// }
