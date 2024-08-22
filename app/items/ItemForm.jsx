"use client";
import { CldUploadButton } from "next-cloudinary";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select as NextSelect,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import CategorySelect from "../components/CategorySelect";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { DeviceContext } from "../layout";
import { useContext } from "react";

const ItemForm = ({
  handleSubmit,
  item,
  setItem,
  user,
  formError,
  setFormError,
  isOpen,
  onOpenChange,
  onClose,
  heading,
  uploadedImages,
  setUploadedImages,
}) => {
  const initialItem = { ...item };
  const device = useContext(DeviceContext);

  const handleCancel = () => {
    onClose();
    setItem(initialItem);
  };
  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
  };

  const handleInputChange = (event) => {
    event.target.name === "name" && setFormError(false);
    setItem({
      ...item,
      [event.target.name]: event.target.value,
    });
  };

  const handleCategoriesChange = (e) => {
    const selected = e?.map((category) => category.value);
    setItem({ ...item, categories: selected });
  };

  const handleUpload = (results) => {
    setUploadedImages(results?.info?.files?.map((file) => file?.uploadInfo));
  };

  const handleRemoveUpload = (id) => {
    setItem({
      ...item,
      images: item.images.filter((img) => img.id != id),
    });
  };

  const textInputs = [
    {
      name: "name",
      label: "Name",
      span: "col-span-2",
      validate: true,
      classNames: { label: "font-semibold" },
    },
    { name: "purchasedAt", label: "Purchased at", span: "col-span-2" },
    { name: "description", label: "Description", span: "col-span-4" },
    { name: "quantity", label: "Quantity", span: "col-span-1", type: "number" },
    { name: "serialNumber", label: "Serial number", span: "col-span-2" },
    { name: "value", label: "Value", span: "col-span-1" },
  ];

  const inputs = textInputs.map((input) => {
    return (
      <Input
        key={input.name}
        name={input.name}
        label={input.label}
        labelPlacement="outside"
        placeholder=" "
        radius="sm"
        variant="flat"
        size="lg"
        value={item[input.name]}
        onChange={handleInputChange}
        type={input.type || "text"}
        isInvalid={input.validate && formError}
        validationBehavior="aria"
        classNames={input.classNames}
        className={input.span}
        onBlur={input.validate ? (e) => validateRequired(e) : null}
        onFocus={input.validate ? () => setFormError(false) : null}
      />
    );
  });

  return (
    isOpen && (
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="5xl"
          scrollBehavior={device === "desktop" ? "outside" : "inside"}
          placement="bottom-center"
          backdrop="blur"
          classNames={{
            backdrop: "bg-black bg-opacity-80",
            base: "px-4 py-8",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-xl font-semibold">
              {heading}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:grid md:grid-cols-4 gap-6">
                  {inputs}

                  <NextSelect
                    label="Container"
                    name="containerId"
                    labelPlacement="outside"
                    className="col-span-2"
                    placeholder="Select"
                    size="lg"
                    defaultSelectedKeys={[item?.containerId?.toString()]}
                    value={item.containerId || ""}
                    onChange={handleInputChange}
                  >
                    {user?.containers?.map((container) => (
                      <SelectItem
                        key={container.id}
                        aria-label={container.name}
                      >
                        {container.name}
                      </SelectItem>
                    ))}
                  </NextSelect>

                  <NextSelect
                    label="Location"
                    placeholder="Select"
                    labelPlacement="outside"
                    size="lg"
                    className="col-span-2"
                    name="locationId"
                    value={item.locationId || ""}
                    defaultSelectedKeys={[item?.locationId?.toString()]}
                    onChange={handleInputChange}
                  >
                    {user?.locations?.map((location) => (
                      <SelectItem key={location.id}>{location.name}</SelectItem>
                    ))}
                  </NextSelect>

                  <CategorySelect
                    onChange={handleCategoriesChange}
                    userCategories={user?.categories}
                    colspan={3}
                    className="col-span-3"
                    defaultValue={item?.categories?.map((category) => {
                      const userCategory = user?.categories?.find(
                        (cat) => cat.id === category
                      );
                      return {
                        value: userCategory?.id,
                        color: userCategory?.color,
                        label: userCategory?.name,
                        key: userCategory?.id,
                      };
                    })}
                  />

                  <CldUploadButton
                    className="bg-info-500 h-fit mt-7 py-3 rounded-xl font-semibold flex gap-1 justify-center items-center text-white"
                    options={{
                      multiple: true,
                      apiKey: process.env.apiKey,
                      cloudName: "dgswa3kpt",
                      uploadPreset: "inventory",
                      sources: ["local", "url", "google_drive", "dropbox"],
                    }}
                    onQueuesEndAction={handleUpload}
                  >
                    <Upload size={16} />
                    Upload images
                  </CldUploadButton>
                </div>
                <div className="flex gap-2 my-4">
                  {uploadedImages?.map((image) => (
                    <div key={image.url} className="relative">
                      <div
                        className="absolute top-1 right-1 z-40 bg-black h-5 w-5 rounded-full text-white flex items-center justify-center"
                        onClick={handleRemoveUpload}
                      >
                        <Tooltip content="Remove image">
                          <X className="w-4" aria-label="Remove image" />
                        </Tooltip>
                      </div>
                      <Image
                        key={image.url}
                        src={image.thumbnail_url}
                        width={80}
                        height={80}
                        alt=""
                        className="rounded-xl"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button color="danger" variant="light" onPress={handleCancel}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  );
};

export default ItemForm;
