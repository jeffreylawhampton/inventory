"use client";
import { Button } from "@nextui-org/react";
import { deleteLocation } from "@/app/actions";

const DeleteLocation = ({ id, user }) => {
  const removeLocation = () => {
    return deleteLocation(id, user);
  };

  return <Button onClick={removeLocation}>Delete</Button>;
};

export default DeleteLocation;
