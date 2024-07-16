import prisma from "@/app/lib/prisma";
import DeleteCategory from "../DeleteCategory";
import { getUser } from "@/app/actions";
import { getSession } from "@auth0/nextjs-auth0";
import CategoryForm from "../CategoryForm";

const Page = async ({ params: { id } }) => {
  id = parseInt(id);
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  const { user: authUser } = await getSession();
  const user = await getUser(authUser);

  return (
    <div className="text-black">
      {category?.name}
      <CategoryForm category={category} user={user} openLabel="Edit category" />
      <DeleteCategory id={id} type="category" user={user} />
    </div>
  );
};

export default Page;
