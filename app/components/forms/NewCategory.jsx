"use client";
import { useState, useEffect } from "react";

import { useUserColors } from "@/app/hooks/useUserColors";
import { ColorInput, FooterButtons } from "@/app/components";
import toast from "react-hot-toast";
import { createCategory } from "@/app/categories/api/db";
import { mutate } from "swr";
import { sample } from "lodash";
import { TextInput, ColorSwatch } from "@mantine/core";
import { inputStyles } from "@/app/lib/styles";
import { sortObjectArray } from "@/app/lib/helpers";

const NewCategory = ({ data, close, mutateKey }) => {
  const { user, colors } = useUserColors();

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
        mutateKey,
        createCategory({ ...newCategory, userId: user.id }),
        {
          optimisticData: sortObjectArray([...data, newCategory]),
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
      color: {
        hex: sample(colors),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
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
          colors={colors}
          handleSetColor={handleSetColor}
          setShowPicker={setShowPicker}
          setNewCategory={setNewCategory}
          handleCancel={handleCancel}
        />
      ) : null}

      <FooterButtons onClick={close} />
    </form>
  );
};

export default NewCategory;
