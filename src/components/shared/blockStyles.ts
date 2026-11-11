/*
 * Shared look for CodeBlock and TerminalBlock: a dark panel that stays dark in both themes.
 * Colours are fixed on purpose (they are not theme tokens).
 * Small text uses the tokens in tailwind.css (no line-height added); code itself is 13px on every screen.
 */
export const blockFrame =
  'mt-3.5 min-w-0 overflow-hidden rounded-[10px] border border-code-border bg-code text-code-foreground'

export const blockBar =
  'flex min-h-9 items-center justify-between gap-3 border-b border-white/10 px-3.5 font-mono text-label leading-[normal] text-code-muted'

export const blockPre =
  'm-0 overflow-x-auto px-4 pt-3.5 pb-4 font-mono text-[.8125rem] leading-[1.6] [tab-size:2] focus-visible:-outline-offset-[3px] focus-visible:outline-[3px] focus-visible:outline-ring'

export const blockCaption = 'border-t border-white/10 px-4 pt-2.5 pb-3 text-[.875rem] leading-[1.5] text-code-muted'
