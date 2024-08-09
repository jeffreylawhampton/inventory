"use client";
import { Input, Button } from "@nextui-org/react";
import { updateCategory } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import colors from "@/app/lib/colors";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EditCategory({ data, setShowEditCategory, id, user }) {
  const [formError, setFormError] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    id: data?.id || undefined,
    name: data?.name || "",
    color: data?.color || "#ff4612",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formError) return;
    if (
      editedCategory?.name === data?.name &&
      editedCategory?.color === data?.color
    )
      return setShowEditCategory(false);
    try {
      await mutate(
        `categories${id}`,
        updateCategory({ ...editedCategory, userId: user.id }),
        {
          optimisticData: { ...editedCategory, items: data?.items },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      router.replace(`/categories/${id}?name=${editedCategory.name}`, {
        shallow: true,
      });
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowEditCategory(false);
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-[400px]">
        <Input
          name="name"
          size="lg"
          isRequired
          radius="none"
          aria-label="Name"
          label="Name"
          value={editedCategory?.name}
          onChange={(e) =>
            setEditedCategory({ ...editedCategory, name: e.target.value })
          }
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
          variant="flat"
          value={editedCategory?.color}
          onChange={(e) =>
            setEditedCategory({ ...editedCategory, color: e.target.value })
          }
          label="Color"
          placeholder=" "
          list="colorList"
          defaultValue={data?.color}
          className="w-40 block p-0 bg-transparent"
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
