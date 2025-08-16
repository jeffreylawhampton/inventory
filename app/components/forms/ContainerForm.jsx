"use client";
import { useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import { FooterButtons } from "@/app/components";
import { Select, TextInput } from "@mantine/core";
import { inputStyles } from "../../lib/styles";

export default function ContainerForm({
  container,
  close,
  handleSubmit,
  formError,
  setFormError,
}) {
  const [editedContainer, setEditedContainer] = useState({ ...container });

  const { user } = useUser();

  const handleLocationSelect = (e) => {
    setEditedContainer({
      ...editedContainer,
      locationId: e,
      parentContainerId: null,
      userId: user?.id,
    });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({
          ...editedContainer,
          location: user?.locations?.find(
            (l) => l.id == editedContainer?.locationId
          ),
        });
      }}
      className="flex flex-col gap-5"
    >
      <TextInput
        name="name"
        label="Name"
        autoFocus
        radius={inputStyles.radius}
        size={inputStyles.size}
        value={editedContainer.name}
        variant={inputStyles.variant}
        onChange={(e) =>
          setEditedContainer({ ...editedContainer, name: e.target.value })
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
      <FooterButtons onClick={close} />
    </form>
  );
}
