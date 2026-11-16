/*
 * Shared look for CodeBlock and TerminalBlock: the dark ink panel used across the site, in both themes (the figures
 * carry data-theme="dark", so the code-* tokens inside resolve dark).
 * Small text uses the tokens in tailwind.css (no line-height added); code itself is 13px on every screen.
 */
/** The outer panel. */
export const blockFrame = 'mt-3.5 min-w-0 overflow-hidden rounded-md bg-[var(--ink-panel)] text-code-foreground'

/** The title bar across the top. */
export const blockBar =
  'flex min-h-9 items-center justify-between gap-3 border-b border-code-border px-3.5 font-mono text-[13px] leading-[normal] text-code-muted'

/** The scrollable code area. */
export const blockPre =
  'm-0 overflow-x-auto px-4 pt-3.5 pb-4 font-mono text-[.8125rem] leading-[1.6] [tab-size:2] focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring'

/** The caption line along the bottom. */
export const blockCaption = 'border-t border-code-border px-4 pt-2.5 pb-3 text-[.875rem] leading-[1.5] text-code-muted'
