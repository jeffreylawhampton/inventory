import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  id = parseInt(id);
  const { user } = await getSession();
  id = parseInt(id);

  const location = await prisma.location.findFirst({
    where: {
      id,
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
          user: {
            email: user.email,
          },
        },
        include: {
          images: true,
          categories: {
            include: {
              color: true,
            },
          },
          container: true,
        },
      },
      containers: {
        where: {
          user: {
            email: user.email,
          },
        },
        include: {
          color: true,
          items: {
            where: {
              user: {
                email: user.email,
              },
            },
            include: {
              container: true,
              images: true,
              categories: {
                include: {
                  color: true,
                },
              },
            },
          },
          containers: {
            where: {
              user: {
                email: user.email,
              },
            },
            include: {
              color: true,
              items: {
                where: {
                  user: {
                    email: user.email,
                  },
                },
                include: {
                  container: true,
                  categories: {
                    include: {
                      color: true,
                    },
                  },
                },
              },
              containers: {
                where: {
                  user: {
                    email: user.email,
                  },
                },
                include: {
                  color: true,
                  items: {
                    where: {
                      user: {
                        email: user.email,
                      },
                    },
                    include: {
                      container: true,
                      categories: {
                        include: {
                          color: true,
                        },
                      },
                      images: true,
                    },
                  },
                  containers: {
                    where: {
                      user: {
                        email: user.email,
                      },
                    },
                    include: {
                      color: true,
                      items: {
                        where: {
                          user: {
                            email: user.email,
                          },
                        },
                        include: {
                          container: true,
                          categories: {
                            include: {
                              color: true,
                            },
                          },
                          images: true,
                        },
                      },
                      containers: {
                        where: {
                          user: {
                            email: user.email,
                          },
                        },
                        include: {
                          color: true,
                          items: {
                            where: {
                              user: {
                                email: user.email,
                              },
                            },
                            include: {
                              container: true,
                              categories: {
                                include: {
                                  color: true,
                                },
                              },
                              images: true,
                            },
                          },
                          containers: {
                            where: {
                              user: {
                                email: user.email,
                              },
                            },
                            include: {
                              color: true,
                              items: {
                                where: {
                                  user: {
                                    email: user.email,
                                  },
                                },
                                include: {
                                  container: true,
                                  images: true,
                                  categories: {
                                    include: {
                                      color: true,
                                    },
                                  },
                                },
                              },
                              containers: {
                                where: {
                                  user: {
                                    email: user.email,
                                  },
                                },
                                include: {
                                  color: true,
                                  items: {
                                    where: {
                                      user: {
                                        email: user.email,
                                      },
                                    },
                                    include: {
                                      container: true,
                                    },
                                  },
                                  containers: {
                                    where: {
                                      user: {
                                        email: user.email,
                                      },
                                    },
                                    include: {
                                      items: {
                                        where: {
                                          user: {
                                            email: user.email,
                                          },
                                        },
                                        include: {
                                          categories: {
                                            include: {
                                              color: true,
                                            },
                                          },
                                          images: true,
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
      },
    },
  });
  return Response.json({ location });
}

export async function DELETE(req) {
  const { user } = await getSession();
  const body = await req.json();
  let { id } = body;
  id = parseInt(id);

  try {
    await prisma.location.delete({
      where: {
        id,
        user: {
          email: user.email,
        },
      },
    });
  } catch (e) {
    throw new Error(e);
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
