"use client";
import { useState } from "react";
import { FooterButtons } from "@/app/components";
import { updateObject } from "@/app/lib/db";
import { mutate } from "swr";
import { notify } from "@/app/lib/handlers";
import { TextInput } from "@mantine/core";
import { inputStyles } from "../../lib/styles";

export default function EditLocation({ data, close, mutateKey }) {
  const [formError, setFormError] = useState(false);
  const [editedLocation, setEditedLocation] = useState({
    name: data.name,
  });

  const handleInputChange = (e) => {
    setEditedLocation({ ...editedLocation, [e.target.name]: e.target.value });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) return;
    if (editedLocation?.name === data?.name) return close();
    try {
      await mutate(
        mutateKey,
        updateObject({
          data: editedLocation,
          id: data.id,
          type: "location",
        }),
        {
          optimisticData: { ...data, name: editedLocation.name },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      notify({ message: `Updated ${data?.name}` });
      mutate("/locations/api");
      close();
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextInput
        name="name"
        label="Name"
        data-autofocus
        radius={inputStyles.radius}
        size={inputStyles.size}
        value={editedLocation?.name}
        onChange={handleInputChange}
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
