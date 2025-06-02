"use server";
import prisma from "./lib/prisma";
import seedingDefaults from "./lib/seedValues";

export async function createUser({ email, name }) {
  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        locations: {
          create: seedingDefaults.locations.map((location) => {
            return {
              name: location,
            };
          }),
        },
        categories: {
          create: seedingDefaults.categories.map((category) => {
            return {
              name: category.name,
              favorite: category.favorite,
              color: {
                create: {
                  hex: category.color,
                  user: {
                    connect: {
                      email,
                    },
                  },
                },
              },
            };
          }),
        },
        containers: {
          create: seedingDefaults.containers.map((container) => {
            return {
              name: container.name,
              favorite: container.favorite,
              color: {
                create: {
                  hex: container.color,
                  user: {
                    connect: {
                      email,
                    },
                  },
                },
              },
            };
          }),
        },
        items: {
          create: seedingDefaults.items.map((item) => {
            return {
              name: item.name,
              favorite: item.favorite,
              description: item.description,
              quantity: item.quantity,
              categories: {
                create: {
                  name: item.categories.name,
                  color: {
                    create: {
                      hex: item.categories.color,
                      user: {
                        connect: {
                          email,
                        },
                      },
                    },
                  },
                  user: { connect: { email } },
                },
              },
              images: {
                create: {
                  url: item.images.secureUrl,
                  secureUrl: item.images.secureUrl,
                  width: item.images.width,
                  height: item.images.height,
                },
              },
            };
          }),
        },
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function upsertUser({ id, name, email }) {
  id = id ? parseInt(id) : 0;
  try {
    return await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name,
        email,
      },
      create: {
        name,
        email,
        colors: {
          create: seedingDefaults.colors?.map((color) => {
            return {
              hex: color,
            };
          }),
        },
        locations: {
          create: seedingDefaults.locations?.map((location) => {
            return {
              name: location,
            };
          }),
        },
        categories: {
          create: seedingDefaults.categories?.map((category) => {
            return {
              name: category.name,
              color: {
                hex: category.color,
              },
              favorite: true,
            };
          }),
        },
      },
    });
  } catch (e) {
    throw e;
  }
}
