"use client";
import { notify } from "../lib/handlers";
import { useState } from "react";
import { createItem } from "../lib/db";
import { mutate } from "swr";
import ItemForm from "../components/forms/ItemForm";
import { useUser } from "../hooks/useUser";

const NewItem = ({ data, close }) => {
  const [item, setItem] = useState({
    name: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formError, setFormError] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name) return setFormError(true);
    close();
    setItem({});
    const updatedItem = {
      ...item,
      userId: user.id,
      newImages: uploadedImages,
      images: uploadedImages,
      categories: item?.categories
        ?.map((category) =>
          user?.categories?.find((cat) => cat.id.toString() == category)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    };

    const optimistic = [...data, updatedItem].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    try {
      await mutate(`/items/api?search=`, createItem(updatedItem), {
        optimisticData: optimistic,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      notify({ message: `Created item ${item?.name}` });
    } catch (e) {
      notify({ isError: true });
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
      close={close}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading="Create new item"
    />
  );
};

export default NewItem;
