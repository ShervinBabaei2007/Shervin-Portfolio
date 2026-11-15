/** Lists the generated widths of a portrait in public/about (from scripts/portrait.mjs) in one file format. */
export function portraitSrcSet(name: string, widths: readonly number[], extension: string): string {
  return widths.map((width) => `/about/${name}-${width}.${extension} ${width}w`).join(', ')
}
