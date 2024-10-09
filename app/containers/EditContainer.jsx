"use client";
import { useState, useEffect } from "react";
import { ColorSwatch, TextInput, Select } from "@mantine/core";
import { updateContainer } from "./api/db";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { compareObjects } from "../lib/helpers";
import { inputStyles } from "../lib/styles";
import FormModal from "../components/FormModal";
import FooterButtons from "../components/FooterButtons";
import { useUser } from "../hooks/useUser";
import ColorInput from "../components/ColorInput";

export default function EditContainer({ data, id, opened, close, open }) {
  const [formError, setFormError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [containerOptions, setContainerOptions] = useState([]);
  const [editedContainer, setEditedContainer] = useState({
    name: data?.name,
    id: data?.id,
    color: { hex: data?.color?.hex || "#ececec" },
    parentContainerId: data?.parentContainerId?.toString(),
    locationId: data?.locationId?.toString(),
  });

  let arr = [data?.parentContainer];

  while (arr[arr.length - 1]?.parentContainer?.id) {
    arr.push(arr[arr.length - 1].parentContainer);
  }
  const { user } = useUser();

  useEffect(() => {
    const options = editedContainer.locationId
      ? user?.containers?.filter(
          (container) =>
            container.locationId == editedContainer.locationId &&
            container.id != data?.id
        )
      : user?.containers?.filter((container) => container.id != data?.id);
    setContainerOptions(options);
  }, [user]);

  const handleSetColor = (e) => {
    setEditedContainer({ ...editedContainer, color: { hex: e } });
  };

  const onUpdateContainer = async (e) => {
    e.preventDefault();
    if (!editedContainer?.name) return setFormError(true);
    if (compareObjects(editedContainer, data)) return close();

    close();
    try {
      await mutate(
        `container${id}`,
        updateContainer({ ...editedContainer, userId: user.id }),
        {
          optimisticData: editedContainer,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      mutate("containers");
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleLocationSelect = (e) => {
    setEditedContainer({
      ...editedContainer,
      locationId: e,
      parentContainerId: null,
    });
    setContainerOptions(
      user?.containers?.filter((container) =>
        e ? container.locationId == e : container
      )
    );
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <FormModal title="Edit container" opened={opened} close={close} size="lg">
      <form onSubmit={onUpdateContainer} className="flex flex-col gap-6">
        <TextInput
          name="name"
          radius={inputStyles.radius}
          label="Name"
          autoFocus
          size={inputStyles.size}
          value={editedContainer.name}
          variant={inputStyles.variant}
          onChange={(e) =>
            setEditedContainer({
              ...editedContainer,
              name: e.target.value,
            })
          }
          onBlur={(e) => validateRequired(e)}
          onFocus={() => setFormError(false)}
          error={formError}
          classNames={{
            label: inputStyles.labelClasses,
            input: formError ? "!bg-danger-100" : "",
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
          value={editedContainer?.color?.hex}
          onChange={(e) =>
            setEditedContainer({ ...editedContainer, color: { hex: e } })
          }
          onClick={() => setShowPicker(!showPicker)}
          leftSection={
            <ColorSwatch
              color={editedContainer?.color?.hex}
              onClick={() => setShowPicker(!showPicker)}
            />
          }
        />
        {showPicker ? (
          <ColorInput
            color={editedContainer?.color?.hex}
            handleSetColor={handleSetColor}
            setShowPicker={setShowPicker}
            colors={user?.colors?.map((color) => color.hex)}
            handleCancel={() => setShowPicker(false)}
          />
        ) : null}
        <Select
          label="Location"
          placeholder="Select"
          size={inputStyles.size}
          variant={inputStyles.variant}
          onChange={handleLocationSelect}
          searchable
          clearable
          classNames={{
            label: inputStyles.labelClasses,
          }}
          value={editedContainer?.locationId}
          data={user?.locations?.map((location) => {
            return {
              value: location.id.toString(),
              label: location.name,
            };
          })}
        />

        <Select
          label="Container"
          placeholder="Select"
          name="container"
          variant={inputStyles.variant}
          size={inputStyles.size}
          onChange={(e) =>
            setEditedContainer({
              ...editedContainer,
              parentContainerId: e,
            })
          }
          searchable
          clearable
          classNames={{
            label: inputStyles.labelClasses,
          }}
          value={editedContainer?.parentContainerId}
          data={containerOptions?.map((container) => {
            return {
              value: container.id.toString(),
              label: container.name,
            };
          })}
        />

        <FooterButtons onClick={close} />
      </form>
    </FormModal>
  );
}
