import { isArray } from "lodash";

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

export const hexToHSL = (hex, darken = 10) => {
  let r = 0,
    g = 0,
    b = 0;
  r = "0x" + hex[1] + hex[2];
  g = "0x" + hex[3] + hex[4];
  b = "0x" + hex[5] + hex[6];

  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100 - darken).toFixed(1);

  return "hsl(" + h + "," + s + "%," + l + "%)";
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

export function computeCounts(container, allContainers) {
  let itemCount = container._count?.items || 0;
  let containerCount = container._count?.containers || 0;

  const children = allContainers.filter(
    (c) => c.parentContainerId === container.id
  );

  for (const child of children) {
    const [childItemCount, childContainerCount] = computeCounts(
      child,
      allContainers
    );
    itemCount += childItemCount;
    containerCount += childContainerCount;
  }

  return [itemCount, containerCount];
}

export function buildContainerTree(
  containers,
  parentId = null,
  depth = 1,
  parentIds = []
) {
  if (!Array.isArray(containers)) return [];

  return containers
    .filter((container) => {
      const normalizedParentId = container.parentContainerId ?? null;

      if (container.id === normalizedParentId) {
        console.warn(`Container ${container.id} is self-parented`);
        return false;
      }

      return normalizedParentId === parentId;
    })
    .map((container) => {
      if (parentIds.includes(container.id)) {
        console.warn(
          `Circular reference detected: ${[...parentIds, container.id].join(
            " -> "
          )}`
        );
        return {
          ...container,
          depth,
          parentIds,
          containers: [],
        };
      }

      const newParentIds = [...parentIds, container.id];

      const children = buildContainerTree(
        containers,
        container.id,
        depth + 1,
        newParentIds
      );

      return {
        ...container,
        depth,
        parentIds,
        containers: children,
      };
    });
}

export const truncateName = (name) => {
  const split = name.split(" ");
  return split[0]?.length > 15
    ? `${split[0].substring(0, 12)} ${split[0].substring(13, split[0].length)}`
    : name;
};

export const getSelectedKey = (selectedItem) => {
  if (!selectedItem?.type || !selectedItem?.id) return null;
  return `/locations/api/selected?type=${selectedItem.type}&id=${selectedItem.id}`;
};

export const getDescendantIds = (containers, containerId, containerItemIds) => {
  let containerIds = [];
  let itemIds = [];
  if (Array.isArray(containerItemIds)) {
    itemIds = itemIds.concat(containerItemIds);
  }

  const childContainers = containers.filter(
    (c) => c.parentContainerId === containerId
  );

  for (const child of childContainers) {
    containerIds.push(child.id);
    if (Array.isArray(child.items)) {
      child.items.forEach((item) => itemIds.push(item.id));
    }
    const { containers: nestedContainers, items: nestedItems } =
      getDescendantIds(containers, child.id);
    containerIds.push(...nestedContainers);
    itemIds.push(...nestedItems);
  }

  return { containers: containerIds, items: itemIds };
};

export const getDescendants = (arr, parentId) => {
  const descendants = [];

  const traverseArray = (id) => {
    const children = arr.filter((c) => c.parentContainerId == id);
    for (const child of children) {
      descendants.push(child);
      traverseArray(child.id);
    }
  };
  traverseArray(parentId);
  return descendants;
};

export const buildParentContainerSelect = (depth = 16) => {
  let select = { id: true, name: true, color: { select: { hex: true } } };
  for (let i = 0; i < depth; i++) {
    select = {
      ...select,
      parentContainer: {
        select: { ...select },
      },
    };
  }
  return select;
};

export const handleToggleSelect = (value, list, setList) => {
  list?.includes(value)
    ? setList(list?.filter((i) => i != value))
    : setList([...list, value]);
};

export const selectToggle = ({ value, list, setList }) => {
  setList(
    list?.includes(value) ? list.filter((i) => i != value) : [...list, value]
  );
};

export const handleToggleDelete = (item, value, list, setList) => {
  setList(
    list?.find((i) => i[value] === item[value])
      ? list?.filter((i) => i[value] != item[value])
      : [...list, item]
  );
};

export async function getContainerCounts(containerIds) {
  const result = {};

  for (const id of containerIds) {
    let itemCount = 0;
    let containerCount = 0;

    const visited = new Set();
    const stack = [id];

    while (stack.length) {
      const currentId = stack.pop();
      if (!currentId || visited.has(currentId)) continue;
      visited.add(currentId);

      const container = await prisma.container.findUnique({
        where: { id: currentId },
        select: {
          _count: {
            select: {
              items: true,
              containers: true,
            },
          },
          containers: {
            select: {
              id: true,
            },
          },
        },
      });

      if (container) {
        itemCount += container._count.items;
        const childContainers = container.containers;
        containerCount += childContainers.length;
        stack.push(...childContainers.map((c) => c.id));
      }
    }

    result[id] = {
      itemCount,
      containerCount,
    };
  }

  return result;
}
