import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Inline link with a trailing icon, used for "read more" style links. */
export const textLinkClass =
  'hit-area inline-flex items-center gap-[7px] font-semibold no-underline transition-colors hover:text-primary'
