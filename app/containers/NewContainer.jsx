"use client";
import { ColorInput, Select, TextInput } from "@mantine/core";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { createContainer } from "./api/db";
import { useUser } from "../hooks/useUser";
import { mutate } from "swr";
import { sample } from "lodash";
import { inputStyles } from "../lib/styles";
import FooterButtons from "../components/FooterButtons";
import FormModal from "../components/FormModal";

const NewContainer = ({
  containerList,
  data,
  opened,
  close,
  hidden,
  containerId,
  locationId,
  mutateKey = "containers",
}) => {
  const { user } = useUser();
  const colors = user?.colors?.map((color) => color.hex);
  const [newContainer, setNewContainer] = useState({
    name: "",
    color: { hex: "" },
    parentContainerId: containerId || "",
    locationId: locationId || "",
  });
  const [containerOptions, setContainerOptions] = useState([]);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    setContainerOptions(
      newContainer.locationId
        ? user?.containers?.filter(
            (container) => container.locationId == newContainer.locationId
          )
        : user?.containers
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

  const handleLocationSelect = (e) => {
    setNewContainer({
      ...newContainer,
      locationId: e,
      parentContainerId: null,
    });
    setContainerOptions(
      user?.containers?.filter((container) =>
        e ? container.locationId == e : container
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newContainer.name) return setFormError(true);
    close();
    let optimisticData;
    if (data) {
      optimisticData = {
        ...data,
        containers: [...data.containers, newContainer],
      };
    } else {
      optimisticData = [...containerList, newContainer];
    }

    try {
      await mutate(
        mutateKey,
        createContainer({ ...newContainer, userId: user.id }),
        {
          optimisticData: optimisticData,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      mutate("allContainers");
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

  return (
    <FormModal
      opened={opened}
      close={close}
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

        {hidden?.includes("locationId") ? null : (
          <Select
            label="Location"
            placeholder="Select"
            radius={inputStyles.radius}
            variant={inputStyles.variant}
            size={inputStyles.size}
            clearable
            searchable
            onChange={handleLocationSelect}
            value={newContainer.locationId}
            comboboxProps={{ offset: inputStyles.offset }}
            data={user?.locations?.map((location) => {
              return {
                value: location.id?.toString(),
                label: location.name,
              };
            })}
            classNames={{ label: inputStyles.labelClasses }}
          />
        )}

        {hidden?.includes("containerId") ? null : (
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
        )}

        <FooterButtons onClick={close} />
      </form>
    </FormModal>
  );
};

export default NewContainer;
