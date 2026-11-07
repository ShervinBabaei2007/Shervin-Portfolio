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
  /** One plain-English line shown under the group title. */
  summary: string
  skills: { name: string; category: SkillCategory; note: string }[]
}

export const skillTabs: SkillTab[] = [
  {
    id: 'web',
    label: 'Web & Full-Stack',
    summary: 'Interfaces, the APIs behind them, and the data they store.',
    skills: [
      { name: 'React', category: 'Frontend', note: 'Component UIs, forms and routing.' },
      { name: 'Next.js', category: 'Frontend', note: 'App Router, server components and actions.' },
      { name: 'TypeScript', category: 'Frontend', note: 'Typed React apps and API code.' },
      { name: 'JavaScript', category: 'Frontend', note: 'Browser and Node.js code.' },
      { name: 'Node.js', category: 'Backend', note: 'Servers, routes and bots.' },
      { name: 'Express', category: 'Backend', note: 'REST routes and middleware.' },
      { name: 'REST API', category: 'Backend', note: 'Designing and consuming HTTP APIs.' },
      { name: 'JWT', category: 'Backend', note: 'Protecting write routes.' },
      { name: 'MongoDB', category: 'Data', note: 'Mongoose models on Atlas.' },
      { name: 'PostgreSQL', category: 'Data', note: 'Schemas with row-level security.' },
      { name: 'Supabase', category: 'Backend', note: 'Postgres, Auth, Storage and scheduled jobs.' },
    ],
  },
  {
    id: 'systems',
    label: 'Systems & Low-Level',
    summary: 'Concurrency, realtime connections, and storage under the UI.',
    skills: [
      { name: 'Python', category: 'Systems', note: 'CLI tools, bots and tested OOP code.' },
      { name: 'asyncio', category: 'Systems', note: 'Concurrency and non-blocking I/O.' },
      { name: 'WebSockets', category: 'Systems', note: 'Realtime connections.' },
      { name: 'Redis', category: 'Data', note: 'Rate limiting and counters.' },
      { name: 'SQLite', category: 'Data', note: 'Embedded relational storage.' },
      { name: 'Ollama', category: 'Systems', note: 'Local models for generation and embeddings.' },
      { name: 'LangChain', category: 'Systems', note: 'PDF loading, chunking and retrieval.' },
      { name: 'ChromaDB', category: 'Data', note: 'A local vector store for RAG.' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Infrastructure',
    summary: 'Shipping, sign-in, design, and testing.',
    skills: [
      { name: 'Vercel', category: 'Tooling', note: 'Deploying frontends and backends.' },
      { name: 'Azure', category: 'Tooling', note: 'A VM running Express behind a reverse proxy.' },
      { name: 'Nginx', category: 'Tooling', note: 'Reverse proxy and HTTPS in front of Express.' },
      { name: 'GitHub Actions', category: 'Tooling', note: 'CI that runs the test suites.' },
      { name: 'Vitest', category: 'Tooling', note: 'Unit tests for application logic.' },
      { name: 'Auth0', category: 'Tooling', note: 'GitHub OAuth sign-in.' },
      { name: 'Figma', category: 'Tooling', note: 'UI design and prototyping.' },
      { name: 'pytest', category: 'Tooling', note: 'Automated tests for Python code.' },
    ],
  },
]

export const projectsUsing = (skill: string) => projects.filter((project) => project.stack.includes(skill))

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
