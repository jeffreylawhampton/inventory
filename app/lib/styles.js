export const inputStyles = {
  labelClasses: "!font-semibold pb-2",
  inputClasses: "text-black !placeholder-gray-800 !bg-bluegray-100",
  offset: 0,
  radius: "md",
  variant: "filled",
  size: "lg",
  empty: "font-medium !text-black !text-left",
};

export const iconStyles = {
  size: 32,
  strokeWidth: 2,
  classes: "text-black",
};

export const tooltipStyles = {
  classes: "!text-black !px-3 drop-shadow-md font-medium",
  radius: "md",
  color: "white",
  offset: 10,
};

export const cardStyles = {
  defaultBg: "!bg-bluegray-200",
  hoverBg: "!bg-bluegray-300",
  activeBg: "!bg-bluegray-600",
  radius: "lg",
  shadow: "sm",
  headingClasses:
    "!text-[15px] pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words w-full @xs:w-1/2",
  detailClasses: `pt-1 flex flex-col gap-1 flex-wrap text-xs [&_label]:font-medium [&_p]:flex-wrap [&_p]:flex [&_p]:gap-x-2`,
  cardClasses: {
    root: `w-full !bg-bluegray-200 hover:!bg-bluegray-300 aspect-[2.5/1] drop-shadow-md active:drop-shadow-sm`,
  },
  imageClasses:
    "object-cover !overflow-hidden !aspect-square w-[36%] min-w-[36%] rounded-xl h-full",
};

export const buttonStyles = {
  radius: "xl",
};

export const breadcrumbStyles = {
  iconSize: 15,
  textSize: "text-[11px] xl:text-[12px]",
  iconColor: "text-primary-800",
  separatorSize: 10,
  separatorColor: "text-gray-700",
  separatorStroke: 2,
  separatorClasses: "scale-x-[140%] text-black",
  padding: "!p-[1px] xl:!p-[2px]",
  breadCrumbClasses: {
    breadcrumb:
      "!no-underline !flex !items-center !font-medium !text-black !flex gap-[1px] items-center last:!text-black ",
    root: "gap-y-2 flex-wrap [&>.mantine-Breadcrumbs-separator]:!mx-[3px]",
  },
};
