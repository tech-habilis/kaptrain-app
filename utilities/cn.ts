import { twMerge } from "tailwind-merge";

/**
 * Converts a hex color string to an RGBA color string.
 * @param hex The hex color value (e.g., "#03F", "#0033FF", "#0033FF80", "03F").
 * @param alpha Optional alpha value (0 to 1) to override the hex's alpha or default to 1.
 * @returns The RGBA color string (e.g., "rgba(0, 51, 255, 1)").
 */
export const hexToRgba = (hex: string, alpha?: number): string => {
  // Remove the hash if it exists
  let tempHex = hex.replace("#", "");

  // Handle 3-digit and 4-digit hex shorthand
  if (tempHex.length === 3 || tempHex.length === 4) {
    tempHex = tempHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Use a regular expression to extract the individual color values
  const values = tempHex.match(/\w\w/g);

  if (!values || (values.length !== 3 && values.length !== 4)) {
    throw new Error("Invalid hex color format");
  }

  // Convert the hex color values to decimal values
  const [r, g, b] = values.slice(0, 3).map((k) => parseInt(k, 16));

  // Determine the alpha value
  let finalAlpha = alpha;
  if (finalAlpha === undefined) {
    if (values.length === 4) {
      // Convert the 8-digit hex alpha (00-FF) to a decimal (0-1)
      finalAlpha = parseInt(values[3], 16) / 255;
    } else {
      // Default to 1 (fully opaque)
      finalAlpha = 1;
    }
  }

  return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
};

const cn = (...classes: string[]) => twMerge(...classes);

export default cn;
