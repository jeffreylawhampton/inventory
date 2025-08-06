"use client";
import { useState } from "react";
import { FooterButtons } from "@/app/components";
import { TextInput } from "@mantine/core";
import { inputStyles } from "../../lib/styles";

export default function ContainerForm({
  container,
  close,
  handleSubmit,
  formError,
  setFormError,
}) {
  const [editedContainer, setEditedContainer] = useState({ ...container });

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(editedContainer);
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

      <FooterButtons onClick={close} />
    </form>
  );
}
