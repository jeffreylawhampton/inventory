import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/app/lib/prisma";
import { sortObjectArray } from "@/app/lib/helpers";

export async function GET(req) {
  const { user } = await getSession();
  const params = new URL(req.url).searchParams;
  const type = params.get("type");
  const favorite = params.get("favorite") === "true";

  const include =
    type === "items"
      ? {
          container: true,
          location: true,
          categories: { include: { color: true } },
        }
      : type === "containers"
      ? { color: true }
      : { color: true, _count: { select: { items: true } } };

  const results = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      [type]: {
        where: {
          favorite,
        },
        include,
      },
    },
  });

  return Response.json(sortObjectArray(results[type]));
}
