import { Pill } from "@mantine/core";

const IconPill = ({
  href,
  icon,
  name,
  size = "sm",
  labelClasses,
  padding = "p-1",
}) => {
  return (
    <Pill
      size={size}
      component={href ? "a" : null}
      href={href}
      classNames={{
        label: `font-semibold flex gap-[2px] items-center ${labelClasses} ${padding}`,
        root: "relative !bg-bluegray-500 !bg-opacity-25 hover:!bg-opacity-35 active:!bg-opacity-45",
      }}
      styles={{
        root: {
          height: "fit-content",
        },
      }}
    >
      {icon}
      {name}
    </Pill>
  );
};

export default IconPill;
