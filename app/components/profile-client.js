"use client";
import Image from "next/image";

export default function ProfileClient({ data, user }) {
  return (
    user && (
      <>
        <Image
          src={data?.image ? data.image : user.picture}
          alt={user.name}
          width="100"
          height="100"
          className="rounded-full"
        />

        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </>
    )
  );
}
