"use client";
import { useContext, useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import { FooterButtons } from "@/app/components";
import { TextInput, Select } from "@mantine/core";
import { updateContainer } from "@/app/containers/api/db";
import { mutate } from "swr";
import { notify } from "@/app/lib/handlers";
import { compareObjects } from "@/app/lib/helpers";
import { inputStyles } from "@/app/lib/styles";
import { DeviceContext } from "@/app/providers";
import ColorAndIcon from "./ColorAndIcon";

export default function EditContainer({
  data,
  close,
  mutateKey,
  additionalMutate = "/locations/api",
}) {
  const updated = structuredClone(data);
  const [formError, setFormError] = useState(false);
  const [editedContainer, setEditedContainer] = useState(updated);
  let arr = [data?.parentContainer];

  while (arr[arr.length - 1]?.parentContainer?.id) {
    arr.push(arr[arr.length - 1].parentContainer);
  }
  const { user } = useUser();
  const swatches = user?.colors?.map((c) => c.hex);

  const onUpdateContainer = async (e) => {
    e.preventDefault();
    if (!editedContainer?.name) return setFormError(true);
    if (compareObjects(editedContainer, data)) return close();

    try {
      await mutate(
        mutateKey,
        () =>
          updateContainer({
            ...editedContainer,
            id: data.id,
            userId: user.id,
          }),
        {
          optimisticData: editedContainer,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      mutate(additionalMutate);
      notify({ message: `Edited ${editedContainer?.name}` });
      close();
    } catch (e) {
      notify({ isError: true });
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
      <ColorAndIcon
        object={editedContainer}
        setObject={setEditedContainer}
        swatches={swatches}
        type="container"
      />

      <FooterButtons onClick={close} />
    </form>
  );
}
