"use client";
import { Input, Button } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLocation } from "./api/db";
import { useState } from "react";

export default function EditLocation({ data, setShowEditLocation }) {
  const [formError, setFormError] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateLocation,
    onMutate: async (location) => {
      await queryClient.cancelQueries({
        queryKey: ["location"],
      });
      const previousLocation = queryClient.getQueryData(["location"]);
      queryClient.setQueryData(["location"], location);
      return { previousLocation, location };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["location"] });
    },
    onSuccess: async () => toast.success("location updated"),
    onError: (error) => {
      if (error.message.includes("Unique")) {
        toast.error("You already have that one");
      } else {
        toast.error(error.message);
      }
    },
  });
  const onUpdateLocation = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");

    mutation.mutate({ name, id: data.id });
    setShowEditLocation(false);
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <>
      <form onSubmit={onUpdateLocation} className="max-w-[400px]">
        <Input
          name="name"
          size="lg"
          isRequired
          radius="none"
          aria-label="Name"
          defaultValue={data?.name}
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
          onPress={() => setShowEditLocation(false)}
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
