import { getUser } from "@/app/actions";
import Link from "next/link";
import prisma from "../lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import ItemForm from "./ItemForm";

const Page = async () => {
  const { user: authUser } = await getSession();
  const user = await getUser(authUser);

  const items = await prisma.item.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      location: true,
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div>
      Items
      <ul>
        {items?.map((item) => {
          return (
            <li key={item.id}>
              <Link href={`items/${item.id}`} className="block py-5">
                {item.name} | {item.location?.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <ItemForm
        user={user}
        categories={categories}
        openLabel="Create new item"
      />
    </div>
  );
};

export default Page;
