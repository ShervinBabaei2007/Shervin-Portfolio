import { projects } from './projects'

/*
 * Skills grouped by what they let me build, for the tools section and the command palette.
 * Only list a skill if a project in projects.ts uses it: the project count
 * and project names shown on the site are computed from `stack`, never typed.
 */
export type SkillCategory = 'Frontend' | 'Backend' | 'Data' | 'Systems' | 'AI' | 'Delivery'

export type SkillGroup = {
  id: 'frontend' | 'backend' | 'data' | 'systems' | 'ai' | 'delivery'
  label: string
  /** One plain-English line shown under the group title. */
  summary: string
  skills: { name: string; category: SkillCategory; note: string }[]
}

export const skillTabs: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    summary: 'Interfaces people use, and how they were designed.',
    skills: [
      { name: 'React', category: 'Frontend', note: 'Component UIs, forms and routing.' },
      { name: 'Next.js', category: 'Frontend', note: 'App Router, server components and actions.' },
      { name: 'TypeScript', category: 'Frontend', note: 'Typed React apps and API code.' },
      { name: 'JavaScript', category: 'Frontend', note: 'Browser and Node.js code.' },
      { name: 'Figma', category: 'Frontend', note: 'UI design and prototyping.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    summary: 'Servers, sign-in, and the routes behind the interface.',
    skills: [
      { name: 'Node.js', category: 'Backend', note: 'Servers, routes and bots.' },
      { name: 'Express', category: 'Backend', note: 'REST routes and middleware.' },
      { name: 'JWT', category: 'Backend', note: 'Protecting write routes.' },
      { name: 'Auth0', category: 'Backend', note: 'GitHub OAuth sign-in.' },
      { name: 'Supabase', category: 'Backend', note: 'Postgres, Auth, Storage and scheduled jobs.' },
    ],
  },
  {
    id: 'data',
    label: 'Databases & APIs',
    summary: 'Where the data lives, and how it is served.',
    skills: [
      { name: 'REST API', category: 'Data', note: 'Designing and consuming HTTP APIs.' },
      { name: 'MongoDB', category: 'Data', note: 'Mongoose models on Atlas.' },
      { name: 'PostgreSQL', category: 'Data', note: 'Schemas with row-level security.' },
      { name: 'Redis', category: 'Data', note: 'Rate limiting and counters.' },
      { name: 'SQLite', category: 'Data', note: 'Embedded relational storage.' },
      { name: 'ChromaDB', category: 'Data', note: 'A local vector store for RAG.' },
    ],
  },
  {
    id: 'systems',
    label: 'Systems & Low-Level',
    summary: 'Concurrency and realtime connections under the UI.',
    skills: [
      { name: 'Python', category: 'Systems', note: 'CLI tools, bots and tested OOP code.' },
      { name: 'asyncio', category: 'Systems', note: 'Concurrency and non-blocking I/O.' },
      { name: 'WebSockets', category: 'Systems', note: 'Realtime connections.' },
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
  {
    id: 'delivery',
    label: 'Delivery & Testing',
    summary: 'Shipping the work, and proving it still works.',
    skills: [
      { name: 'Vercel', category: 'Delivery', note: 'Deploying frontends and backends.' },
      { name: 'Azure', category: 'Delivery', note: 'A VM running Express behind a reverse proxy.' },
      { name: 'Nginx', category: 'Delivery', note: 'Reverse proxy and HTTPS in front of Express.' },
      { name: 'GitHub Actions', category: 'Delivery', note: 'CI that runs the test suites.' },
      { name: 'Vitest', category: 'Delivery', note: 'Unit tests for application logic.' },
      { name: 'pytest', category: 'Delivery', note: 'Automated tests for Python code.' },
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
