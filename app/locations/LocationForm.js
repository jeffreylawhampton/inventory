"use client";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { upsertLocation } from "../actions";

const LocationForm = ({ location, locations, user, openLabel }) => {
  const [newLocation, setNewLocation] = useState({
    id: location?.id || null,
    name: location?.name || "",
    userId: user.id,
  });
  const [error, setError] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (e) => {
    if (newLocation.name) {
      upsertLocation(newLocation);
      onOpenChange();
    } else {
      e.preventDefault();
      setError("Please enter a name");
    }
  };

  const handleInputChange = (event) => {
    setNewLocation({
      ...newLocation,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  return (
    <>
      <Button onPress={onOpen}>{openLabel}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {openLabel}
              </ModalHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <ModalBody>
                  {error}
                  <Input
                    label="Location name"
                    name="name"
                    onChange={handleInputChange}
                    value={newLocation.name}
                    autoFocus
                  />
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

export default LocationForm;
