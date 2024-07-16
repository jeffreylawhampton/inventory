import { getUser } from "@/app/actions";
import Link from "next/link";
import prisma from "../lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import CategoryForm from "./CategoryForm";

const Page = async () => {
  const { user: authUser } = await getSession();
  const user = await getUser(authUser);

  const categories = await prisma.category.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      items: true,
    },
  });

  return (
    <>
      <h1 className="font-bold text-3xl">Categories</h1>
      <ul>
        {categories?.map((category) => {
          return (
            <li key={category.id}>
              <Link href={`categories/${category.id}`} className="block py-5">
                {category.name}
                <div>Items</div>
                <ul>
                  {category.items?.map((item) => {
                    return <li key={item.name}>{item.name}</li>;
                  })}
                </ul>
              </Link>
            </li>
          );
        })}
      </ul>
      <CategoryForm
        user={user}
        categories={categories}
        openLabel="Create new category"
      />
    </>
  );
};

export default Page;
