"use client";
import { Button } from "@nextui-org/react";
import { deleteItem } from "@/app/actions";

const DeleteItem = ({ id, user }) => {
  const removeItem = () => {
    return deleteItem(id, user);
  };

  return <Button onClick={removeItem}>Delete</Button>;
};

export default DeleteItem;
