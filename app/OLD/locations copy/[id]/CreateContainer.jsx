"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";
import { FooterButtons, FormModal } from "@/app/components";
import { ColorInput, Select, TextInput } from "@mantine/core";
import toast from "react-hot-toast";
import { createContainer } from "@/app/containers/api/db";
import { mutate } from "swr";
import { sample } from "lodash";
import { inputStyles } from "@/app/lib/styles";

const CreateContainer = ({
  data,
  showCreateContainer,
  setShowCreateContainer,
}) => {
  const { user } = useUser();
  const colors = user?.colors?.map((color) => color.hex);
  const [newContainer, setNewContainer] = useState({
    name: "",
    color: { hex: "" },
    locationId: data.id,
  });
  const [containerOptions, setContainerOptions] = useState([]);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    setContainerOptions(
      user?.containers?.filter((container) => container.locationId === data.id)
    );
    setNewContainer({ ...newContainer, color: { hex: sample(colors) } });
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
    setShowCreateContainer(false);

    try {
      await mutate(
        `location${data.id}`,
        createContainer({ ...newContainer, userId: user.id }),
        {
          optimisticData: {
            ...data,
            containers: [...data.containers, newContainer],
          },
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
    setNewContainer({ locationId: data.id });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  return (
    <FormModal
      opened={showCreateContainer}
      close={() => setShowCreateContainer(false)}
      size="lg"
      title="Create new container"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          name="name"
          label="Name"
          data-autofocus
          variant={inputStyles.variant}
          radius={inputStyles.radius}
          size={inputStyles.size}
          value={newContainer.name}
          onChange={handleInputChange}
          onBlur={(e) => validateRequired(e)}
          onFocus={() => setFormError(false)}
          error={formError}
          classNames={{
            label: inputStyles.labelClasses,
            input: formError ? "!bg-danger-200" : "",
          }}
        />

        <ColorInput
          value={newContainer.color?.hex}
          onChange={(e) =>
            setNewContainer({ ...newContainer, color: { hex: e } })
          }
          name="color"
          label="Color"
          variant={inputStyles.variant}
          radius={inputStyles.radius}
          size={inputStyles.size}
          swatches={colors}
          classNames={{
            label: inputStyles.labelClasses,
          }}
        />

        <Select
          label="Container"
          placeholder="Select"
          size={inputStyles.size}
          radius={inputStyles.radius}
          variant={inputStyles.variant}
          clearable
          searchable
          nothingFoundMessage="No containers here"
          onChange={(e) =>
            setNewContainer({
              ...newContainer,
              parentContainerId: e,
            })
          }
          value={newContainer.parentContainerId}
          data={containerOptions?.map((container) => {
            return {
              value: container.id?.toString(),
              label: container.name,
            };
          })}
          comboboxProps={{ offset: inputStyles.offset }}
          classNames={{
            label: inputStyles.labelClasses,
            empty: inputStyles.empty,
          }}
        />

        <FooterButtons onClick={close} />
      </form>
    </FormModal>
  );
};

export default CreateContainer;
