import { Pill } from "@mantine/core";

const IconPill = ({
  href,
  icon,
  name,
  size = "sm",
  labelClasses,
  padding = "p-1",
  handleEnter,
  handleLeave,
}) => {
  return (
    <Pill
      size={size}
      component={href ? "a" : null}
      onMouseEnter={handleEnter || null}
      onMouseLeave={handleLeave || null}
      href={href}
      classNames={{
        label: `font-semibold flex gap-[2px] items-center ${labelClasses} ${padding}`,
        root: "relative !bg-bluegray-500 hover:!bg-bluegray-600 !bg-opacity-25 hover:!bg-opacity-35 active:!bg-opacity-45",
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
