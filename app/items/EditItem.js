"use client";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItem } from "./api/db";
import { useUser } from "../hooks/useUser";
import { useState } from "react";
import FilestackPicker from "../components/FilestackPicker";

export default function EditItem({ item, setShowEditItem }) {
  const [formError, setFormError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { user } = useUser();

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  const handleSelectionChange = (e) => {
    setSelectedCategories(e.target.value.split(","));
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateItem,
    onMutate: async (item) => {
      await queryClient.cancelQueries({
        queryKey: ["item"],
      });
      const previousItem = queryClient.getQueryData(["item"]);
      queryClient.setQueryData(["item"], item);
      return { previousItem, item };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["item"] });
    },
    onSuccess: async () => {
      toast.success("Item updated");
    },
    onError: (error) => {
      if (error.message.includes("Unique")) {
        toast.error("You already have that one");
      } else {
        toast.error(error.message);
      }
    },
  });

  const onUpdateItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const description = formData.get("description");
    const value = formData.get("value");
    const quantity = formData.get("quantity");
    const purchasedAt = formData.get("purchasedAt");
    const containerId = formData.get("containerId");
    const locationId = formData.get("locationId");
    const id = item.id;
    const images = uploadedImages;
    const categories = selectedCategories;
    mutation.mutate({
      name,
      id,
      description,
      value,
      quantity,
      containerId,
      locationId,
      purchasedAt,
      images,
      categories,
    });
    setShowEditItem(false);
  };

  return (
    <>
      <form onSubmit={onUpdateItem}>
        <Input
          name="name"
          label="Name"
          aria-label="Name"
          defaultValue={item?.name}
          onBlur={(e) => validateRequired(e)}
          onFocus={() => setFormError(false)}
          isInvalid={formError}
          validationBehavior="aria"
          autoFocus
        />

        <Input
          name="description"
          defaultValue={item?.description}
          label="Description"
        />

        <Input
          name="quantity"
          defaultValue={item?.quantity}
          label="Quantity"
          type="number"
        />

        <Input
          name="purchasedAt"
          defaultValue={item?.purchasedAt}
          label="Purchased at"
        />

        <Input name="value" defaultValue={item?.value} label="Value" />

        <Select
          label="Container"
          placeholder="Select"
          name="containerId"
          defaultSelectedKeys={[item?.containerId?.toString()]}
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
          defaultSelectedKeys={[item?.locationId?.toString()]}
        >
          {user?.locations?.map((location) => (
            <SelectItem key={location.id} aria-label={location.name}>
              {location.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Categories"
          name="categories"
          variant="bordered"
          placeholder="Select"
          selectionMode="multiple"
          onChange={handleSelectionChange}
        >
          {user?.categories?.map((category) => {
            return (
              <SelectItem key={category.id} aria-label={category.name}>
                {category.name}
              </SelectItem>
            );
          })}
        </Select>

        <Button onPress={() => setPickerVisible(true)}>Upload images</Button>
        <div className={`z-40 relative ${pickerVisible ? "" : "hidden"}`}>
          <FilestackPicker
            apikey="Aj6fZpiFQviOse160yT0Tz"
            openPicker={pickerVisible}
            onSuccess={(result) => {
              if (result.filesUploaded.length > 0) {
                setUploadedImages(result.filesUploaded);
              }
            }}
          />
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
