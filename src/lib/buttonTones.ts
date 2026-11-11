/**
 * Three button colours: blue (the default button, for external actions such as Launch Live App), dark ink (`ink`,
 * for navigation to projects and the resume) and teal (`writeup`, for writeups).
 * Do not add another colour anywhere (errors use ink, not red).
 */
export const tone = {
  ink: 'bg-foreground text-background hover:bg-foreground/90',
  writeup: 'bg-[var(--writeup)] text-[var(--writeup-foreground)] hover:bg-[var(--writeup)]/90',
}
