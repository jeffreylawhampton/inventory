"use server";
import prisma from "./lib/prisma";
import seedingDefaults from "./lib/seedValues";

export async function createUser({ email, name, auth0Id }) {
  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        auth0Id,
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
                      auth0Id,
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
                      auth0Id,
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
                          auth0Id,
                        },
                      },
                    },
                  },
                  user: { connect: { auth0Id } },
                },
              },
              images: {
                create: {
                  url: item.images.secureUrl,
                  secureUrl: item.images.secureUrl,
                  width: item.images.width,
                  height: item.images.height,
                  user: {
                    connect: {
                      auth0Id,
                    },
                  },
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

export async function updateAuth0User({
  auth0Id,
  email,
  password,
  name,
  picture,
}) {
  if (!auth0Id || (!email && !password && !name && !picture)) {
    throw new Error("Missing user ID or update fields");
  }

  if (auth0Id?.includes("google")) {
    try {
      await prisma.user.update({
        where: {
          auth0Id,
        },
        data: {
          image: picture,
        },
      });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  const tokenRes = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
      }),
    }
  );

  if (!tokenRes.ok) {
    throw new Error("Failed to obtain Auth0 access token");
  }

  const { access_token } = await tokenRes.json();

  const updateRes = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${auth0Id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(email && { email }),
        ...(password && { password }),
        ...(name && { name }),
        ...(picture && { picture }),
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json();
    throw new Error(err.message || "Failed to update user");
  }

  return await updateRes.json();
}
