"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { createItem } from "@/app/items/api/db";
import ItemForm from "@/app/items/ItemForm";
import { useUser } from "@/app/hooks/useUser";

const CreateItem = ({ showCreateItem, setShowCreateItem, data, mutate }) => {
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
    setShowCreateItem(false);
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
      await mutate(`container${data.id}`, createItem(updatedItem), {
        optimisticData: {
          ...data,
          items: [...data.items, updatedItem],
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      mutate(`/api/containers/allItems/${data.id}`);
      toast.success("Created new item");
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
      opened={showCreateItem}
      open={() => setShowCreateItem(true)}
      close={() => setShowCreateItem(false)}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading="Create new item"
      hidden={["locationId", "containerId"]}
    />
  );
};

export default CreateItem;
