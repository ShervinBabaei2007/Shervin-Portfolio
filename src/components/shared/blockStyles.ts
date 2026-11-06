/*
 * Shared look for CodeBlock and TerminalBlock: a dark panel that stays dark in both themes.
 * Colours are fixed on purpose (they are not theme tokens).
 * Sizes use arbitrary values, not text-xs/text-sm, so no line-height is added to them.
 */
export const blockFrame =
  'mt-3.5 min-w-0 overflow-hidden rounded-[10px] border border-[#22304d] bg-[#0f1a30] text-[#e2e8f6]'

export const blockBar =
  'flex min-h-9 items-center justify-between gap-3 border-b border-white/10 px-3.5 font-mono text-[.75rem] leading-[normal] text-[#9fb0cc]'

export const blockPre =
  'm-0 overflow-x-auto px-4 pt-3.5 pb-4 font-mono text-[.8125rem] leading-[1.6] [tab-size:2] focus-visible:-outline-offset-[3px] focus-visible:outline-[3px] focus-visible:outline-ring max-[620px]:text-[.75rem]'

export const blockCaption = 'border-t border-white/10 px-4 pt-2.5 pb-3 text-[.875rem] leading-[1.5] text-[#9fb0cc]'
