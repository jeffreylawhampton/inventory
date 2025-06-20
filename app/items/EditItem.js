"use client";
import { updateItem } from "../lib/db";
import { useState, useContext } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import ItemForm from "../components/ItemForm";
import { DeviceContext } from "../layout";

export default function EditItem({
  id,
  item: oldItem,
  user,
  close,
  mutateKey,
}) {
  const { setHideCarouselNav } = useContext(DeviceContext);
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
    try {
      await mutate(mutateKey, updateItem(updatedItem, user?.id), {
        optimisticData: {
          ...updatedItem,
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
      setHideCarouselNav(false);
      toast.success("Success");
      mutate("/items/api");
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
      close={close}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading={`Edit ${oldItem?.name || "item"}`}
    />
  );
}
