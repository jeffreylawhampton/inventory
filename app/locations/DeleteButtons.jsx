import { useContext } from "react";
import { Button } from "@mantine/core";
import { DeviceContext } from "../layout";

const DeleteButtons = ({ handleCancel, handleDelete, count }) => {
  const { isMobile } = useContext(DeviceContext);
  return (
    <div
      className={`flex gap-2 absolute bg-white border border-bluegray-200 p-6 rounded-sm shadow-md
        ${isMobile ? "bottom-32 right-8" : "bottom-6 right-32"}
        `}
    >
      <Button onClick={handleCancel} variant="subtle" color="black">
        Cancel
      </Button>

      <Button
        className=""
        onClick={handleDelete}
        color="danger.3"
        disabled={!count}
      >
        Delete {count} objects
      </Button>
    </div>
  );
};

export default DeleteButtons;
