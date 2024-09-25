"use client";
import toast from "react-hot-toast";
import { useState, useContext } from "react";
import { createLocation } from "./api/db";
import { mutate } from "swr";
import { TextInput } from "@mantine/core";
import { inputStyles } from "../lib/styles";
import FooterButtons from "../components/FooterButtons";
import CreateButton from "../components/CreateButton";
import { DeviceContext } from "../layout";
import FormModal from "../components/FormModal";

const NewLocation = ({ locationList, opened, close }) => {
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
      await mutate("locations", createLocation(newLocation), {
        optimisticData: [...locationList, newLocation].sort(
          (a, b) => a.name - b.name
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
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
      <CreateButton onClick={open} tooltipText="Create new location" />
    </>
  );
};

export default NewLocation;
