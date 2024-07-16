import { getUser } from "@/app/actions";
import Link from "next/link";
import prisma from "../lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import LocationForm from "./LocationForm";

const Page = async () => {
  const { user: authUser } = await getSession();
  const user = await getUser(authUser);

  const locations = await prisma.location.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      items: true,
    },
  });

  return (
    <div>
      Locations
      <ul>
        {locations?.map((location) => {
          return (
            <li key={location.id}>
              <Link href={`locations/${location.id}`} className="block py-5">
                {location.name}
                <div>Items</div>
                <ul>
                  {location.items?.map((item) => {
                    return <li key={item.name}>{item.name}</li>;
                  })}
                </ul>
              </Link>
            </li>
          );
        })}
      </ul>
      <LocationForm
        user={user}
        locations={locations}
        openLabel="Create new location"
      />
    </div>
  );
};

export default Page;
