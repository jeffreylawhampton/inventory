"use client";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { createCategory } from "./api/db";
import { mutate } from "swr";
import { sample } from "lodash";
import { TextInput, ColorInput } from "@mantine/core";
import { inputStyles } from "../lib/styles";
import FooterButtons from "../components/FooterButtons";
import { useUserColors } from "../hooks/useUserColors";
import FormModal from "../components/FormModal";

const NewCategory = ({ categoryList, opened, close }) => {
  const { user } = useUserColors();
  const [newCategory, setNewCategory] = useState({
    name: "",
  });
  const [formError, setFormError] = useState(false);

  const handleInputChange = (event) => {
    event.currentTarget.name === "name" && setFormError(false);
    setNewCategory({
      ...newCategory,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return setFormError(true);
    close();

    try {
      await mutate(
        "categories",
        createCategory({ ...newCategory, userId: user.id }),
        {
          optimisticData: [
            ...categoryList,
            { ...newCategory, color: { hex: newCategory.color } },
          ],
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success("Success");
      setNewCategory({
        name: "",
        color: sample(user?.colors?.map((color) => color.hex)),
      });
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  useEffect(() => {
    setNewCategory({
      ...newCategory,
      color: sample(user?.colors?.map((color) => color.hex)),
    });
  }, [user]);

  return (
    <FormModal title="Create new category" opened={opened} close={close}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextInput
          name="name"
          label="Name"
          radius={inputStyles.radius}
          size={inputStyles.size}
          variant={inputStyles.variant}
          classNames={{
            label: inputStyles.labelClasses,
            input: formError ? "!bg-danger-100" : "",
          }}
          data-autoFocus
          error={formError}
          onBlur={(e) => validateRequired(e)}
          onFocus={() => setFormError(false)}
          value={newCategory.name}
          onChange={handleInputChange}
        />

        <ColorInput
          value={newCategory?.color}
          onChange={(e) => setNewCategory({ ...newCategory, color: e })}
          name="color"
          label="Color"
          size={inputStyles.size}
          variant={inputStyles.variant}
          swatches={user?.colors?.map((color) => color.hex)}
          radius={inputStyles.radius}
          classNames={{
            label: inputStyles.labelClasses,
          }}
        />

        <FooterButtons onClick={close} />
      </form>
    </FormModal>
  );
};

export default NewCategory;
