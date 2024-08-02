"use client";
import { Input, Button } from "@nextui-org/react";
import { updateLocation } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";

export default function EditLocation({ data, setShowEditLocation, id }) {
  const [formError, setFormError] = useState(false);
  const [editedLocation, setEditedLocation] = useState({
    name: data.name,
    id: data.id,
  });

  const handleInputChange = (e) => {
    setEditedLocation({ ...editedLocation, [e.target.name]: e.target.value });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mutate(`location${id}`, updateLocation(editedLocation), {
        optimisticData: editedLocation,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
      setShowEditLocation(false);
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-[400px]">
        <Input
          name="name"
          size="lg"
          isRequired
          radius="none"
          label="Name"
          aria-label="Name"
          value={editedLocation.name}
          onChange={handleInputChange}
          variant="underlined"
          className="font-bold text-2xl w-fit"
          onBlur={(e) => validateRequired(e)}
          onFocus={() => setFormError(false)}
          isInvalid={formError}
          validationBehavior="aria"
          autoFocus
          classNames={{
            input: "text-3xl font-bold ",
            inputWrapper: "!px-0",
          }}
        />

        <Button
          variant="light"
          color="danger"
          aria-label="Cancel"
          onPress={() => setShowEditLocation(false)}
        >
          Cancel
        </Button>
        <Button aria-label="Submit" type="submit" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
}
