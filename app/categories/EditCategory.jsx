"use client";
import { Input, Button } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "./api/db";
import { useState } from "react";
import colors from "@/app/lib/colors";

export default function EditCategory({ data, setShowEditCategory }) {
  const [formError, setFormError] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateCategory,
    onMutate: async (category) => {
      await queryClient.cancelQueries({
        queryKey: ["category"],
      });
      const previousCategory = queryClient.getQueryData(["category"]);
      queryClient.setQueryData(["category"], category);
      return { previousCategory, category };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onSuccess: async () => toast.success("Category updated"),
    onError: (error) => {
      if (error.message.includes("Unique")) {
        toast.error("You already have that one");
      } else {
        toast.error(error.message);
      }
    },
  });
  const onUpdateCategory = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const color = formData.get("color");

    mutation.mutate({ name, color, id: data.id });
    setShowEditCategory(false);
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <>
      <form onSubmit={onUpdateCategory} className="max-w-[400px]">
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
        <Input
          name="color"
          type="color"
          defaultValue={data?.color}
          label="Color"
          labelPlacement="outside"
          list="colorList"
          className="w-40 block p-0 bg-transparent"
          variant="flat"
          classNames={{
            inputWrapper: "p-0 rounded-none",
            innerWrapper: "p-0",
            mainWrapper: "p-0",
          }}
        />
        <datalist id="colorList">
          {colors.map((color) => (
            <option key={color}>{color}</option>
          ))}
        </datalist>
        <Button
          variant="light"
          color="danger"
          onPress={() => setShowEditCategory(false)}
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
