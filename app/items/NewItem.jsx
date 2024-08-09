"use client";
import {
  Button,
  Input,
  Select as NextSelect,
  SelectItem,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { createItem } from "./api/db";
import { useUser } from "../hooks/useUser";
import { mutate } from "swr";
import ImageUpload from "../components/ImageUpload";
import CategorySelect from "../components/CategorySelect";

const NewItem = ({ setShowAddItem, data }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [newItem, setNewItem] = useState({});

  const { user } = useUser();
  const [formError, setFormError] = useState(false);

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewItem({
      ...newItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.name) return setFormError(true);
    const updatedItem = { ...newItem, images: uploadedImages, userId: user.id };
    setShowAddItem(false);

    const optimistic = { ...data };
    optimistic.items = [...optimistic.items, updatedItem].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    try {
      await mutate(`/items/api?search=`, createItem(updatedItem), {
        optimisticData: optimistic,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });

      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleImageUpload = (event) => {
    setUploadedImages([...uploadedImages, event]);
  };

  const handleSelectChange = (e) => {
    const selected = e?.map((category) => category.value);
    setNewItem({ ...newItem, categories: selected });
  };

  return (
    <div className="mb-12">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            label="Name"
            placeholder="New item name"
            radius="sm"
            variant="flat"
            size="lg"
            autoFocus
            onBlur={(e) => validateRequired(e)}
            onFocus={() => setFormError(false)}
            value={newItem.name}
            onChange={handleInputChange}
            isInvalid={formError}
            validationBehavior="aria"
            classNames={{ label: "font-semibold" }}
          />
          <Input
            label="Description"
            name="description"
            size="lg"
            value={newItem.description}
            onChange={handleInputChange}
          />

          <Input
            label="Quantity"
            name="quantity"
            size="lg"
            type="number"
            min={0}
            value={newItem.quantity}
            onChange={handleInputChange}
          />

          <Input
            label="Purchased at"
            name="purchasedAt"
            size="lg"
            value={newItem.purchasedAt}
            onChange={handleInputChange}
          />
          <Input
            label="Serial number"
            name="serialNumber"
            size="lg"
            value={newItem.serialNumber}
            onChange={handleInputChange}
          />

          <Input
            label="Value"
            name="value"
            size="lg"
            value={newItem.value}
            onChange={handleInputChange}
          />

          <NextSelect
            label="Container"
            placeholder="Select"
            size="lg"
            name="containerId"
            value={newItem.containerId}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                containerId: parseInt(e.target.value),
              })
            }
          >
            {user?.containers?.map((container) => (
              <SelectItem key={container.id}>{container.name}</SelectItem>
            ))}
          </NextSelect>

          <NextSelect
            label="Location"
            placeholder="Select"
            size="lg"
            name="locationId"
            value={newItem.locationId}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                locationId: parseInt(e.target.value),
              })
            }
          >
            {user?.locations?.map((location) => (
              <SelectItem key={location.id}>{location.name}</SelectItem>
            ))}
          </NextSelect>

          <CategorySelect
            onChange={handleSelectChange}
            userCategories={user?.categories}
          />
        </div>

        <ImageUpload handleImageUpload={handleImageUpload}>Upload</ImageUpload>

        <div>
          <Button
            color="danger"
            variant="light"
            onPress={() => setShowAddItem(false)}
          >
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewItem;
