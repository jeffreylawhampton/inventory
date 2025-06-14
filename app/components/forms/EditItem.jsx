"use client";
import { updateItem } from "@/app/lib/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import ItemForm from "@/app/components/ItemForm";
import { useUser } from "@/app/hooks/useUser";
import { Loader } from "@mantine/core";

export default function EditItem({ data, close, mutateKey, additionalMutate }) {
  const { user } = useUser();
  const oldItem = structuredClone(data);
  const [item, setItem] = useState({
    ...data,
    categories: oldItem?.categories?.map((category) => category.id || []),
  });

  const [formError, setFormError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const onUpdateItem = async (e) => {
    e.preventDefault();
    if (formError) return false;
    const updatedItem = { ...item, newImages: uploadedImages };

    try {
      await mutate(mutateKey, updateItem(updatedItem, user?.id), {
        optimisticData: {
          ...updatedItem,
          categories: item?.categories
            ?.map((category) =>
              user?.categories?.find((cat) => cat.id.toString() == category)
            )
            .sort((a, b) => a.name.localeCompare(b.name)),
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
      mutate(additionalMutate);
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  return user ? (
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
      heading={`Edit ${oldItem?.name || "item"}`}
      hidden={["locationId", "containerId"]}
    />
  ) : (
    <Loader classNames={{ root: "relative left-[50%]" }} />
  );
}
