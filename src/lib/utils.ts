import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** text-label / text-meta / text-control are font sizes (see tailwind.css); without this they would be read as colours. */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['label', 'meta', 'control'] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Inline link with a trailing icon, used for "read more" style links. */
export const textLinkClass =
  'hit-area inline-flex items-center gap-[7px] font-semibold no-underline transition-colors hover:text-primary'

/** URL-safe id for a heading, so the table of contents and the heading agree. */
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
