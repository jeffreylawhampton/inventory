"use client";
import { Button } from "@mantine/core";

const FooterButtons = ({ onClick }) => {
  return (
    <div className="flex gap-2 justify-end">
      <Button variant="subtle" color="danger" onClick={onClick}>
        Cancel
      </Button>
      <Button type="submit" variant="filled" color="black">
        Submit
      </Button>
    </div>
  );
};

export default FooterButtons;
