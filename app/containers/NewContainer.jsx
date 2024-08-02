"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { createContainer } from "./api/db";
import { useUser } from "../hooks/useUser";
import { mutate } from "swr";

const NewContainer = ({ setShowNewContainer, containerList }) => {
  const [newContainer, setNewContainer] = useState({ name: "" });
  const [formError, setFormError] = useState(false);

  const { user } = useUser();

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
    setShowNewContainer(false);
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
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
            <SelectItem key={container.id}>{container.name}</SelectItem>
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
            <SelectItem key={location.id}>{location.name}</SelectItem>
          ))}
        </Select>

        <Button
          color="danger"
          variant="light"
          onPress={() => setShowNewContainer(false)}
        >
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};

export default NewContainer;
