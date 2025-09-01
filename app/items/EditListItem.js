"use client";
import { updateItem } from "../lib/db";
import { useUser } from "../hooks/useUser";
import { useState } from "react";
import { mutate } from "swr";
import { notify } from "../lib/handlers";
import ItemForm from "../components/forms/ItemForm";

export default function EditListItem({
  item: oldItem,
  data,
  close,
  mutateKey,
  additionalMutate,
  hidden = [],
}) {
  const { user } = useUser();
  const [item, setItem] = useState({
    id: oldItem?.id,
    name: oldItem?.name || "",
    description: oldItem?.description || "",
    value: oldItem?.value || "",
    quantity: oldItem?.quantity || "",
    purchasedAt: oldItem?.purchasedAt || "",
    locationId: oldItem?.locationId || "",
    containerId: oldItem?.containerId || "",
    images: oldItem?.images || [],
    categories: oldItem?.categories?.map((category) => category.id) || [],
    newImages: [],
  });
  const [formError, setFormError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const onUpdateItem = async (e) => {
    e.preventDefault();
    if (formError) return false;
    const updatedItem = { ...item, newImages: uploadedImages };

    const editedItem = {
      ...updatedItem,
      categories: updatedItem?.categories
        ?.map((category) =>
          user?.categories?.find((cat) => cat.id.toString() == category)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    };

    let optimisticData;
    if (Array.isArray(data)) {
      optimisticData = data?.map((i) =>
        i.id === updatedItem?.id ? { ...i, ...editedItem } : i
      );
    } else {
      optimisticData = {
        ...data,
        items: data?.items?.map((i) =>
          i.id === updatedItem?.id ? { ...i, ...editedItem } : i
        ),
      };
    }

    try {
      await mutate(mutateKey, updateItem(updatedItem, user?.id), {
        optimisticData,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      mutate(additionalMutate);
      notify({ message: `Updated ${item?.name}` });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
    close();
  };

  return (
    <ItemForm
      handleSubmit={onUpdateItem}
      item={item}
      setItem={setItem}
      user={user}
      setFormError={setFormError}
      formError={formError}
      close={close}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading={`Edit ${oldItem?.name}`}
      hidden={hidden}
    />
  );
}
