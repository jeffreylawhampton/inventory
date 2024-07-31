"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { createContainer } from "./api/db";
import { useUser } from "../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 } from "uuid";

const blankContainer = {
  name: "",
};

const NewContainer = ({ isOpen, onOpenChange, onClose }) => {
  const [newContainer, setNewContainer] = useState(blankContainer);
  const [formError, setFormError] = useState(false);

  const queryClient = useQueryClient();

  const { user } = useUser();

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewContainer({
      ...newContainer,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const mutation = useMutation({
    mutationFn: createContainer,
    onMutate: async (newContainer) => {
      onClose();
      setNewContainer(blankContainer);
      await queryClient.cancelQueries({ queryKey: ["containers"] });
      const previousContainers = queryClient.getQueryData(["containers"]);
      const optimistic = {
        id: v4(),
        name: newContainer.name,
        locationId: newContainer.locationId,
        parentContainerId: newContainer.parentContainerId,
      };
      queryClient.setQueryData(["containers"], (data) => [...data, optimistic]);
      return { previousContainers };
    },
    onError: (err, newContainer, context) => {
      queryClient.setQueryData(["containers"], context.previousContainers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
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

  const onCreateContainer = (e) => {
    e.preventDefault();
    if (!newContainer.name) return setFormError(true);
    newContainer.userId = user?.id;
    mutation.mutate(newContainer);
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
                  New container
                </ModalHeader>
                <form onSubmit={onCreateContainer}>
                  <ModalBody>
                    <Input
                      name="name"
                      label="Name"
                      placeholder="New container name"
                      labelPlacement="outside"
                      radius="sm"
                      variant="flat"
                      size="lg"
                      autoFocus
                      value={newContainer.name}
                      onChange={handleInputChange}
                      onBlur={(e) => validateRequired(e)}
                      onFocus={() => setFormError(false)}
                      isInvalid={formError}
                      validationBehavior="aria"
                      className="pb-6"
                      classNames={{ label: "font-semibold" }}
                    />
                    <Select
                      label="Parent container"
                      variant="bordered"
                      placeholder="Select"
                      onChange={(e) =>
                        setNewContainer({
                          ...newContainer,
                          parentContainerId: parseInt(e.target.value),
                        })
                      }
                    >
                      {user?.containers?.map((container) => (
                        <SelectItem key={container.id}>
                          {container.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Location"
                      variant="bordered"
                      placeholder="Select"
                      onChange={(e) =>
                        setNewContainer({
                          ...newContainer,
                          locationId: parseInt(e.target.value),
                        })
                      }
                    >
                      {user?.locations?.map((location) => (
                        <SelectItem key={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </Select>
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

export default NewContainer;
