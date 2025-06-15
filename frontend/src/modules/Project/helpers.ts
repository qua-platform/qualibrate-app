import { colorPalette } from "./constants";

const assignedColors = new Map<string, string>();

// Alternative: Gets folder color by round robin algorithm
export const getProjectColor = (name: string): string => {
  if (assignedColors.has(name)) {
    return assignedColors.get(name)!;
  }

  const index = assignedColors.size % colorPalette.length;
  const color = colorPalette[index];
  assignedColors.set(name, color);
  return color;
};

// Gets folder color by hash function algorithm
export const getColorIndex = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % colorPalette.length;
};

export const extractInitials = (name?: string): string => {
  if (!name) return "";
  const [first = "", second = ""] = name.trim().split(" ");
  return (first[0] ?? "").toUpperCase() + (second[0] ?? "").toUpperCase();
};

export const createClickHandler = (onClick?: (name: string) => void, name = "") => () => {
  if (onClick) {
    onClick(name);
  }
};
