import { site } from './site'
import { facts } from './facts'

/** Only facts that already appear on the resume or in a case study belong here. */
export const journey = [
  {
    id: 'bcit',
    title: `${site.school} ${site.program}`,
    meta: `Expected ${site.graduation}`,
    tags: [`${facts.gpa} GPA`, 'OOP', 'Database Systems', 'Agile', 'UX/UI'],
    body: `Coursework in OOP, database systems, agile development, UX/UI design and web application development, applied in team builds like SkillMatch (${facts.skillmatch.teamSize} people, ${facts.skillmatch.myCommits} commits from me).`,
    link: { label: 'View resume', to: '/resume' },
  },
  {
    id: 'hackathon',
    title: 'Hack the Break 2026',
    meta: 'March 2026',
    tags: [facts.hackathon.placement, 'React', 'Auth0'],
    body: `Built the sign-in, navigation and profile screens of GitScribe from Figma designs during a 24-hour sprint; the team placed ${facts.hackathon.placement.toLowerCase()}.`,
    link: { label: 'Read the GitScribe case study', to: '/work/gitscribe' },
  },
  {
    id: 'systems',
    title: 'Going down the stack',
    meta: 'Ongoing',
    tags: ['Python', 'asyncio', 'Redis', 'Rate limiting'],
    body: 'Projects where the interesting part sits below the UI: a sliding-window rate limiter, a non-blocking Discord bot, and a command-line tool backed by SQLite.',
    link: { label: 'How this site is built', to: '/how-its-built' },
  },
] as const
