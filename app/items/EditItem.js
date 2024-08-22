"use client";
import { updateItem } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ItemForm from "./ItemForm";

export default function EditItem({
  id,
  item: oldItem,
  user,
  isOpen,
  onOpenChange,
  onClose,
  onOpen,
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
  const router = useRouter();

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
              user?.categories?.find((cat) => cat.id == category)
            )
            .sort((a, b) => a.name.localeCompare(b.name)),
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
      router.replace(`/items/${id}?name=${item.name}`, {
        shallow: true,
      });
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    onClose();
  };

  return (
    <ItemForm
      handleSubmit={onUpdateItem}
      item={item}
      setItem={setItem}
      user={user}
      setFormError={setFormError}
      formError={formError}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onOpen={onOpen}
      onClose={onClose}
      uploadedImages={uploadedImages}
      setUploadedImages={setUploadedImages}
      heading={`Edit ${oldItem.name || "item"}`}
    />
  );
}
