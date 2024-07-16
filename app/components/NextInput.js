import { Input } from "@nextui-org/react";

const NextInput = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  variant = "bordered",
  autofocus = false,
}) => {
  return (
    <Input
      type={type}
      id={label}
      label={label}
      name={name || label.toLowerCase()}
      value={value}
      onChange={onChange}
      variant={variant}
      autofocus={autofocus}
    />
  );
};

export default NextInput;
