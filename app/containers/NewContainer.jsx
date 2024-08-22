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
import { useState, useEffect } from "react";
import { createContainer } from "./api/db";
import { useUser } from "../hooks/useUser";
import { mutate } from "swr";

const NewContainer = ({ isOpen, onOpenChange, onOpen, containerList }) => {
  const [newContainer, setNewContainer] = useState({ name: "" });
  const [containerOptions, setContainerOptions] = useState([]);
  const [formError, setFormError] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    setContainerOptions(
      newContainer.locationId
        ? user?.containers?.filter(
            (container) => container.locationId == newContainer.locationId
          )
        : user?.containers
    );
  }, [user]);

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewContainer({
      ...newContainer,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newContainer.name) return setFormError(true);
    onOpenChange();
    try {
      await mutate(
        "containers",
        createContainer({ ...newContainer, userId: user.id }),
        {
          optimisticData: [...containerList, newContainer],
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
    setNewContainer({ name: "" });
    await mutate("containers");
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  const handleLocationChange = (e) => {
    setNewContainer({ ...newContainer, locationId: e.target.value });
    setContainerOptions(
      e.target.value
        ? user?.containers?.filter(
            (container) => container.locationId == e.target.value
          )
        : user?.containers
    );
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
            <>
              <ModalHeader className="text-xl font-semibold">
                Create new container
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    name="name"
                    label="Name"
                    placeholder="New container name"
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
                    classNames={{ label: "font-semibold" }}
                  />

                  <Select
                    label="Location"
                    variant="bordered"
                    placeholder="Select"
                    onChange={handleLocationChange}
                  >
                    {user?.locations?.map((location) => (
                      <SelectItem key={location.id}>{location.name}</SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Parent container"
                    variant="bordered"
                    isDisabled={!containerOptions.length}
                    placeholder="Select"
                    onChange={(e) =>
                      setNewContainer({
                        ...newContainer,
                        parentContainerId: parseInt(e.target.value),
                      })
                    }
                  >
                    {containerOptions?.map((container) => (
                      <SelectItem key={container.id}>
                        {container.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <ModalFooter className="px-0">
                    <Button
                      variant="light"
                      color="danger"
                      onPress={onOpenChange}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          </ModalContent>
        </Modal>
      </>
    )
  );
};

export default NewContainer;
