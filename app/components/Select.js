import { Select as NextSelect, SelectItem } from "@nextui-org/react";

export default function Select(items, label, onChange) {
  return (
    <Select label={label} onChange={onChange}>
      {items}
    </Select>
  );
}
