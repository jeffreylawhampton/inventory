export const inputStyles = {
  labelClasses: "!font-semibold pb-2",
  inputClasses:
    "text-black !placeholder-gray-800 !bg-bluegray-200 !text-sm lg:!text-base",
  offset: 0,
  radius: "md",
  size: "lg",
  variant: "filled",
  empty: "font-medium !text-black !text-left",
};

export const iconStyles = {
  size: 28,
};

export const tooltipStyles = {
  classes: "!text-black !px-3 drop-shadow-md font-medium",
  radius: "md",
  color: "white",
  offset: 10,
};

export const cardStyles = {
  radius: "lg",
  shadow: "sm",
  cardClasses: {
    root: `w-full !bg-bluegray-200 hover:!bg-bluegray-300 aspect-[2.5/1] drop-shadow-md active:drop-shadow-sm`,
  },
  imageClasses:
    "object-cover overflow-hidden min-h-[100%] w-[36%] min-w-[36%] rounded-xl",
};

export const buttonStyles = {
  radius: "xl",
};

export const breadcrumbStyles = {
  iconSize: 17,
  iconColor: "text-primary-800",
  separatorSize: 12,
  separatorColor: "text-gray-700",
  separatorStroke: 2,
  separatorClasses: "scale-x-[140%] text-black",
  breadCrumbClasses: {
    breadcrumb:
      "!flex !items-center !font-medium !text-sm md:!text-base !text-primary-800 !flex gap-[2px] items-center last:!text-black last:!font-semibold",
    root: "my-5 flex-wrap",
  },
};
