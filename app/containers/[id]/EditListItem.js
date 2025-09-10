"use client";
import { updateItem } from "@/app/lib/db";
import { useState } from "react";
import { mutate } from "swr";
import { notify } from "@/app/lib/handlers";
import { ItemForm } from "@/app/components";
import { useUser } from "@/app/hooks/useUser";
import { Loader } from "@mantine/core";

export default function EditItem({
  data,
  item,
  close,
  mutateKey,
  hidden = ["containerId", "locationId"],
}) {
  const { user } = useUser();
  const [editedItem, setEditedItem] = useState({
    ...item,
    categories: item?.categories?.map((category) => category.id || []),
  });

  const [formError, setFormError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const onUpdateItem = async (e) => {
    e.preventDefault();
    if (formError) return;
    close();
    let optimisticData;
    const optimisticItem = {
      ...editedItem,
      categories: editedItem?.categories
        ?.map((category) =>
          user?.categories?.find((cat) => cat.id.toString() == category)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
    if (Array.isArray(data)) {
      optimisticData = data?.map((c) =>
        c.id === item.containerId
          ? {
              ...c,
              items: c.items?.map((i) =>
                i.id === item.id ? optimisticItem : { ...i }
              ),
            }
          : { ...c }
      );
    } else {
      optimisticData = structuredClone(data);
      if (editedItem.containerId === data.id) {
        optimisticData.items = optimisticData.items.map((i) =>
          i.id === editedItem.id ? optimisticItem : i
        );
      } else {
        const parentContainer = optimisticData.containers?.find(
          (c) => c.id === item.containerId
        );
        parentContainer.items = parentContainer.items.map((i) =>
          i.id === item.id ? optimisticItem : i
        );
        optimisticData.items = optimisticData.items?.filter(
          (i) => i.id != item.id
        );
      }
    }
    try {
      await mutate(
        mutateKey,
        () =>
          updateItem({ ...editedItem, newImages: uploadedImages }, user?.id),
        {
          optimisticData,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );

      notify({ message: `Edited ${editedItem?.name}` });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  return user ? (
    <ItemForm
      handleSubmit={onUpdateItem}
      item={editedItem}
      setItem={setEditedItem}
      user={user}
      setFormError={setFormError}
      formError={formError}
      close={close}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading={`Edit ${item?.name || "item"}`}
      hidden={hidden}
    />
  ) : (
    <Loader classNames={{ root: "relative left-[50%]" }} />
  );
}
