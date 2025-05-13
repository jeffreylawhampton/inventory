"use client";
import { useState, useContext } from "react";
import { FooterButtons } from "@/app/components";
import { updateLocation } from "../api/db";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { TextInput } from "@mantine/core";
import { inputStyles } from "../../lib/styles";
import { DeviceContext } from "../../layout";

export default function EditLocation({ data, id, close }) {
  const [formError, setFormError] = useState(false);
  const [editedLocation, setEditedLocation] = useState(data);
  const { isMobile } = useContext(DeviceContext);

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
      await mutate(`location${id}`, updateLocation(editedLocation), {
        optimisticData: editedLocation,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
      close();
    } catch (e) {
      toast.error("Something went wrong");
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
