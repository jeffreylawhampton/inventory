"use client";
import { mutate } from "swr";
import { notify } from "@/app/lib/handlers";
import { useState } from "react";
import { createItem } from "@/app/lib/db";
import ItemForm from "@/app/components/forms/ItemForm";
import { useUser } from "@/app/hooks/useUser";

const CreateItem = ({ data, close, mutateKey }) => {
  const [item, setItem] = useState({
    containerId: data.id,
    locationId: data.locationId,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formError, setFormError] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name) return setFormError(true);
    setItem({ containerId: data.id, locationId: data.locationId });
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
      await mutate(mutateKey, createItem(updatedItem), {
        optimisticData: {
          ...data,
          items: [...data.items, updatedItem],
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });

      notify({ message: `Created item ${updatedItem?.name}` });
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
      user={user}
      formError={formError}
      setFormError={setFormError}
      close={close}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading="Create new item"
      hidden={["locationId", "containerId"]}
    />
  );
};

export default CreateItem;
