/** The long soft shadow of a raised card (the cards on the How this site is built page). */
export const raisedShadow = 'shadow-[0_2px_4px_var(--color-shadow),0_30px_60px_-26px_var(--color-shadow)]'

/** The full raised look: the shadow plus a border a step stronger than the default. Pair it with `border`. */
export const raised = `border-foreground/15 ${raisedShadow}`

/** A small raised pill for a row of facts or tool names under a page title. */
export const pill =
  'rounded-full border border-foreground/15 bg-card px-3.5 py-1.5 shadow-[0_1px_2px_var(--color-shadow)]'

/** The outlined pill link under a section ("All 13 projects"); it fills with ink on hover. */
export const outlinePill =
  'inline-flex h-11 items-center gap-2.5 rounded-full border border-foreground/25 px-5 text-[15px] text-foreground no-underline transition-colors hover:bg-foreground hover:text-background'
