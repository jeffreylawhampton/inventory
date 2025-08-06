"use client";
import { updateItem } from "@/app/lib/db";
import { useState } from "react";
import { mutate } from "swr";
import { notify } from "@/app/lib/handlers";
import ItemForm from "@/app/components/forms/ItemForm";
import { useUser } from "@/app/hooks/useUser";
import { Loader } from "@mantine/core";

export default function EditItem({ data, item, close, mutateKey }) {
  const { user } = useUser();
  const [editedItem, setEditedItem] = useState({
    ...item,
    categories: item?.categories?.map((category) => category.id || []),
  });

  const [formError, setFormError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const onUpdateItem = async (e) => {
    e.preventDefault();
    if (formError) return false;
    const updatedItem = {
      ...editedItem,
      categories: editedItem?.categories
        ?.map((category) =>
          user?.categories?.find((cat) => cat.id.toString() == category)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    };

    try {
      await mutate(
        mutateKey,
        updateItem({ ...editedItem, newImages: uploadedImages }, user?.id),
        {
          optimisticData: {
            ...data,
            items: data?.items?.map((i) =>
              i.id === item.id ? { ...i, ...updatedItem } : i
            ),
          },
          rollbackOnError: true,
          revalidate: true,
          populateCache: false,
        }
      );

      notify({ message: `Updated ${editedItem.name}` });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
    close();
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
      hidden={[]}
    />
  ) : (
    <Loader classNames={{ root: "relative left-[50%]" }} />
  );
}
