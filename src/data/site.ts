/**
 * One place for every fact about the site that changes over time.
 * Update these before each application season.
 */
export const site = {
  /**
   * Canonical origin, no trailing slash. Used for canonical links, Open Graph
   * images, JSON-LD and the sitemap. Change this the day you connect a custom
   * domain in Vercel (for example https://shervinbabaei.com) and redeploy.
   */
  url: 'https://shervinbabaei.vercel.app',
  name: 'Shervin Babaei',
  role: 'Full-stack developer',
  location: 'Vancouver, BC',
  email: 'shervinb22@gmail.com',
  github: 'https://github.com/ShervinBabaei2007',
  linkedin: 'https://www.linkedin.com/in/shervin-babaei/',
  school: 'BCIT',
  program: 'Diploma in Full-Stack Web Development',
  graduation: 'May 2027',

  /**
   * Exact availability is what recruiters filter on. Fill in `from` with the
   * first month you can start (for example 'January 2027') and, if it applies,
   * `term` with the length (for example 'a 4- or 8-month co-op'). While `from` is empty
   * the site shows a general line built from your graduation date instead.
   */
  availability: {
    from: '' as string,
    term: '' as string,
    roles: 'co-op, internship and software roles',
    area: 'Vancouver, on-site or hybrid',
  },
}

export function availabilityLine(): string {
  const { from, term, roles, area } = site.availability
  if (from) return `Available from ${from}${term ? ` for ${term}` : ''}. ${area}.`
  return `Open to ${roles} in ${area}. Graduating ${site.graduation}.`
}
