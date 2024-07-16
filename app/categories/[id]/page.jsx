"use server";
import DeleteCategory from "../DeleteCategory";
import { getSession } from "@auth0/nextjs-auth0";
import { getUser, getCategory } from "@/app/actions";
import CategoryForm from "../CategoryForm";

export default async function Page({ params: { id } }) {
  id = parseInt(id);

  const { user: authUser } = await getSession();
  const user = await getUser(authUser);

  const category = await getCategory(id);

  return (
    <div className="text-black">
      <h1>{category?.name}</h1>
      <DeleteCategory id={id} user={user} />
      <CategoryForm category={category} user={user} openLabel="Edit category" />
    </div>
  );
}
