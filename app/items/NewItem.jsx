"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { createItem } from "./api/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 } from "uuid";
import { useUser } from "../hooks/useUser";
import Image from "next/image";
import FilestackPicker from "../components/FilestackPicker";
import { X } from "lucide-react";

const NewItem = ({ setShowAddItem }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [newItem, setNewItem] = useState({});

  const { user } = useUser();
  const [formError, setFormError] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createItem,
    onMutate: async (newItem) => {
      setNewItem({});
      setShowAddItem(false);
      await queryClient.cancelQueries({ queryKey: ["items"] });
      const previousItems = queryClient.getQueryData(["items"]);
      const optimistic = {
        id: v4(),
        name: newItem.name,
        containerId: newItem?.containerId,
        locationId: newItem?.locationId,
        images: newItem?.images[0],
      };
      queryClient.setQueryData(["items"], (data) => [...data, optimistic]);
      return { previousItems };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(["items"], context.previousItems);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onSuccess: async () => toast.success("Success"),
    onError: (error) => {
      if (error.message.includes("Unique")) {
        toast.error("You already have that one");
      } else {
        toast.error(error.message);
      }
    },
  });

  const onCreateItem = (e) => {
    e.preventDefault();
    if (!newItem.name) return setFormError(true);
    newItem.userId = user?.id;
    newItem.images = uploadedImages;
    mutation.mutate(newItem);
  };

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

  const handleSelectionChange = (e) => {
    newItem.categories = e.target.value.split(",");
  };

  return (
    <>
      <form onSubmit={onCreateItem}>
        <Input
          name="name"
          label="Name"
          placeholder="New item name"
          labelPlacement="outside"
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
          className="pb-6"
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

        <Select
          label="Container"
          placeholder="Select"
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
        </Select>

        <Select
          label="Location"
          placeholder="Select"
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
            return <SelectItem key={category.id}>{category.name}</SelectItem>;
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
      {uploadedImages && (
        <div className="flex gap-3">
          {uploadedImages.map((image) => (
            <div key={image.url} className="relative">
              <div
                onClick={() => removeImage(image.url)}
                className="transition z-20 rounded-full bg-black bg-opacity-75  text-white drop-shadow-2xl w-5 h-5 flex items-center justify-center absolute right-2 top-2 hover:scale-125"
              >
                <X strokeWidth={3} className="h-4 w-4" />
              </div>
              <Image
                key={image.url}
                src={image.url}
                width={200}
                height={200}
                alt=""
                onClick={() => removeImage(image.url)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default NewItem;
