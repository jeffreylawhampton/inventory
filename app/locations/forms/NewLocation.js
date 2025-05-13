"use client";
import { useState, useContext } from "react";
import { FooterButtons, FormModal } from "@/app/components";
import toast from "react-hot-toast";
import { createLocation } from "../api/db";
import { mutate } from "swr";
import { TextInput } from "@mantine/core";
import { inputStyles } from "../../lib/styles";
import { DeviceContext } from "../../layout";
import { sortObjectArray } from "../../lib/helpers";
import { IconX } from "@tabler/icons-react";

const NewLocation = ({ data, opened, close }) => {
  const [newLocation, setNewLocation] = useState({ name: "" });
  const [formError, setFormError] = useState(false);
  const { isMobile } = useContext(DeviceContext);
  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewLocation({
      ...newLocation,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newLocation.name) return setFormError(true);

    try {
      await mutate("/locations/api", createLocation(newLocation), {
        optimisticData: {
          ...data,
          locations: sortObjectArray([
            ...data.locations,
            {
              ...newLocation,
              containers: [],
              _count: { containers: 0, items: 0 },
            },
          ]),
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
    } catch (e) {
      toast.error(e?.message);
      throw new Error(e);
    }
    close();
    setNewLocation({ name: "" });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  const handleCancel = () => {
    close();
    setNewLocation({ name: "" });
  };

  return (
    <>
      <div className="flex gap-3 justify-between items-center">
        <h2 className="font-semibold text-xl mb-4">Create new location</h2>
        <button onClick={close}>
          <IconX size={20} aria-label="Close modal" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          name="name"
          label="Name"
          data-autofocus
          radius={inputStyles.radius}
          size={inputStyles.size}
          value={newLocation.name}
          onChange={handleInputChange}
          onBlur={(e) => validateRequired(e)}
          onFocus={() => setFormError(false)}
          error={formError}
          classNames={{
            label: inputStyles.labelClasses,
            input: formError ? "!bg-danger-100" : "",
          }}
        />

        <FooterButtons onClick={handleCancel} />
      </form>
    </>
  );
};

export default NewLocation;
