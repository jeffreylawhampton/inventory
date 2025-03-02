"use client";
import { useState, useContext } from "react";
import { FooterButtons, FormModal } from "@/app/components";
import toast from "react-hot-toast";
import { createLocation } from "./api/db";
import { mutate } from "swr";
import { TextInput } from "@mantine/core";
import { inputStyles } from "../../lib/styles";
import { DeviceContext } from "../../layout";
import { sortObjectArray } from "../../lib/helpers";

const NewLocation = ({ locationList, opened, close, filters, setFilters }) => {
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
    const newLocations = sortObjectArray([...locationList, newLocation]);
    try {
      await mutate("locations", createLocation(newLocation), {
        optimisticData: newLocations,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      const newFilters = [...filters, newLocation.name]?.sort(
        (a, b) => a.name - b.name
      );
      setFilters(newFilters);
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
      <FormModal
        opened={opened}
        close={close}
        title="Create new location"
        size={isMobile ? "lg" : "md"}
      >
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
      </FormModal>
    </>
  );
};

export default NewLocation;
