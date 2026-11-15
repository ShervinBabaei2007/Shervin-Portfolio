/** The long soft shadow of a raised card (Contact, Quick answers, case study, writeup and closing call to action). */
export const raisedShadow = 'shadow-[0_2px_4px_var(--color-shadow),0_30px_60px_-26px_var(--color-shadow)]'

/** The full raised look: the shadow plus a border a step stronger than the default. Pair it with `border`. */
export const raised = `border-foreground/15 ${raisedShadow}`

/** The lighter shadow of the home page's project, About and Tools cards and the About photo. */
export const softShadow = 'shadow-[0_1px_2px_var(--color-shadow),0_16px_36px_-22px_var(--color-shadow)]'

/** A small raised pill for a row of facts or tool names under a page title. */
export const pill =
  'rounded-full border border-foreground/15 bg-card px-3.5 py-1.5 shadow-[0_1px_2px_var(--color-shadow)]'
