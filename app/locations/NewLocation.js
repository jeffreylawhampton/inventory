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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 } from "uuid";

const NewLocation = ({ isOpen, onOpenChange, onClose }) => {
  const [newLocation, setNewLocation] = useState({ name: "" });
  const [formError, setFormError] = useState(false);

  const queryClient = useQueryClient();

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewLocation({
      ...newLocation,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const mutation = useMutation({
    mutationFn: createLocation,
    onMutate: async (newLocation) => {
      onClose();
      setNewLocation({ name: "" });
      await queryClient.cancelQueries({ queryKey: ["locations"] });
      const previousLocations = queryClient.getQueryData(["locations"]);
      const optimistic = {
        id: v4(),
        name: newLocation.name,
      };
      queryClient.setQueryData(["locations"], (data) => [...data, optimistic]);
      return { previousLocations };
    },
    onError: (err, newLocation, context) => {
      queryClient.setQueryData(["locations"], context.previousLocations);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
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

  const onCreateLocation = (e) => {
    e.preventDefault();
    if (!newLocation.name) return setFormError(true);
    mutation.mutate(newLocation);
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  return (
    isOpen && (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-xl font-semibold">
                  New location
                </ModalHeader>
                <form onSubmit={onCreateLocation}>
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
                      value={newLocation.name}
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
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
  );
};

export default NewLocation;
