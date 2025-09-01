"use client";
import { useState } from "react";
import { useUserColors } from "../../hooks/useUserColors";
import { ColorInput, FooterButtons } from "@/app/components";
import { ColorSwatch, TextInput } from "@mantine/core";
import { inputStyles } from "../../lib/styles";

export default function CategoryForm({
  category,
  data,
  close,
  showColor = false,
  handleSubmit,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [formError, setFormError] = useState(false);
  const [editedCategory, setEditedCategory] = useState({ ...category });

  const { colors } = useUserColors();

  const handleSetColor = (e) => {
    setEditedCategory({ ...editedCategory, color: { hex: e } });
  };

  const handleCancel = () => {
    setEditedCategory({ ...editedCategory, color: data.color });
    setShowPicker(false);
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim().length ? false : true);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit({ editedCategory, category, data, formError, close });
      }}
      className="flex flex-col gap-5"
    >
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

      {showColor ? (
        <>
          {" "}
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
        </>
      ) : null}
      <FooterButtons onClick={close} />
    </form>
  );
}
