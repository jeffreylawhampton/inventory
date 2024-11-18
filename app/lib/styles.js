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
  strokeWidth: 2,
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
  headingClasses:
    "!text-[15px] pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words w-full @xs:w-1/2",
  detailClasses: `pt-1 flex flex-col gap-2 flex-wrap text-sm [&_label]:font-medium [&_p]:flex-wrap [&_p]:flex [&_p]:gap-x-2`,
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
  iconSize: 18,
  iconColor: "text-primary-800",
  separatorSize: 12,
  separatorColor: "text-gray-700",
  separatorStroke: 2,
  separatorClasses: "scale-x-[140%] text-black",
  separatorMargin: "xl",
  breadCrumbClasses: {
    breadcrumb:
      "!no-underline !flex !items-center !font-medium !text-[13px] !text-primary-800 !flex gap-[2px] items-center last:!text-black last:!font-semibold",
    root: "max-lg:!max-w-[85%] gap-y-2 mb-8 flex-wrap [&>.mantine-Breadcrumbs-separator]:!mx-1",
  },
};
