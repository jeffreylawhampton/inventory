"use client";
import {
  Input,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import { updateCategory } from "./api/db";
import { useState } from "react";
import { mutate } from "swr";
import colors from "@/app/lib/colors";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EditCategory({ data, id, isOpen, onOpenChange }) {
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
      return onOpenChange();
    try {
      await mutate(`categories${id}`, updateCategory(editedCategory), {
        optimisticData: { ...editedCategory, items: data?.items },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      router.replace(`/categories/${id}?name=${editedCategory.name}`, {
        shallow: true,
      });
      onOpenChange();
      toast.success("Success");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    onOpenChange();
  };

  const handleInputChange = (e) => {
    setEditedCategory({ ...editedCategory, [e.target.name]: e.target.value });
  };

  const validateRequired = ({ target: { value } }) => {
    setFormError(value.trim() ? false : true);
  };
  return (
    isOpen && (
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="xl"
          placement="bottom-center"
          backdrop="blur"
          classNames={{
            backdrop: "bg-black bg-opacity-80",
            base: "px-4 py-8",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-xl font-semibold">
                  Edit category
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit}>
                    <Input
                      name="name"
                      label="Name"
                      placeholder=" "
                      labelPlacement="outside"
                      radius="sm"
                      variant="flat"
                      size="lg"
                      autoFocus
                      value={editedCategory?.name}
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
                      value={editedCategory?.color}
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
                      <Button
                        variant="light"
                        color="danger"
                        onPress={onOpenChange}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                    </ModalFooter>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
  );
}
