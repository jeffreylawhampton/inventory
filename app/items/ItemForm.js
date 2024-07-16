"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { upsertItem, getUserData } from "../actions";
import { PickerDropPane } from "filestack-react";
import ReactSelect from "../components/ReactSelect";
import NextInput from "../components/NextInput";

const ItemForm = ({ item, user, openLabel }) => {
  const [newItem, setNewItem] = useState({
    id: item?.id || "",
    name: item?.name || "",
    description: item?.description || "",
    purchasedAt: item?.purchasedAt || "",
    locationId: item?.locationId || null,
    quantity: item?.quantity || "",
    value: item?.value || "",
    serialNumber: item?.serialNumber || "",
    images: item?.images || [],
    categories: item?.categories || [],
    userId: user.id,
  });
  const [categories, setCategories] = useState([]);

  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (e) => {
    if (newItem.name) {
      setNewItem({
        ...newItem,
      });

      upsertItem(newItem);
      onOpenChange();
    } else {
      e.preventDefault();
      setError("Please enter a name");
    }
  };

  const handleInputChange = (event) => {
    setNewItem({
      ...newItem,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleUpload = (res) => {
    setNewItem({ ...newItem, images: res.filesUploaded });
    setPickerOpen(false);
  };

  const fetchUserData = async () => {
    const { categories, locations } = await getUserData(user?.id);
    setCategories(categories);
    setLocations(locations);
  };

  const pickerOptions = {
    maxFiles: 5,
    fromSources: [
      "local_file_system",
      "url",
      "onedrive",
      "googlephotos",
      "googledrive",
      "gmail",
      "dropbox",
    ],
    container: "#inline",
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Button onPress={onOpen}>{openLabel}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {openLabel}
              </ModalHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <ModalBody>
                  {error}
                  <PickerDropPane
                    apikey="Aj6fZpiFQviOse160yT0Tz"
                    onUploadDone={handleUpload}
                    pickerOptions={pickerOptions}
                  />

                  <div id="inline"></div>

                  <NextInput
                    label="Name"
                    onChange={handleInputChange}
                    value={newItem.name}
                  />

                  <NextInput
                    label="Description"
                    onChange={handleInputChange}
                    value={newItem.description}
                  />

                  <NextInput
                    label="Value"
                    onChange={handleInputChange}
                    value={newItem.value}
                  />

                  <NextInput
                    label="Serial number"
                    name="serialNumber"
                    onChange={handleInputChange}
                    value={newItem.serialNumber}
                  />
                  <NextInput
                    label="Purchased at"
                    name="purchasedAt"
                    onChange={handleInputChange}
                    value={newItem.purchasedAt}
                  />

                  <NextInput
                    type="number"
                    label="Quantity"
                    onChange={handleInputChange}
                    value={newItem.quantity}
                  />

                  <Select
                    label="Location"
                    variant="bordered"
                    placeholder="Select location"
                    selectedKeys={[newItem.locationId]}
                    defaultSelectedKeys={[newItem.locationId]}
                    className="max-w-xs"
                    onChange={(e) => {
                      setNewItem({ ...newItem, locationId: e.target.value });
                    }}
                  >
                    {locations.map((location) => (
                      <SelectItem key={location.id}>{location.name}</SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={(e) => handleSubmit}
                    type="submit"
                  >
                    Create
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemForm;
