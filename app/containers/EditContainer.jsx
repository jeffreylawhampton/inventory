"use client";
import { Input, Button } from "@nextui-org/react";
import { updateContainer } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";

export default function EditContainer({ data, setShowEditContainer, id }) {
  const [formError, setFormError] = useState(false);
  const [editedContainer, setEditedContainer] = useState({
    name: data?.name,
    id: data?.id,
  });

  const onUpdateContainer = async (e) => {
    e.preventDefault();
    try {
      await mutate(`container${id}`, updateContainer(editedContainer), {
        optimisticData: editedContainer,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowEditContainer(false);
    setEditedContainer({});
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <>
      <form onSubmit={onUpdateContainer} className="max-w-[400px]">
        <Input
          name="name"
          size="lg"
          isRequired
          radius="none"
          aria-label="Name"
          value={editedContainer?.name}
          onChange={(e) =>
            setEditedContainer({ ...editedContainer, name: e.target.value })
          }
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
          onPress={() => setShowEditContainer(false)}
        >
          Cancel
        </Button>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
}
