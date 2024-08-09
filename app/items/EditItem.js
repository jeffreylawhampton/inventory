"use client";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { updateItem } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";
import CategorySelect from "../components/CategorySelect";

export default function EditItem({ id, item, user, setShowEditItem }) {
  const [formError, setFormError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [editedItem, setEditedItem] = useState({
    id: item?.id,
    name: item?.name,
    description: item?.description,
    value: item?.value,
    quantity: item?.quantity,
    purchasedAt: item?.purchasedAt,
    locationId: item?.locationId,
    containerId: item?.containerId,
    images: item?.images || [],
    categories: item?.categories || [],
    newImages: [],
  });

  const router = useRouter();

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setEditedItem({
      ...editedItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSelectChange = (e) => {
    const selected = e?.map((category) => category.value);
    setEditedItem({ ...editedItem, categories: selected });
  };

  const onUpdateItem = async (e) => {
    e.preventDefault();
    const updatedItem = {
      ...editedItem,
      images: uploadedImages,
    };

    try {
      await mutate(`item${id}`, updateItem(updatedItem), {
        optimisticData: {
          ...updatedItem,
          location: user.locations.find(
            (loc) => loc.id == editedItem.locationId
          ),
          container: user.locations.find(
            (con) => con.id == editedItem.containerId
          ),
          categories: updatedItem?.categories
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
      router.replace(`/items/${id}?name=${editedItem.name}`, {
        shallow: true,
      });
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowEditItem(false);
  };

  const handleImageUpload = (e) => {
    setEditedItem({ ...editedItem, newImages: [e.info] });
  };

  return (
    <>
      <form onSubmit={onUpdateItem}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="name"
            label="Name"
            aria-label="Name"
            value={editedItem.name}
            onChange={handleInputChange}
            onBlur={(e) => validateRequired(e)}
            onFocus={() => setFormError(false)}
            isInvalid={formError}
            validationBehavior="aria"
            autoFocus
          />

          <Input
            name="description"
            value={editedItem.description || ""}
            onChange={handleInputChange}
            label="Description"
          />

          <Input
            name="quantity"
            value={editedItem.quantity || ""}
            onChange={handleInputChange}
            label="Quantity"
            type="number"
          />

          <Input
            name="purchasedAt"
            value={editedItem.purchasedAt || ""}
            onChange={handleInputChange}
            label="Purchased at"
          />

          <Input
            name="value"
            value={editedItem.value || ""}
            label="Value"
            onChange={handleInputChange}
          />

          <CategorySelect
            onChange={handleSelectChange}
            userCategories={user?.categories}
            defaultValue={item?.categories?.map((category) => {
              return {
                value: category.id,
                color: category?.color,
                label: category.name,
                key: category.id,
              };
            })}
          />

          <Select
            label="Container"
            placeholder="Select"
            name="containerId"
            defaultSelectedKeys={[item?.containerId?.toString()]}
            value={editedItem.containerId || ""}
            onChange={(e) =>
              setEditedItem({ ...editedItem, [e.target.name]: e.target.value })
            }
          >
            {user?.containers?.map((container) => (
              <SelectItem key={container.id} aria-label={container.name}>
                {container.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Location"
            placeholder="Select"
            name="locationId"
            value={editedItem.containerId || ""}
            defaultSelectedKeys={[item?.locationId?.toString()]}
            onChange={(e) =>
              setEditedItem({ ...editedItem, [e.target.name]: e.target.value })
            }
          >
            {user?.locations?.map((location) => (
              <SelectItem key={location.id}>{location.name}</SelectItem>
            ))}
          </Select>
          <ImageUpload handleImageUpload={handleImageUpload} />
        </div>

        <Button
          variant="light"
          color="danger"
          onPress={() => setShowEditItem(false)}
        >
          Cancel
        </Button>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
}
