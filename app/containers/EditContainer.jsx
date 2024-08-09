"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { updateContainer } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";
import { useRouter } from "next/navigation";

export default function EditContainer({ data, setShowEditContainer, id }) {
  const [formError, setFormError] = useState(false);
  const [editedContainer, setEditedContainer] = useState({
    name: data?.name,
    id: data?.id,
    parentContainerId: data?.parentContainerId,
    locationId: data?.locationId,
  });

  const { user } = useUser();
  const router = useRouter();

  const containerOptions = [];

  user?.containers?.forEach((container) => {
    if (container.id != data.id) {
      containerOptions.push(container);
    }
  });

  const onUpdateContainer = async (e) => {
    e.preventDefault();
    if (!editedContainer?.name) return setFormError(true);
    if (
      editedContainer.name === data.name &&
      editedContainer.parentContainerId === data.parentContainerId
    )
      return setShowEditContainer(false);
    try {
      await mutate(`container${id}`, updateContainer(editedContainer), {
        optimisticData: editedContainer,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      router.replace(`/containers/${id}?name=${editedContainer.name}`, {
        shallow: true,
      });
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowEditContainer(false);
    setEditedContainer({});
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <>
      <form
        onSubmit={onUpdateContainer}
        className=" flex flex-col gap-3 max-w-[400px]"
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
            setEditedContainer({ ...editedContainer, name: e.target.value })
          }
          className="font-bold text-2xl"
          color={formError ? "danger" : "default"}
          onBlur={(e) => validateRequired(e)}
          onFocus={() => setFormError(false)}
          isInvalid={formError}
          validationBehavior="aria"
          autoFocus
        />

        <Select
          label="Parent container"
          variant="bordered"
          placeholder="Select"
          value={editedContainer.parentContainerId}
          defaultSelectedKeys={[editedContainer?.parentContainerId?.toString()]}
          onChange={(e) =>
            setEditedContainer({
              ...editedContainer,
              parentContainerId: parseInt(e.target.value),
            })
          }
        >
          {containerOptions?.map((container) => (
            <SelectItem key={container.id}>{container.name}</SelectItem>
          ))}
        </Select>
        <Select
          label="Location"
          variant="flat"
          placeholder="Select"
          value={editedContainer.locationId}
          defaultSelectedKeys={[editedContainer?.locationId?.toString()]}
          onChange={(e) =>
            setEditedContainer({
              ...editedContainer,
              locationId: parseInt(e.target.value),
            })
          }
        >
          {user?.locations?.map((location) => (
            <SelectItem key={location.id}>{location.name}</SelectItem>
          ))}
        </Select>
        <div>
          <Button
            variant="light"
            color="danger"
            onPress={() => setShowEditContainer(false)}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
