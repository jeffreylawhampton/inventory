"use client";
import { useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import { mutate } from "swr";
import { createItem } from "@/app/lib/db";
import ItemForm from "@/app/components/ItemForm";
import { notify } from "@/app/lib/handlers";

const CreateItem = ({ data, close, mutateKey }) => {
  const [item, setItem] = useState({ categories: [data.id] });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formError, setFormError] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name) return setFormError(true);
    setItem({ categories: [data.id.toString()] });
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

    const optimistic = { ...data };
    optimistic.items = [...optimistic.items, updatedItem].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    try {
      await mutate(`/categories/api/${data.id}`, createItem(updatedItem), {
        optimisticData: {
          ...data,
          items: [...data.items, updatedItem],
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      notify({ message: `Created item ${item?.name}` });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    } finally {
      close();
    }
  };

  return (
    <ItemForm
      item={item}
      setItem={setItem}
      handleSubmit={handleSubmit}
      close={close}
      user={user}
      formError={formError}
      setFormError={setFormError}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading="Create new item"
    />
  );
};

export default CreateItem;
