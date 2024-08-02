"use client";
import { Button, Input } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { createCategory } from "./api/db";
import colors from "../lib/colors";
import { mutate } from "swr";
import { useUser } from "../hooks/useUser";

const NewCategory = ({ setShowNewCategory, categoryList }) => {
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [formError, setFormError] = useState(false);

  const { user } = useUser();

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
    setShowNewCategory(false);
    try {
      await mutate(
        "categories",
        createCategory({ ...newCategory, userId: user.id }),
        {
          optimisticData: [...categoryList, newCategory],
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
        <Button
          color="danger"
          variant="light"
          onPress={() => setShowNewCategory(false)}
        >
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};

export default NewCategory;
