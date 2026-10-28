import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility Function: Class Name Helper (`cn`)
 * Concepts Used:
 * - ES6 Rest Parameters (`...inputs`)
 * - Conditional Class Merging (`clsx`)
 * - Tailwind Class Conflict Resolution (`twMerge`)
 * 
 * @param inputs - Variable list of string, object, or array class definitions.
 * @returns Merged single string of deduplicated CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
