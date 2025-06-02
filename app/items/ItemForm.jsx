"use client";
import { useContext, useState, useEffect } from "react";
import { FooterButtons, Tooltip, MultiSelect } from "@/app/components";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { IconX, IconUpload } from "@tabler/icons-react";
import { DeviceContext } from "../layout";
import { NumberInput, Select, TextInput } from "@mantine/core";
import { inputStyles } from "../lib/styles";
import { Modal } from "@mantine/core";

const ItemForm = ({
  handleSubmit,
  item,
  setItem,
  user,
  formError,
  setFormError,
  opened,
  close,
  heading,
  uploadedImages,
  setUploadedImages,
  hidden,
}) => {
  const [containerOptions, setContainerOptions] = useState(
    item?.locationId > 0
      ? user?.containers?.filter(
          (container) => container.locationId == item.locationId
        )
      : user?.containers
  );

  const { isMobile } = useContext(DeviceContext);

  const validateRequired = ({ target: { value } }) => {
    setFormError(!value.trim());
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

  const handleLocationSelect = (e) => {
    setItem({
      ...item,
      locationId: e,
      containerId: null,
    });
    setContainerOptions(
      user?.containers?.filter((container) =>
        e ? container.locationId == e : container
      )
    );
  };

  useEffect(() => {
    item?.locationId
      ? setContainerOptions(
          user?.containers?.filter(
            (container) => container.locationId == item?.locationId
          )
        )
      : setContainerOptions(user?.containers);
  }, [item, user]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      radius="lg"
      size={isMobile ? "xl" : "75%"}
      yOffset={0}
      transitionProps={{
        transition: "fade",
      }}
      overlayProps={{
        blur: 4,
      }}
      classNames={{
        inner: "!items-end md:!items-center !px-0 lg:!p-8",
        content: `${
          isMobile ? "pb-20" : "pb-5"
        } px-5 !max-h-[90vh] md:!min-w-[780px]`,
      }}
    >
      <div className="flex justify-between align-center pt-6 pb-4">
        <h1 className="text-2xl font-semibold">{heading}</h1>
        <IconX
          size={28}
          stroke={2.5}
          onClick={close}
          className="cursor-pointer transition hover:scale-[115%] active:scale-[95%]"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:grid md:grid-cols-8 gap-6">
          <TextInput
            name="name"
            label="Name"
            data-autofocus
            variant={inputStyles.variant}
            radius={inputStyles.radius}
            size={inputStyles.size}
            value={item.name}
            error={formError}
            onBlur={(e) => validateRequired(e)}
            onFocus={() => setFormError(false)}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            classNames={{
              root: "col-span-4",
              label: inputStyles.labelClasses,
              input: formError ? "!bg-danger-100" : "",
            }}
          />

          <TextInput
            name="purchasedAt"
            label="Purchased at"
            variant={inputStyles.variant}
            radius={inputStyles.radius}
            size={inputStyles.size}
            value={item?.purchasedAt}
            onChange={(e) => setItem({ ...item, purchasedAt: e.target.value })}
            classNames={{
              root: "col-span-4",
              label: inputStyles.labelClasses,
            }}
          />

          <MultiSelect
            categories={user?.categories}
            item={item}
            variant={inputStyles.variant}
            setItem={setItem}
            inputStyles={inputStyles}
            isMobile={isMobile}
            colSpan={isMobile ? "col-span-8" : "col-span-6"}
          />

          {!isMobile ? (
            <CldUploadButton
              className="bg-primary col-span-2 h-fit mt-8 py-3 rounded-xl font-semibold flex gap-1 justify-center items-center text-white"
              options={{
                multiple: true,
                apiKey: process.env.apiKey,
                cloudName: "dgswa3kpt",
                uploadPreset: "inventory",
                sources: ["local", "url", "google_drive", "dropbox"],
              }}
              onQueuesEndAction={handleUpload}
            >
              <IconUpload size={16} />
              Upload images
            </CldUploadButton>
          ) : null}

          <TextInput
            label="Description"
            radius={inputStyles.radius}
            size={inputStyles.size}
            value={item?.description}
            variant={inputStyles.variant}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            classNames={{
              root: "col-span-8",
              label: inputStyles.labelClasses,
            }}
          />

          <NumberInput
            label="Value"
            name="value"
            radius={inputStyles.radius}
            size={inputStyles.size}
            variant={inputStyles.variant}
            value={parseFloat(item?.value) || 0}
            prefix="$"
            onChange={(e) => setItem({ ...item, value: e.toString() })}
            classNames={{
              root: "col-span-2",
              label: inputStyles.labelClasses,
            }}
          />

          <TextInput
            label="Serial number"
            name="serialNumber"
            variant={inputStyles.variant}
            radius={inputStyles.radius}
            size={inputStyles.size}
            value={item?.serialNumber}
            onChange={(e) => setItem({ ...item, serialNumber: e.target.value })}
            classNames={{
              root: "col-span-4",
              label: inputStyles.labelClasses,
            }}
          />

          <NumberInput
            label="Quantity"
            name="quantity"
            variant={inputStyles.variant}
            radius={inputStyles.radius}
            classNames={{
              root: "col-span-2",
              label: inputStyles.labelClasses,
            }}
            allowNegative={false}
            allowDecimal={true}
            size={inputStyles.size}
            value={parseFloat(item?.quantity) || 1}
            onChange={(e) => setItem({ ...item, quantity: e.toString() })}
          />

          {hidden?.includes("locationId") ? null : (
            <Select
              label="Location"
              placeholder={isMobile ? "" : "Type to search"}
              variant={inputStyles.variant}
              size={inputStyles.size}
              searchable={!isMobile}
              clearable
              classNames={{
                root: "col-span-4",
                label: inputStyles.labelClasses,
              }}
              radius={inputStyles.radius}
              onChange={handleLocationSelect}
              value={item?.locationId?.toString()}
              data={user?.locations?.map((location) => {
                return {
                  value: location.id.toString(),
                  label: location.name,
                };
              })}
            />
          )}
          {hidden?.includes("containerId") ? null : (
            <Select
              label="Container"
              placeholder={isMobile ? "" : "Type to search"}
              variant={inputStyles.variant}
              size={inputStyles.size}
              searchable={!isMobile}
              clearable
              nothingFoundMessage="No containers in this location"
              radius={inputStyles.radius}
              classNames={{
                root: "col-span-4",
                label: inputStyles.labelClasses,
                empty: inputStyles.empty,
              }}
              onChange={(e) =>
                setItem({
                  ...item,
                  containerId: e,
                })
              }
              value={item?.containerId}
              data={containerOptions?.map((container) => {
                return {
                  value: container.id.toString(),
                  label: container.name,
                };
              })}
            />
          )}

          {isMobile ? (
            <CldUploadButton
              className="bg-primary col-span-2 h-fit mt-6 py-3 rounded-xl font-semibold flex gap-1 justify-center items-center text-white"
              options={{
                multiple: true,
                apiKey: process.env.apiKey,
                cloudName: "dgswa3kpt",
                uploadPreset: "inventory",
                sources: ["local", "url", "google_drive", "dropbox"],
              }}
              onQueuesEndAction={handleUpload}
            >
              <IconUpload size={16} />
              Upload images
            </CldUploadButton>
          ) : null}
        </div>
        <div className="flex gap-2 my-4">
          {uploadedImages?.map((image) => (
            <div key={image.url} className="relative">
              <div
                className="absolute top-1 right-1 z-40 bg-black h-5 w-5 rounded-full text-white flex items-center justify-center"
                onClick={handleRemoveUpload}
              >
                <Tooltip label="Remove image" position="top">
                  <IconX
                    strokeWidth={3}
                    className="w-4"
                    aria-label="Remove image"
                  />
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
        <FooterButtons onClick={close} />
      </form>
    </Modal>
  );
};

export default ItemForm;
