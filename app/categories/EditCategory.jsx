"use client";
import { TextInput, ColorInput } from "@mantine/core";
import { updateCategory } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { inputStyles } from "../lib/styles";
import FormModal from "../components/FormModal";
import FooterButtons from "../components/FooterButtons";

export default function EditCategory({ data, id, opened, close, user }) {
  const [formError, setFormError] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    id: data?.id || undefined,
    name: data?.name || "",
    color: data?.color.hex || "#ff4612",
  });

  const router = useRouter();

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
        `categories${id}`,
        updateCategory({ ...editedCategory, userId: user?.id }),
        {
          optimisticData: {
            ...editedCategory,
            items: data?.items,
            color: { hex: editedCategory.color },
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      router.replace(`/categories/${id}?name=${editedCategory.name}`, {
        shallow: true,
      });
      close();
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    close();
  };

  const handleInputChange = (e) => {
    setEditedCategory({ ...editedCategory, [e.target.name]: e.target.value });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };

  return (
    <FormModal opened={opened} close={close} title="Edit category">
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

        <ColorInput
          value={editedCategory?.color}
          onChange={(e) => setEditedCategory({ ...editedCategory, color: e })}
          name="color"
          label="Color"
          variant={inputStyles.variant}
          size={inputStyles.size}
          radius={inputStyles.radius}
          swatches={user?.colors?.map((color) => color.hex)}
          classNames={{
            label: inputStyles.labelClasses,
          }}
        />
        <FooterButtons onClick={close} />
      </form>
    </FormModal>
  );
}
