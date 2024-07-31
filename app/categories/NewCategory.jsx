"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { createCategory } from "./api/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 } from "uuid";
import colors from "../lib/colors";

const blankCategory = {
  name: "",
  color: "#999999",
};

const NewCategory = ({ isOpen, onOpenChange, onClose }) => {
  const [newCategory, setNewCategory] = useState(blankCategory);
  const [formError, setFormError] = useState(false);

  const queryClient = useQueryClient();

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewCategory({
      ...newCategory,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const mutation = useMutation({
    mutationFn: createCategory,
    onMutate: async (newCategory) => {
      onClose();
      setNewCategory(blankCategory);
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData(["categories"]);
      const optimistic = {
        id: v4(),
        name: newCategory.name,
        color: newCategory.color,
      };
      queryClient.setQueryData(["categories"], (data) => [...data, optimistic]);
      return { previousCategories };
    },
    onError: (err, newCategory, context) => {
      queryClient.setQueryData(["categories"], context.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onSuccess: async () => toast.success("Success"),
    onError: (error) => {
      if (error.message.includes("Unique")) {
        toast.error("You already have that one");
      } else {
        toast.error(error.message);
      }
    },
  });

  const onCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name) return setFormError(true);
    mutation.mutate(newCategory);
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  return (
    isOpen && (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-xl font-semibold">
                  New category
                </ModalHeader>
                <form onSubmit={onCreateCategory}>
                  <ModalBody>
                    <Input
                      name="name"
                      label="Name"
                      placeholder="New category name"
                      labelPlacement="outside"
                      radius="sm"
                      variant="flat"
                      size="lg"
                      autoFocus
                      value={newCategory.name}
                      onChange={handleInputChange}
                      onBlur={(e) => validateRequired(e)}
                      onFocus={() => setFormError(false)}
                      isInvalid={formError}
                      validationBehavior="aria"
                      className="pb-6"
                      classNames={{ label: "font-semibold" }}
                    />
                    <Input
                      name="color"
                      type="color"
                      defaultValue={newCategory?.color}
                      label="Color"
                      size="lg"
                      radius="sm"
                      labelPlacement="outside"
                      onChange={handleInputChange}
                      list="colorList"
                      className="bg-transparent"
                      variant="flat"
                      classNames={{
                        inputWrapper: "p-0 rounded-none bg-transparent",
                        innerWrapper: "p-0",
                        mainWrapper: "p-0 bg-transparent",
                        label: "font-semibold",
                      }}
                    />
                    <datalist id="colorList">
                      {colors.map((color) => (
                        <option key={color}>{color}</option>
                      ))}
                    </datalist>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
  );
};

export default NewCategory;
