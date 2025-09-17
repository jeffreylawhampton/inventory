"use client";
import { useState } from "react";
import { useUserColors } from "../../hooks/useUserColors";
import { FooterButtons } from "@/app/components";
import { TextInput } from "@mantine/core";
import { updateCategory } from "@/app/lib/db";
import { mutate } from "swr";
import { inputStyles } from "../../lib/styles";
import { notify } from "@/app/lib/handlers";
import ColorAndIcon from "./ColorAndIcon";

export default function EditCategory({ data, close, mutateKey }) {
  const [formError, setFormError] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    id: data?.id || undefined,
    name: data?.name || "",
    color: data?.color || { hex: "#ff4612" },
    favorite: data?.favorite || false,
    icon: data?.icon,
  });

  const { colors, user } = useUserColors();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) return;
    if (
      editedCategory?.name === data?.name &&
      editedCategory?.color === data?.color
    )
      return close();

    try {
      await mutate(
        mutateKey,
        updateCategory({ ...editedCategory, userId: user?.id }),
        {
          optimisticData: {
            ...editedCategory,
            items: data?.items,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      close();
      notify({ message: `${data?.name} updated` });
    } catch (e) {
      notify({ message: "Something went wrong" });
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
      <ColorAndIcon
        object={editedCategory}
        setObject={setEditedCategory}
        swatches={colors}
        type="category"
      />
      <FooterButtons onClick={close} />
    </form>
  );
}
