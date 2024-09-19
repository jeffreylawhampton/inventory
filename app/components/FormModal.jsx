"use client";

import { Modal } from "@mantine/core";

const FormModal = ({ opened, close, size = "lg", title, children }) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={title}
      radius="lg"
      size={size}
      yOffset={0}
      transitionProps={{
        transition: "fade",
      }}
      overlayProps={{
        blur: 4,
      }}
      classNames={{
        title: "!font-semibold !text-xl",
        inner: "!items-end md:!items-center !px-0 lg:!p-8",
        content: "py-4 px-2",
      }}
    >
      {children}
    </Modal>
  );
};

export default FormModal;
