"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";
import { ColorInput, FooterButtons } from "@/app/components";
import { ColorSwatch, TextInput, Select } from "@mantine/core";
import { updateContainer } from "@/app/containers/api/db";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { compareObjects } from "@/app/lib/helpers";
import { inputStyles } from "@/app/lib/styles";

export default function EditContainer({
  data,
  close,
  mutateKey,
  additionalMutate = "/locations/api",
}) {
  const updated = structuredClone(data);
  const [formError, setFormError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [editedContainer, setEditedContainer] = useState(updated);

  let arr = [data?.parentContainer];

  while (arr[arr.length - 1]?.parentContainer?.id) {
    arr.push(arr[arr.length - 1].parentContainer);
  }
  const { user } = useUser();

  const handleSetColor = (e) => {
    setEditedContainer({ ...editedContainer, color: { hex: e } });
  };

  const onUpdateContainer = async (e) => {
    e.preventDefault();
    if (!editedContainer?.name) return setFormError(true);
    if (compareObjects(editedContainer, data)) return close();

    try {
      await mutate(
        mutateKey,
        updateContainer({ ...editedContainer, id: data.id, userId: user.id }),
        {
          optimisticData: editedContainer,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      mutate(additionalMutate);
      toast.success("Success");
      close();
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
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
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
        value={editedContainer?.locationId?.toString() ?? null}
        data={user?.locations?.map((location) => {
          return {
            value: location.id.toString(),
            label: location.name,
          };
        })}
      />

      <FooterButtons onClick={close} />
    </form>
  );
}
