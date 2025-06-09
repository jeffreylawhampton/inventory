"use client";
import { useState } from "react";
import { useUserColors } from "../../hooks/useUserColors";
import { ColorInput, FooterButtons } from "@/app/components";
import { ColorSwatch, TextInput } from "@mantine/core";
import { updateCategory } from "@/app/lib/db";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { inputStyles } from "../../lib/styles";

export default function EditCategory({ data, close, mutateKey }) {
  const [formError, setFormError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    id: data?.id || undefined,
    name: data?.name || "",
    color: data?.color || { hex: "#ff4612" },
    favorite: data?.favorite || false,
  });

  const { colors } = useUserColors();

  const handleSetColor = (e) => {
    setEditedCategory({ ...editedCategory, color: { hex: e } });
  };

  const handleCancel = () => {
    setEditedCategory({ ...editedCategory, color: data.color });
    setShowPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) return;
    if (
      editedCategory?.name === data?.name &&
      editedCategory?.color === data?.color
    )
      return close();
    try {
      await mutate(mutateKey, updateCategory({ ...editedCategory }), {
        optimisticData: {
          ...editedCategory,
          items: data?.items,
          color: { hex: editedCategory.color },
        },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      close();
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <TextInput
        name="name"
        label="Name"
        autoFocus
        radius={inputStyles.radius}
        size={inputStyles.size}
        value={editedCategory.name}
        variant={inputStyles.variant}
        onChange={(e) =>
          setEditedCategory({
            ...editedCategory,
            name: e.target.value,
          })
        }
        onBlur={(e) => validateRequired(e)}
        onFocus={() => setFormError(false)}
        error={formError}
        classNames={{
          label: inputStyles.labelClasses,
          input: formError ? "!bg-danger-100" : "",
        }}
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
        value={editedCategory?.color?.hex}
        onChange={(e) =>
          setEditedCategory({ ...editedCategory, color: { hex: e } })
        }
        onClick={() => setShowPicker(!showPicker)}
        leftSection={
          <ColorSwatch
            color={editedCategory?.color?.hex}
            onClick={() => setShowPicker(!showPicker)}
          />
        }
      />
      {showPicker ? (
        <ColorInput
          color={editedCategory?.color?.hex}
          handleSetColor={handleSetColor}
          setShowPicker={setShowPicker}
          colors={colors}
          handleCancel={handleCancel}
        />
      ) : null}
      <FooterButtons onClick={close} />
    </form>
  );
}
