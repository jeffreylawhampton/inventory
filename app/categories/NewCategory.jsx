"use client";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { createCategory } from "./api/db";
import { mutate } from "swr";
import { sample } from "lodash";
import { TextInput, ColorSwatch } from "@mantine/core";
import { inputStyles } from "../lib/styles";
import FooterButtons from "../components/FooterButtons";
import { useUserColors } from "../hooks/useUserColors";
import FormModal from "../components/FormModal";
import ColorInput from "../components/ColorInput";
import { sortObjectArray } from "../lib/helpers";

const NewCategory = ({ categoryList, opened, close }) => {
  const { user } = useUserColors();
  const [newCategory, setNewCategory] = useState({
    name: "",
  });
  const [formError, setFormError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

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

  const handleCancel = () => {
    setShowPicker(false);
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
          optimisticData: sortObjectArray([...categoryList, newCategory]),
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success("Success");
      setNewCategory({
        ...newCategory,
        name: "",
      });
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleSetColor = (e) => {
    setNewCategory({ ...newCategory, color: { hex: e } });
  };

  useEffect(() => {
    setNewCategory({
      ...newCategory,
      color: { hex: sample(user?.colors?.map((color) => color.hex)) },
    });
  }, [user]);

  return (
    <FormModal title="Create new category" opened={opened} close={close}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative">
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
        <TextInput
          name="color"
          label="Color"
          radius={inputStyles.radius}
          size={inputStyles.size}
          variant={inputStyles.variant}
          classNames={{
            label: inputStyles.labelClasses,
          }}
          value={newCategory?.color?.hex}
          onClick={() => setShowPicker(!showPicker)}
          leftSection={
            <ColorSwatch
              color={newCategory?.color?.hex}
              onClick={() => setShowPicker(!showPicker)}
            />
          }
        />
        {showPicker ? (
          <ColorInput
            color={newCategory?.color?.hex}
            colors={user?.colors?.map((color) => color.hex)}
            handleSetColor={handleSetColor}
            setShowPicker={setShowPicker}
            setNewCategory={setNewCategory}
            handleCancel={handleCancel}
          />
        ) : null}

        <FooterButtons onClick={close} />
      </form>
    </FormModal>
  );
};

export default NewCategory;
