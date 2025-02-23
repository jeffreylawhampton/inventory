"use client";
import { useState } from "react";
import { Button, ColorPicker } from "@mantine/core";
import { createColor } from "./api/db";

const CreateColor = ({ userId, data, mutate }) => {
  const [color, setColor] = useState("");
  const handleSubmit = async () => {
    data.colors.push({ hex: color });
    await mutate("/api/user", createColor({ hex: color, userId }), {
      optimisticData: data,
      rollbackOnError: true,
      populateCache: false,
      revalidate: true,
    });
  };

  return (
    <div className="bg-gray-100 drop-shadow-lg p-2 w-fit">
      <ColorPicker onChangeEnd={setColor} color={color} />
      <Button onClick={handleSubmit}>Create</Button>
    </div>
  );
};

export default CreateColor;
