import { forwardRef } from "react";
import { Modal as MantineModal, ScrollArea } from "@mantine/core";

export default function Modal({
  opened,
  close,
  currentModal,
  setFilter,
  isMobile,
  keyboardOpen,
  viewportHeight,
}) {
  const ModalScrollArea = forwardRef(function ModalScrollArea(props, ref) {
    return (
      <ScrollArea.Autosize
        ref={ref}
        offsetScrollbars
        scrollbarSize={14}
        type={isMobile ? "never" : "hover"}
        classNames={{
          thumb: "!bg-bluegray-500",
          root: "!max-h-[94vh]",
          viewport: "!pr-0",
        }}
        {...props}
      />
    );
  });

  const onCloseModal = () => {
    setFilter("");
    close();
  };

  return (
    <MantineModal
      opened={opened}
      onClose={onCloseModal}
      withCloseButton={false}
      radius="lg"
      size={currentModal.size}
      yOffset={0}
      transitionProps={{
        transition: "fade",
      }}
      overlayProps={{
        blur: 4,
      }}
      classNames={{
        inner: "!items-end md:!items-center !px-0 lg:!p-8 !z-[220]",
        content: "pb-4 pt-3 px-2 !overflow-hidden",
      }}
      styles={{
        root: {
          maxHeight: keyboardOpen ? viewportHeight : null,
          top: keyboardOpen ? 0 : null,
        },
      }}
      scrollAreaComponent={ModalScrollArea}
    >
      <h2 className="!text-2xl !font-semibold mt-1 mb-4">
        {currentModal?.title}
      </h2>
      {currentModal.component}
    </MantineModal>
  );
}
