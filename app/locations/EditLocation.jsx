"use client";
import {
  Input,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { updateLocation } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EditLocation({ data, id, isOpen, onOpenChange }) {
  const [formError, setFormError] = useState(false);
  const [editedLocation, setEditedLocation] = useState({
    name: data?.name,
    id: data?.id,
    items: data?.items,
  });

  const router = useRouter();

  const handleInputChange = (e) => {
    setEditedLocation({ ...editedLocation, [e.target.name]: e.target.value });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) return;
    if (editedLocation?.name === data?.name) return onOpenChange();
    try {
      await mutate(`location${id}`, updateLocation(editedLocation), {
        optimisticData: editedLocation,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
      router.replace(`/locations/${id}?name=${editedLocation.name}`, {
        shallow: true,
      });
      onOpenChange();
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
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
            base: "px-4 py-8",
          }}
        >
          <ModalContent>
            <>
              <ModalHeader className="text-xl font-semibold">
                Edit location
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <Input
                    name="name"
                    label="Name"
                    placeholder="New location name"
                    labelPlacement="outside"
                    radius="sm"
                    variant="flat"
                    size="lg"
                    autoFocus
                    value={editedLocation.name}
                    onChange={handleInputChange}
                    onBlur={(e) => validateRequired(e)}
                    onFocus={() => setFormError(false)}
                    isInvalid={formError}
                    validationBehavior="aria"
                    className="pb-6"
                    classNames={{ label: "font-semibold" }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onOpenChange}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </ModalFooter>
              </form>
            </>
          </ModalContent>
        </Modal>
      </>
    )
  );
}
