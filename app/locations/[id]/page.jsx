import prisma from "@/app/lib/prisma";
import DeleteLocation from "../DeleteLocation";
import { getUser } from "@/app/actions";
import { getSession } from "@auth0/nextjs-auth0";
import LocationForm from "../LocationForm";

const Page = async ({ params: { id } }) => {
  id = parseInt(id);

  const { user: authUser } = await getSession();
  const user = await getUser(authUser);

  const location = await prisma.location.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  const locations = await prisma.location.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="text-black">
      {location?.name}
      <LocationForm
        location={location}
        user={user}
        openLabel="Edit location"
        locations={locations}
      />
      <DeleteLocation id={id} type="location" user={user} />
    </div>
  );
};

export default Page;
