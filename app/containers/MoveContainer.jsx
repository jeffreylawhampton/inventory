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
import { moveContainer } from "./api/db";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";

const MoveContainer = ({ data, id, setShowMove, showMove }) => {
  const [formError, setFormError] = useState(false);
  const [containerOptions, setContainerOptions] = useState([]);

  const [editedContainer, setEditedContainer] = useState({
    name: data?.name,
    id: data?.id,
    parentContainerId: data?.parentContainerId,
    locationId: data?.locationId,
  });

  const { user } = useUser();

  useEffect(() => {
    const options = editedContainer.locationId
      ? user?.containers?.filter(
          (container) =>
            container.locationId == editedContainer.locationId &&
            container.id != data.id
        )
      : user?.containers?.filter((container) => container.id != data.id);
    setContainerOptions(options);
  }, [user]);

  const onMoveContainer = async (e) => {
    e.preventDefault();
    try {
      await mutate(
        `/containers/api/${id}`,
        moveContainer({
          id: id,
          name: editedContainer.name,
          parentContainerId: editedContainer.parentContainerId,
          locationId: editedContainer.locationId,
        }),
        {
          optimisticData: editedContainer,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success("Moved");
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
    setShowMove(false);
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  const handleLocationChange = (e) => {
    setEditedContainer({ ...editedContainer, locationId: e.target.value });
    setContainerOptions(
      e.target.value
        ? user?.containers?.filter(
            (container) =>
              container.locationId == e.target.value && container.id != data.id
          )
        : user?.containers?.filter((container) => container.id != data.id)
    );
  };

  return (
    <>
      <Button onPress={() => setShowMove(true)}>Move</Button>
      {showMove && (
        <Modal
          isOpen={showMove}
          onOpenChange={() => setShowMove(false)}
          size="xl"
          placement="bottom-center"
          backdrop="blur"
          classNames={{
            backdrop: "bg-black bg-opacity-80",
            base: "px-4 py-8",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-xl font-semibold">
                  Edit container
                </ModalHeader>
                <ModalBody>
                  <form
                    onSubmit={onMoveContainer}
                    className="flex flex-col gap-6"
                  >
                    <Input
                      name="name"
                      size="lg"
                      radius="sm"
                      isRequired
                      aria-label="Name"
                      label="Name"
                      value={editedContainer?.name}
                      onChange={(e) =>
                        setEditedContainer({
                          ...editedContainer,
                          name: e.target.value,
                        })
                      }
                      classNames={{ label: "font-semibold" }}
                      color={formError ? "danger" : "default"}
                      onBlur={(e) => validateRequired(e)}
                      onFocus={() => setFormError(false)}
                      isInvalid={formError}
                      validationBehavior="aria"
                      autoFocus
                    />

                    <Select
                      label="Location"
                      variant="flat"
                      placeholder="Select"
                      size="lg"
                      value={editedContainer.locationId}
                      defaultSelectedKeys={[
                        editedContainer?.locationId?.toString(),
                      ]}
                      onChange={handleLocationChange}
                    >
                      {user?.locations?.map((location) => (
                        <SelectItem key={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Parent container"
                      variant="flat"
                      placeholder="Select"
                      size="lg"
                      isDisabled={!containerOptions.length}
                      value={editedContainer.parentContainerId}
                      defaultSelectedKeys={[
                        editedContainer?.parentContainerId?.toString(),
                      ]}
                      onChange={(e) =>
                        setEditedContainer({
                          ...editedContainer,
                          parentContainerId: e.target.value,
                        })
                      }
                    >
                      {containerOptions.map((container) => (
                        <SelectItem key={container.id}>
                          {container.name}
                        </SelectItem>
                      ))}
                    </Select>

                    <ModalFooter>
                      <Button
                        variant="light"
                        color="danger"
                        onPress={() => setShowMove(false)}
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
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MoveContainer;
