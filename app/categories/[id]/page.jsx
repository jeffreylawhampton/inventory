import prisma from "@/app/lib/prisma";
import DeleteCategory from "../DeleteCategory";
import { getSession } from "@auth0/nextjs-auth0";
import { getUser } from "@/app/actions";
import CategoryForm from "../CategoryForm";

const Page = async ({ params: { id } }) => {
  id = parseInt(id);
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  const { user: authUser } = await getSession();
  const user = await getUser(authUser);

  return (
    <div className="text-black">
      <h1>{category?.name}</h1>
      <DeleteCategory id={id} user={user} />
      <CategoryForm category={category} user={user} openLabel="Edit category" />
    </div>
  );
};

export default Page;
