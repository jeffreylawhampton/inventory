import { getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";

export default async function ProfileServer() {
  const { user } = await getSession();

  return (
    user && (
      <div>
        <Image src={user.picture} alt={user.name} width={100} height={100} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {user ? (
          <a href="/api/auth/logout">Log out {user?.name}?</a>
        ) : (
          <a href="/api/auth/logout">Log in</a>
        )}
      </div>
    )
  );
}
