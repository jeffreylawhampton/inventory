import { useContext } from "react";
import { Modal } from "@mantine/core";
import { LocationContext } from "./layout";

const FormModal = ({ opened, close }) => {
  const { currentModal } = useContext(LocationContext);

  return (
    <Modal opened={opened} onClose={close}>
      {currentModal}
    </Modal>
  );
};

export default FormModal;
