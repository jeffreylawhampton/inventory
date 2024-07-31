"use client";
import { Input, Button } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContainer } from "./api/db";
import { useState } from "react";

export default function EditContainer({ data, setShowEditContainer }) {
  const [formError, setFormError] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateContainer,
    onMutate: async (container) => {
      await queryClient.cancelQueries({
        queryKey: ["container"],
      });
      const previousContainer = queryClient.getQueryData(["container"]);
      queryClient.setQueryData(["container"], container);
      return { previousContainer, container };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["container"] });
    },
    onSuccess: async () => toast.success("Container updated"),
    onError: (error) => {
      if (error.message.includes("Unique")) {
        toast.error("You already have that one");
      } else {
        toast.error(error.message);
      }
    },
  });
  const onUpdateContainer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");

    mutation.mutate({ name, id: data.id });
    setShowEditContainer(false);
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
