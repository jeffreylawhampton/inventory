import { groupBy } from "lodash";

export const sortObjectArray = (arr, method) => {
  if (!arr || !Array.isArray(arr)) return;
  if (!method) return arr?.sort((a, b) => a.name.localeCompare(b.name));
  if (method === "newest") return arr.sort((a, b) => a.createdAt - b.createdAt);
};

export const hexToRGB = (hex) => {
  if (hex?.length !== 7 || hex.charAt(0) !== "#") return "text-black";
  const r = hex.substring(1, 3);
  const g = hex.substring(3, 5);
  const b = hex.substring(5, 7);

  return [r, g, b].map((val) => parseInt(Number(`0x${val}`), 10));
};

export const getTextClass = (hex) => {
  if (!hex) {
    return "text-black";
  }
  const decimals = hexToRGB(hex);
  return 0.2126 * decimals[0] + 0.7152 * decimals[1] + 0.0722 * decimals[2] >
    156
    ? "text-black"
    : "text-white";
};

export const getTextColor = (hex) => {
  if (hex?.length !== 7 || hex.charAt(0) !== "#") return "white";
  const r = hex.substring(1, 3);
  const g = hex.substring(3, 5);
  const b = hex.substring(5, 7);

  const decimals = [r, g, b].map((val) => parseInt(Number(`0x${val}`), 10));

  return 0.2126 * decimals[0] + 0.7152 * decimals[1] + 0.0722 * decimals[2] >
    156
    ? "#000000"
    : "#ffffff";
};

export const compareObjects = (obj1, obj2) => {
  let isMatch = true;
  for (const prop in obj1) {
    if (obj1[prop] != obj2[prop]) isMatch = false;
  }
  return isMatch;
};

export const transformColors = (colors) => {
  const transformedColors = {};

  for (const colorName in colors) {
    transformedColors[colorName] = {};
    colors[colorName].forEach((color, index) => {
      transformedColors[colorName][(index + 1) * 100] = color;
    });
  }
  return transformedColors;
};

export const findObject = (parent, condition) => {
  if (condition(parent)) {
    return parent;
  }

  for (const key in parent) {
    if (typeof parent[key] === "object") {
      const result = findObject(parent[key], condition);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const flattenContainers = (container) => {
  const result = [];

  function traverse(container) {
    if (container.containers) {
      for (const child of container.containers) {
        result.push(child);
        traverse(child);
      }
    }
  }

  traverse(container);
  return result;
};

export const flattenItems = (container) => {
  const result = [];

  function traverse(container) {
    if (container.containers) {
      for (const child of container.containers) {
        child?.items?.forEach((item) => result.push(item));
        traverse(child);
      }
    }
  }

  traverse(container);
  return result;
};

export const getCounts = (container) => {
  let itemCount = container?.items?.length;
  let containerCount = 0;

  function traverse(container) {
    if (container.containers) {
      containerCount += container.containers?.length;
      for (const child of container.containers) {
        if (child.items) {
          itemCount += child.items.length;
        }
        traverse(child);
      }
    }
  }
  traverse(container);
  return { itemCount, containerCount };
};

export const findItem = (parent, condition) => {
  if (condition(parent)) {
    return parent;
  }

  for (const key in parent) {
    if (typeof parent[key] === "object") {
      const result = findObject(parent[key], condition);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const splitData = (data) => {
  const locations = data?.locations;
  locations?.forEach((location) => {
    location.items = data?.items?.filter(
      (item) => item.locationId === location.id && !item.containerId
    );
    location.containers = data?.containers?.filter(
      (container) =>
        container.locationId === location.id && !container.parentContainerId
    );
    location?.containers?.forEach((container) => {
      container.items = data?.items?.filter(
        (item) => item.containerId === container.id
      );
      container.containers = data?.containers?.filter(
        (container) => container.parentContainerId === container.id
      );
    });
  });

  const containers = groupBy(data?.containers, "locationId");
  const items = groupBy(data?.items, "containerId");

  return { locations, containers, items };
};

export const unflattenArray = (array, parentId) => {
  // if (!Array.isArray(!array)) return;

  if (Array.isArray(array)) {
    array = array.map((container) => {
      return { ...container, containers: [] };
    });
    let nested = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].parentContainerId != parentId) {
        let parent = array
          .filter((elem) => elem.id === array[i].parentContainerId)
          .pop();
        parent?.containers.push(array[i]);
      } else {
        nested.push(array[i]);
      }
    }
    return nested;
  }
};
