import {
  IconBox,
  IconClipboardList,
  IconHome,
  IconMapPin,
  IconTags,
  IconUser,
} from "@tabler/icons-react";
import { iconStyles } from "./styles";

export const sidenavItems = [
  {
    name: "Home",
    navIcon: (
      <IconHome
        aria-label="Home"
        size={iconStyles.size}
        strokeWidth={iconStyles.strokeWidth}
        className={iconStyles.classes}
      />
    ),
    url: "/",
  },
  {
    name: "Locations",
    navIcon: (
      <IconMapPin
        aria-label="Locations"
        size={iconStyles.size}
        strokeWidth={iconStyles.strokeWidth}
        className={iconStyles.classes}
      />
    ),
    url: "/locations",
  },
  {
    name: "Containers",
    navIcon: (
      <IconBox
        aria-label="Containers"
        size={iconStyles.size}
        strokeWidth={iconStyles.strokeWidth}
        className={iconStyles.classes}
      />
    ),
    url: "/containers",
  },
  {
    name: "Categories",
    navIcon: (
      <IconTags
        aria-label="Categories"
        size={iconStyles.size}
        strokeWidth={iconStyles.strokeWidth}
        className={iconStyles.classes}
      />
    ),
    url: "/categories",
  },
  {
    name: "Items",
    navIcon: (
      <IconClipboardList
        aria-label="Items"
        size={iconStyles.size}
        strokeWidth={iconStyles.strokeWidth}
        className={iconStyles.classes}
      />
    ),
    url: "/items",
  },
  // {
  //   name: "Account",
  //   navIcon: (
  //     <IconUser
  //       aria-label="Account"
  //       size={iconStyles.size}
  //       strokeWidth={iconStyles.strokeWidth}
  //     />
  //   ),
  //   url: "/user",
  // },
];
