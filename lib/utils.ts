import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCount(count: number): string {
  if (count >= 1000000) {
    const formatted = (count / 1000000).toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + "M"
      : formatted + "M";
  } else if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + "K"
      : formatted + "K";
  } else {
    return count.toString();
  }
}

export function countInteractions(
  userInteractions: Record<string, "like" | "dislike">,
  type: "like" | "dislike"
): number {
  return Object.values(userInteractions).filter((v) => v === type).length;
}
