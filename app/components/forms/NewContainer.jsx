import { useState, useEffect } from "react";
import { ColorInput, FooterButtons } from "..";
import { createContainer } from "../../lib/db";
import { mutate } from "swr";
import { ColorSwatch, Select, TextInput } from "@mantine/core";
import { sample } from "lodash";
import { inputStyles } from "../../lib/styles";
import { notify } from "@/app/lib/handlers";
import { useUser } from "../../hooks/useUser";

const NewContainer = ({
  data,
  close,
  hidden,
  mutateKey = "containers",
  additionalMutate = "/locations/api",
}) => {
  const { user } = useUser();
  const colors = user?.colors?.map((color) => color.hex);
  const [showPicker, setShowPicker] = useState(false);
  const [newContainer, setNewContainer] = useState({
    name: "",
    color: { hex: "" },
    parentContainerId: data?.type === "container" ? data?.id : "",
    locationId:
      data?.type === "location"
        ? data?.id
        : data?.type === "container"
        ? data?.locationId
        : "",
  });

  const [containerOptions, setContainerOptions] = useState([]);
  const [formError, setFormError] = useState(false);

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

  const handleSetColor = (e) => {
    setNewContainer({ ...newContainer, color: { hex: e } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newContainer.name) return setFormError(true);
    if (!newContainer?.parentContainerId) newContainer.parentContainerId = null;
    try {
      await mutate(mutateKey, createContainer({ ...newContainer }), {
        optimisticData: data?.containers
          ? {
              ...data,
              containers: [...data.containers, newContainer]?.sort(
                (a, b) => a.name - b.name
              ),
            }
          : [...data, newContainer],
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      mutate(additionalMutate);
      close();
      notify({ message: `Created container ${newContainer?.name}` });
    } catch (e) {
      notify({ isError: true });
      throw e;
    }
    setNewContainer({});
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  useEffect(() => {
    setContainerOptions(
      newContainer.locationId
        ? user?.containers?.filter(
            (container) => container.locationId == newContainer.locationId
          )
        : user?.containers
    );
    setNewContainer({
      ...newContainer,
      color: { hex: sample(colors) ? sample(colors) : "#4b8ec7" },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
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

      <TextInput
        name="color"
        label="Color"
        radius={inputStyles.radius}
        size={inputStyles.size}
        variant={inputStyles.variant}
        classNames={{
          label: inputStyles.labelClasses,
        }}
        value={newContainer?.color?.hex}
        onChange={(e) =>
          setNewContainer({ ...newContainer, color: { hex: e } })
        }
        onClick={() => setShowPicker(!showPicker)}
        leftSection={
          <ColorSwatch
            color={newContainer?.color?.hex}
            onClick={() => setShowPicker(!showPicker)}
          />
        }
      />
      {showPicker ? (
        <ColorInput
          color={newContainer?.color?.hex}
          handleSetColor={handleSetColor}
          setShowPicker={setShowPicker}
          colors={user?.colors?.map((color) => color.hex)}
          handleCancel={() => setShowPicker(false)}
        />
      ) : null}
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
  );
};

export default NewContainer;
