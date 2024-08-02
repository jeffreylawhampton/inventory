"use client";
import {
  Input,
  Button,
  CheckboxGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { updateItem } from "./api/db";
import { useState } from "react";
import FilestackPicker from "../components/FilestackPicker";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { CheckboxToggle } from "../components/CheckboxToggle";

export default function EditItem({ id, item, user, setShowEditItem }) {
  const [formError, setFormError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    item?.categories?.map((category) => category.id)
  );

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
  });

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
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  const onUpdateItem = async (e) => {
    e.preventDefault();
    const updatedItem = {
      ...editedItem,
      categories: selectedCategories,
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
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowEditItem(false);
  };

  return (
    <>
      <form onSubmit={onUpdateItem}>
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

        <CheckboxGroup
          label="categories"
          orientation="horizontal"
          value={selectedCategories}
          onValueChange={setSelectedCategories}
        >
          {user?.categories?.map((category) => {
            return (
              <CheckboxToggle
                key={category.id}
                value={category.id}
                color={category?.color || "bg-slate-500"}
              >
                {category.name}
              </CheckboxToggle>
            );
          })}
        </CheckboxGroup>

        <Input
          name="description"
          value={editedItem.description}
          onChange={handleInputChange}
          label="Description"
        />

        <Input
          name="quantity"
          value={editedItem.quantity}
          onChange={handleInputChange}
          label="Quantity"
          type="number"
        />

        <Input
          name="purchasedAt"
          value={editedItem.purchasedAt}
          onChange={handleInputChange}
          label="Purchased at"
        />

        <Input
          name="value"
          value={editedItem.value}
          label="Value"
          onChange={handleInputChange}
        />

        <Select
          label="Container"
          placeholder="Select"
          name="containerId"
          defaultSelectedKeys={[item?.containerId?.toString()]}
          value={editedItem.containerId}
          onChange={handleSelectChange}
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
          onChange={handleSelectChange}
        >
          {user?.locations?.map((location) => (
            <SelectItem key={location.id}>{location.name}</SelectItem>
          ))}
        </Select>

        <Button onPress={() => setPickerVisible(true)}>Upload images</Button>
        <div className={`z-40 relative ${pickerVisible ? "" : "hidden"}`}>
          <FilestackPicker
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
