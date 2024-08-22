"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { createLocation } from "./api/db";
import { mutate } from "swr";

const NewLocation = ({ isOpen, onOpenChange, onClose, locationList }) => {
  const [newLocation, setNewLocation] = useState({ name: "" });
  const [formError, setFormError] = useState(false);

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewLocation({
      ...newLocation,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newLocation.name) return setFormError(true);

    try {
      await mutate("locations", createLocation(newLocation), {
        optimisticData: [...locationList, newLocation].sort(
          (a, b) => a.name - b.name
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
    }
    onClose();
    setNewLocation({ name: "" });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  const handleCancel = () => {
    onClose();
    setNewLocation({ name: "" });
  };

  return (
    isOpen && (
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="lg"
          placement="bottom-center"
          backdrop="blur"
          classNames={{
            backdrop: "bg-black bg-opacity-80",
            base: "px-2 py-5",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-xl font-semibold">
              Create new location
            </ModalHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <ModalBody>
                <Input
                  name="name"
                  label="Name"
                  placeholder="New location name"
                  radius="sm"
                  variant="flat"
                  size="lg"
                  autoFocus
                  value={newLocation.name}
                  onChange={handleInputChange}
                  onBlur={(e) => validateRequired(e)}
                  onFocus={() => setFormError(false)}
                  isInvalid={formError}
                  validationBehavior="aria"
                  classNames={{ label: "font-semibold" }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCancel}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </>
    )
  );
};

export default NewLocation;
