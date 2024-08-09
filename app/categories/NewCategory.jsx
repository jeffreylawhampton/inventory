"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import { createCategory } from "./api/db";
import colors from "../lib/colors";
import { mutate } from "swr";
import { useUser } from "../hooks/useUser";
import { sample } from "lodash";

const NewCategory = ({ categoryList, isOpen, onOpenChange, onClose }) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: sample(colors),
  });
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
    onClose();
    setNewCategory({ name: "", color: sample(colors) });
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
      throw new Error(e);
    }
  };

  return (
    isOpen && (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-xl font-semibold">
                  New category
                </ModalHeader>
                <form onSubmit={handleSubmit}>
                  <ModalBody>
                    <Input
                      name="name"
                      label="Name"
                      placeholder=" "
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
                      placeholder=" "
                      value={newCategory?.color}
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
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit">
                        Submit
                      </Button>
                    </ModalFooter>
                  </ModalBody>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
  );
  //   <>
  //     <form className="max-w-[400px]" onSubmit={handleSubmit}>
  //      <Input
  //      name="name"
  //         label="Name"
  //         placeholder="New category name"
  //         labelPlacement="outside"
  //         radius="sm"
  //         variant="flat"
  //         size="lg"
  //         autoFocus
  //         value={newCategory.name}
  //         onChange={handleInputChange}
  //         onBlur={(e) => validateRequired(e)}
  //         onFocus={() => setFormError(false)}
  //         isInvalid={formError}
  //         validationBehavior="aria"
  //         className="pb-6"
  //         classNames={{ label: "font-semibold" }}
  //       />
  //       <Input
  //         name="color"
  //         type="color"
  //         defaultValue={newCategory?.color}
  //         label="Color"
  //         size="lg"
  //         radius="sm"
  //         labelPlacement="outside"
  //         onChange={handleInputChange}
  //          list="colorList"
  //          className="bg-transparent"
  //          variant="flat"
  //          classNames={{
  //            inputWrapper: "p-0 rounded-none bg-transparent",
  //            innerWrapper: "p-0",
  //            mainWrapper: "p-0 bg-transparent",
  //            label: "font-semibold",
  //          }}
  //        />
  //        <datalist id="colorList">
  //          {colors.map((color) => (
  //            <option key={color}>{color}</option>
  //          ))}
  //        </datalist>
  //        <Button
  //          color="danger"
  //          variant="light"
  //          onPress={() => setShowNewCategory(false)}
  //        >
  //          Cancel
  //        </Button>
  //        <Button color="primary" type="submit">
  //          Submit
  //        </Button>
  //      </form>
  //    </>
  //  );
};

export default NewCategory;
