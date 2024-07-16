"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { upsertCategory } from "../actions";

const CategoryForm = ({ category, user, openLabel }) => {
  const [newCategory, setNewCategory] = useState({
    id: category?.id || null,
    name: category?.name || "",
    color: category?.color || "",
    userId: user.id,
  });

  const [error, setError] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (e) => {
    if (newCategory.name) {
      upsertCategory(newCategory);
      onOpenChange();
    } else {
      e.preventDefault();
      setError("Please enter a name");
    }
  };

  const handleInputChange = (event) => {
    setNewCategory({
      ...newCategory,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  return (
    <>
      <Button onPress={onOpen}>{openLabel}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {openLabel}
              </ModalHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <ModalBody>
                  {error}

                  <Input
                    label="Category name"
                    name="name"
                    onChange={handleInputChange}
                    value={newCategory.name}
                    autoFocus
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={(e) => handleSubmit}
                    type="submit"
                  >
                    Create
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CategoryForm;
