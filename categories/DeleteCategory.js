"use client";
import { Button } from "@nextui-org/react";
import { deleteCategory } from "@/app/actions";

const DeleteCategory = ({ id, user }) => {
  const removeCategory = () => {
    deleteCategory(id, user);
  };

  return <Button onClick={removeCategory}>Delete</Button>;
};

export default DeleteCategory;
