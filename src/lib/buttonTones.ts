/**
 * Two button colours carry the site's navigation: blue (the default button) for projects, and teal (`writeup`) for
 * writeups. `ink` is the neutral dark style, kept for the resume and the closing call to action.
 * Do not add another colour anywhere (errors use ink, not red).
 */
export const tone = {
  ink: 'bg-foreground text-background hover:bg-foreground/90',
  writeup: 'bg-[var(--writeup)] text-[var(--writeup-foreground)] hover:bg-[var(--writeup)]/90',
}
