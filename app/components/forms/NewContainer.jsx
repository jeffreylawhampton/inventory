import { useState, useEffect } from "react";
import { FooterButtons } from "..";
import { createContainer } from "../../lib/db";
import { mutate } from "swr";
import { Select, TextInput } from "@mantine/core";
import { inputStyles } from "../../lib/styles";
import { notify } from "@/app/lib/handlers";
import { useUser } from "../../hooks/useUser";
import { ColorPicker } from "..";
import { isValidHex, sortObjectArray } from "@/app/lib/helpers";

const NewContainer = ({
  data,
  close,
  hidden,
  mutateKey = "containers",
  additionalMutate = "/locations/api",
}) => {
  const { user } = useUser();
  const [showPicker, setShowPicker] = useState(false);
  const [newContainer, setNewContainer] = useState({
    name: "",
    color: { hex: null },
    parentContainerId: data?.type === "container" ? data?.id : "",
    locationId:
      data?.type === "location"
        ? data?.id
        : data?.type === "container"
        ? data?.locationId
        : "",
  });
  const validHex = isValidHex(newContainer?.color?.hex);
  const [containerOptions, setContainerOptions] = useState([]);
  const [formError, setFormError] = useState();

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
    if (!validHex) return;
    if (!newContainer?.parentContainerId) newContainer.parentContainerId = null;

    try {
      await mutate(mutateKey, createContainer(newContainer), {
        optimisticData: data?.containers
          ? {
              ...data,
              containers: sortObjectArray([...data.containers, newContainer]),
            }
          : [...data, { ...newContainer, id: Date.now() }],
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
        autoFocus
        onChange={handleInputChange}
        onBlur={(e) => validateRequired(e)}
        onFocus={() => setFormError(false)}
        error={formError}
        classNames={{
          label: inputStyles.labelClasses,
          input: formError ? inputStyles.errorClasses : "",
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

      <ColorPicker
        hex={newContainer?.color?.hex}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        validHex={validHex}
        object={newContainer}
        setObject={setNewContainer}
      />
      <FooterButtons onClick={close} />
    </form>
  );
};

export default NewContainer;
