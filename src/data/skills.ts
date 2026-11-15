import { projects } from './projects'

/*
 * Skills grouped by what they let me build, for the tools section and the command palette.
 * Only list a skill if a project in projects.ts uses it: the project count
 * and project names shown on the site are computed from `stack`, never typed.
 */
/** The group a skill belongs to. */
export type SkillCategory = 'Languages' | 'Frontend' | 'Backend' | 'Data' | 'Delivery' | 'AI'

/** One tab of the tools section: a titled group of skills. */
export type SkillGroup = {
  id: 'languages' | 'frontend' | 'backend' | 'data' | 'delivery' | 'ai'
  label: string
  /** One plain-English line shown under the group title. */
  summary: string
  skills: {
    name: string
    category: SkillCategory
    note: string
    /** Other `stack` entries that count as this skill, for tiles that cover several (JWT and OAuth, Git and GitHub). */
    match?: string[]
  }[]
}

/** Every skill group, in the order the tabs appear. */
export const skillTabs: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    summary: 'What I write day to day.',
    skills: [
      { name: 'Python', category: 'Languages', note: 'APIs, CLI tools, bots and tested OOP code.' },
      { name: 'TypeScript', category: 'Languages', note: 'Typed React apps and API code.' },
      { name: 'JavaScript', category: 'Languages', note: 'Browser and Node.js code.' },
      { name: 'SQL', category: 'Languages', note: 'Queries, schemas and row-level security in Postgres and SQLite.' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    summary: 'Interfaces people use, and how they were designed.',
    skills: [
      { name: 'React', category: 'Frontend', note: 'Component UIs, forms and routing.' },
      { name: 'Next.js', category: 'Frontend', note: 'App Router, server components and actions.' },
      { name: 'HTML5', category: 'Frontend', note: 'Semantic markup for a single-page app.' },
      { name: 'CSS3', category: 'Frontend', note: 'Hand-written styles with no framework.' },
      { name: 'Tailwind CSS', category: 'Frontend', note: 'Utility-first styling for dashboards and this site.' },
      { name: 'shadcn/ui', category: 'Frontend', note: 'Accessible Radix components, themed light and dark.' },
      { name: 'Figma', category: 'Frontend', note: 'UI design and prototyping.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    summary: 'Servers, realtime connections, sign-in, and the routes behind the interface.',
    skills: [
      { name: 'Node.js', category: 'Backend', note: 'Servers, routes and bots.' },
      { name: 'Express', category: 'Backend', note: 'REST routes and middleware.' },
      { name: 'FastAPI', category: 'Backend', note: 'A typed Python API behind a news dashboard.' },
      {
        name: 'JWT & OAuth',
        category: 'Backend',
        note: 'Token-protected routes, plus Google and GitHub sign-in through passport.js and Auth0.',
        match: ['JWT', 'OAuth', 'Auth0', 'GitHub OAuth', 'Google OAuth'],
      },
      { name: 'Supabase', category: 'Backend', note: 'Postgres, Auth, Storage and scheduled jobs.' },
      { name: 'WebSockets', category: 'Backend', note: 'Realtime connections.' },
      { name: 'asyncio', category: 'Backend', note: 'Concurrency and non-blocking I/O.' },
    ],
  },
  {
    id: 'data',
    label: 'Databases & APIs',
    summary: 'Where the data lives, and how it is served.',
    skills: [
      { name: 'REST API', category: 'Data', note: 'Designing and consuming HTTP APIs.' },
      { name: 'PostgreSQL', category: 'Data', note: 'Schemas with row-level security.' },
      { name: 'MongoDB', category: 'Data', note: 'Mongoose models on Atlas.' },
      { name: 'Redis', category: 'Data', note: 'Rate limiting and counters.' },
      { name: 'SQLite', category: 'Data', note: 'Embedded relational storage.' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery & Testing',
    summary: 'Shipping the work, and proving it still works.',
    skills: [
      {
        name: 'Git & GitHub',
        category: 'Delivery',
        note: 'Branches, pull requests and code review on team repos.',
        match: ['Git'],
      },
      { name: 'GitHub Actions', category: 'Delivery', note: 'CI that runs the test suites.' },
      { name: 'Docker', category: 'Delivery', note: 'Containers for a backend and its database.' },
      { name: 'Vercel', category: 'Delivery', note: 'Deploying frontends and backends.' },
      { name: 'Azure', category: 'Delivery', note: 'A VM running Express behind a reverse proxy.' },
      { name: 'Nginx', category: 'Delivery', note: 'Reverse proxy and HTTPS in front of Express.' },
      { name: 'Vitest', category: 'Delivery', note: 'Unit tests for application logic.' },
      { name: 'pytest', category: 'Delivery', note: 'Automated tests for Python code.' },
      { name: 'Playwright', category: 'Delivery', note: 'End-to-end browser tests.' },
      { name: 'axe-core', category: 'Delivery', note: 'Automated accessibility checks inside the end-to-end suite.' },
    ],
  },
  {
    id: 'ai',
    label: 'Applied AI & Tooling',
    summary: 'Local models, retrieval, and an AI coding agent.',
    skills: [
      { name: 'Ollama', category: 'AI', note: 'Local models for generation and embeddings.' },
      { name: 'LangChain', category: 'AI', note: 'PDF loading, chunking and retrieval.' },
      {
        name: 'Claude Code',
        category: 'AI',
        note: 'AI coding agent for building, testing and reviewing changes.',
      },
    ],
  },
]

/** Every `stack` entry that counts toward a tile: its own name plus any `match` aliases. */
const stackNames = new Map(
  skillTabs.flatMap((group) => group.skills).map((skill) => [skill.name, [skill.name, ...(skill.match ?? [])]]),
)

/** The projects whose stack includes this skill. */
export const projectsUsing = (skill: string) => {
  const names = stackNames.get(skill) ?? [skill]
  return projects.filter((project) => project.stack.some((item) => names.includes(item)))
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
