import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// cn utility function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
