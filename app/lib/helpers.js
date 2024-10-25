export const sortObjectArray = (arr, method) => {
  if (!arr) return;
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
