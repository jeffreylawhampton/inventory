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

export function hexToHsl(hex) {
  hex = hex.replace("#", "");
  if (hex.length !== 3 && hex.length !== 6) {
    throw new Error("Invalid hexadecimal color code.");
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;

  const max = Math.max(rNormalized, gNormalized, bNormalized);
  const min = Math.min(rNormalized, gNormalized, bNormalized);
  let l = (max + min) / 2;
  let s;
  if (max === min) {
    s = 0; // achromatic
  } else {
    s = max - min;
    s /= l <= 0.5 ? max + min : 2 - max - min;
  }
  let h;
  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case rNormalized:
        h = (gNormalized - bNormalized) / (max - min);
        break;
      case gNormalized:
        h = 2 + (bNormalized - rNormalized) / (max - min);
        break;
      case bNormalized:
        h = 4 + (rNormalized - gNormalized) / (max - min);
        break;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  return { h: h.toFixed(1), s: (s * 100).toFixed(1), l: (l * 100).toFixed(1) };
}

export const getFontColor = (hex) => {
  const decimals = hexToRGB(hex);
  return 0.2126 * decimals[0] + 0.7152 * decimals[1] + 0.0722 * decimals[2] >
    144
    ? "text-black"
    : "text-white";
};

export const checkLuminance = (hex) => {
  if (hex?.length !== 7 || hex.charAt(0) !== "#") return "white";
  const r = hex.substring(1, 3);
  const g = hex.substring(3, 5);
  const b = hex.substring(5, 7);

  const decimals = [r, g, b].map((val) => parseInt(Number(`0x${val}`), 10));

  return 0.2126 * decimals[0] + 0.7152 * decimals[1] + 0.0722 * decimals[2] >
    144
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
