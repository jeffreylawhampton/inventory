"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { createItem } from "@/app/items/api/db";
import ItemForm from "@/app/components/ItemForm";
import { useUser } from "@/app/hooks/useUser";
import { mutate } from "swr";

const NewItem = ({ data, close }) => {
  const [item, setItem] = useState({
    locationId: data?.type === "location" ? data.id : data?.locationId,
    containerId: data?.type === "container" ? data.id : null,
    categories: [],
    location: data?.type === "location" ? data : data?.container?.location,
    container: data?.type === "container" ? data : null,
    images: [],
    newImages: [],
    favorite: false,
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [formError, setFormError] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name) return setFormError(true);
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

    const optimistic = structuredClone(data);
    optimistic.items = [...optimistic.items, updatedItem].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    try {
      await mutate(
        `/locations/api/selected?type=${data?.type}&id=${data?.id}`,
        createItem(updatedItem),
        {
          optimisticData: optimistic,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      await mutate("/locations/api", {
        revalidate: true,
      });
      toast.success("Created new item");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
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

export default NewItem;
