import { colorPalette } from "./constants";

const assignedColors = new Map<string, string>();

export const getProjectColor = (name: string): string => {
  if (assignedColors.has(name)) {
    return assignedColors.get(name)!;
  }

  const index = assignedColors.size % colorPalette.length;
  const color = colorPalette[index];
  assignedColors.set(name, color);
  return color;
};

export const createClickHandler = (onClick?: (name: string) => void, name = "") => () => {
  if (onClick) {
    onClick(name);
  }
};

export const extractInitials = (name?: string): string => {
  if (!name) return "";
    const [first = "", second = ""] = name.trim().split(" ");
    return (first[0] ?? "").toUpperCase() + (second[0] ?? "").toUpperCase();
};
