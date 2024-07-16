import prisma from "@/app/lib/prisma";
import DeleteItem from "../DeleteItem";
import { getSession } from "@auth0/nextjs-auth0";
import { getUser } from "@/app/actions";
import ItemForm from "../ItemForm";

const Page = async ({ params: { id } }) => {
  id = parseInt(id);
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      categories: true,
      images: true,
      location: true,
    },
  });

  const { user: authUser } = await getSession();
  const user = await getUser(authUser);

  return (
    <div className="text-black">
      <h1>{item.name}</h1>
      <DeleteItem id={id} type="item" user={user} />
      <ItemForm item={item} user={user} openLabel="Edit item" />

      <div>
        {item?.images?.map((image) => {
          return (
            <img
              key={image.name}
              src={image.url}
              alt={image.caption}
              width="20%"
            />
          );
        })}
      </div>
      <div className="flex flex-col gap-4">
        <div>Description: {item.description}</div>
        <div>Quantity: {item.quantity}</div>
        <div>Purchased at: {item.purchasedAt}</div>
        <div>Serial number: {item.serialNumber}</div>
        <div>Location: {item.location?.name}</div>
        <div>
          {item.categories.map((category) => {
            return category.name;
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
