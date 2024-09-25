"use client";

import { updateLocation } from "./api/db";
import { useState, useContext } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TextInput } from "@mantine/core";
import { inputStyles } from "../lib/styles";
import FooterButtons from "../components/FooterButtons";
import { DeviceContext } from "../layout";
import FormModal from "../components/FormModal";

export default function EditLocation({ data, id, opened, open, close }) {
  const [formError, setFormError] = useState(false);
  const [editedLocation, setEditedLocation] = useState({
    name: data?.name,
    id: data?.id,
    items: data?.items,
  });
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
    <FormModal
      opened={opened}
      close={close}
      title="Edit location"
      size={isMobile ? "lg" : "md"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          name="name"
          label="Name"
          data-autofocus
          radius={inputStyles.radius}
          size={inputStyles.size}
          value={editedLocation.name}
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
    </FormModal>
  );
}
