"use client";
import { useState, useEffect } from "react";
import { useUserColors } from "@/app/hooks/useUserColors";
import { ColorPicker, FooterButtons } from "@/app/components";
import { mutate } from "swr";
import { sample } from "lodash";
import { TextInput } from "@mantine/core";
import { createCategory } from "@/app/lib/db";
import { notify } from "@/app/lib/handlers";
import { inputStyles } from "@/app/lib/styles";
import { isValidHex, sortObjectArray } from "@/app/lib/helpers";

const NewCategory = ({ data, close, mutateKey }) => {
  const { user, colors } = useUserColors();

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: { hex: null },
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

  const validHex = isValidHex(newCategory?.color?.hex);

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return setFormError(true);
    if (!validHex) return;
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
      notify({ message: `Created category ${newCategory?.name}` });
      setNewCategory({
        ...newCategory,
        name: "",
      });
    } catch (e) {
      notify({ isError: true });
      throw new Error(e);
    }
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
        autoFocus
      />

      <ColorPicker
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        object={newCategory}
        setObject={setNewCategory}
        hex={newCategory?.color?.hex}
        validHex={validHex}
      />
      <FooterButtons onClick={close} />
    </form>
  );
};
export default NewCategory;
