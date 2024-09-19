"use client";
import { updateItem } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import ItemForm from "./ItemForm";

export default function EditItem({
  id,
  item: oldItem,
  user,
  opened,
  open,
  close,
}) {
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

    try {
      await mutate(`item${id}`, updateItem(item), {
        optimisticData: {
          ...item,
          location: user.locations.find((loc) => loc.id == item.locationId),
          container: user.locations.find((con) => con.id == item.containerId),
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
    } catch (e) {
      toast.error("Something went wrong");
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
      opened={opened}
      close={close}
      open={open}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading={`Edit ${oldItem?.name || "item"}`}
    />
  );
}
