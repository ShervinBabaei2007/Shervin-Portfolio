import { projects } from './projects'

/*
 * Skills grouped for the Tabs, HoverCard and capability table.
 * Only list a skill if a project in projects.ts uses it: the project count
 * and project names shown on the site are computed from `stack`, never typed.
 */
export type SkillCategory = 'Frontend' | 'Backend' | 'Data' | 'Systems' | 'Tooling'

export type SkillTab = {
  id: 'web' | 'systems' | 'tools'
  label: string
  skills: { name: string; category: SkillCategory; note: string }[]
}

export const skillTabs: SkillTab[] = [
  {
    id: 'web',
    label: 'Web & Full-Stack',
    skills: [
      { name: 'React', category: 'Frontend', note: 'Component UIs, forms and routing.' },
      { name: 'TypeScript', category: 'Frontend', note: 'Typed React apps and API code.' },
      { name: 'JavaScript', category: 'Frontend', note: 'Browser and Node.js code.' },
      { name: 'Node.js', category: 'Backend', note: 'Servers, routes and bots.' },
      { name: 'Express', category: 'Backend', note: 'REST routes and middleware.' },
      { name: 'REST API', category: 'Backend', note: 'Designing and consuming HTTP APIs.' },
      { name: 'JWT', category: 'Backend', note: 'Protecting write routes.' },
      { name: 'MongoDB', category: 'Data', note: 'Mongoose models on Atlas.' },
    ],
  },
  {
    id: 'systems',
    label: 'Systems & Low-Level',
    skills: [
      { name: 'Python', category: 'Systems', note: 'CLI tools, bots and tested OOP code.' },
      { name: 'asyncio', category: 'Systems', note: 'Concurrency and non-blocking I/O.' },
      { name: 'WebSockets', category: 'Systems', note: 'Realtime connections.' },
      { name: 'Redis', category: 'Data', note: 'Rate limiting and counters.' },
      { name: 'SQLite', category: 'Data', note: 'Embedded relational storage.' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Infrastructure',
    skills: [
      { name: 'Vercel', category: 'Tooling', note: 'Deploying frontends and backends.' },
      { name: 'Auth0', category: 'Tooling', note: 'GitHub OAuth sign-in.' },
      { name: 'Figma', category: 'Tooling', note: 'UI design and prototyping.' },
      { name: 'pytest', category: 'Tooling', note: 'Automated tests for Python code.' },
    ],
  },
]

export const projectsUsing = (skill: string) => projects.filter((project) => project.stack.includes(skill))

/** Usage is derived from the number of projects, so it can be checked against the case studies. */
export function usageLevel(skill: string): 'Core' | 'Used' | 'Exploring' {
  const count = projectsUsing(skill).length
  return count >= 3 ? 'Core' : count >= 1 ? 'Used' : 'Exploring'
}

/** What this site itself is built and checked with (shown beside the project skills). */
export const siteStack = [
  { title: 'Build', items: ['React 19', 'TypeScript', 'Vite', 'React Router', 'Tailwind CSS', 'shadcn/ui'] },
  {
    title: 'Quality',
    items: [
      'Playwright end-to-end tests',
      'axe-core accessibility checks',
      'ESLint and Prettier in CI',
      'Prerendered HTML',
    ],
  },
] as const
