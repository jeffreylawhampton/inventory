const seedingDefaults = {
  colors: [
    "#73ab9f",
    "#0b5563",
    "#c06c84",
    "#3a506b",
    "#475b63",
    "#462255",
    "#134074",
    "#37505c",
    "#4e598c",
    "#e67f0d",
    "#d74e09",
    "#d84846",
    "#58819d",
    "#b7245c",
  ],
  locations: ["Living room", "Kitchen", "Garage"],
  categories: [
    { name: "Jewelry", color: "#c06c84", favorite: true },
    { name: "Tools", color: "#d84846", favorite: true },
    { name: "Keepsakes", color: "#b7245c", favorite: true },
    { name: "Electronics", color: "#134074", favorite: true },
  ],
  containers: [
    { name: "My first container", color: "#58819d", favorite: true },
    { name: "My second container", color: "#e67f0d", favorite: true },
  ],
  items: [
    {
      name: "Penny",
      categories: { name: "Good girls", color: "#4e598c" },
      favorite: true,
      description: "Copper colored, weirdly long tongue, hungry",
      quantity: "1",
      images: {
        secureUrl:
          "https://res.cloudinary.com/dgswa3kpt/image/upload/v1750056357/drilldown_c2hph5.jpg",
        width: 800,
        height: 800,
      },
    },
    {
      name: "Steve",
      categories: { name: "Grumpy boys", color: "#73ab9f" },
      favorite: true,
      quantity: "1",
      images: {
        secureUrl:
          "https://res.cloudinary.com/dgswa3kpt/image/upload/v1750056232/steve-snow-sm_cdll3h.jpg",
        width: 800,
        height: 800,
      },
    },
  ],
};

export default seedingDefaults;
