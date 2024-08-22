"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { createItem } from "./api/db";
import { mutate } from "swr";
import ItemForm from "./ItemForm";
import { useUser } from "../hooks/useUser";

const NewItem = ({ data, isOpen, onOpenChange, onClose }) => {
  const [item, setItem] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formError, setFormError] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name) return setFormError(true);
    onOpenChange();
    setItem({});
    const updatedItem = {
      ...item,
      userId: user.id,
      newImages: uploadedImages,
      images: uploadedImages,
    };

    const optimistic = { ...data };
    optimistic.items = [...optimistic.items, updatedItem].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    try {
      await mutate(`/items/api?search=`, createItem(updatedItem), {
        optimisticData: optimistic,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });

      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  return (
    <ItemForm
      item={item}
      setItem={setItem}
      handleSubmit={handleSubmit}
      user={user}
      formError={formError}
      setFormError={setFormError}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading="Create new item"
    />
  );
};

export default NewItem;
