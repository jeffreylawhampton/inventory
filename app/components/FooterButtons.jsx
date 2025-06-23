"use client";
import { Button } from "@mantine/core";

const FooterButtons = ({ onClick, handleSubmit }) => {
  return (
    <div className="flex gap-2 justify-end">
      <Button variant="subtle" color="danger" onClick={onClick}>
        Cancel
      </Button>
      <Button
        type={handleSubmit ? null : "submit"}
        onClick={handleSubmit ? handleSubmit : null}
        variant="filled"
        color="black"
      >
        Submit
      </Button>
    </div>
  );
};

export default FooterButtons;
