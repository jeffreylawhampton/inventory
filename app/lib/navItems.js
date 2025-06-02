import {
  ItemIcon,
  LocationIcon,
  ContainerIcon,
  CategoryIcon,
  HomeIcon,
} from "../assets";

export const sidenavItems = [
  {
    name: "Home",
    navIcon: (
      <HomeIcon
        width="auto"
        height={30}
        aria-label="Home"
        strokeWidth={7}
        className="sidebar-icon"
      />
    ),
    url: "/",
  },
  {
    name: "Locations",
    navIcon: (
      <LocationIcon
        width="auto"
        height={30}
        aria-label="Location"
        strokeWidth={6}
      />
    ),
    url: "/locations",
  },
  {
    name: "Containers",
    navIcon: (
      <ContainerIcon
        width="auto"
        height={30}
        aria-label="Container"
        strokeWidth={4}
      />
    ),
    url: "/containers",
  },
  {
    name: "Categories",
    navIcon: (
      <CategoryIcon
        width="auto"
        height={30}
        aria-label="Category"
        strokeWidth={6}
      />
    ),
    url: "/categories",
  },
  {
    name: "Items",
    navIcon: (
      <ItemIcon width="auto" height={30} aria-label="Item" strokeWidth={4} />
    ),
    url: "/items",
  },
];
