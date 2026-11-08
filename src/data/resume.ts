import { site } from './site'
import { commitsLine, facts } from './facts'

export type ResumeLink = { label: string; href: string }

export type ResumeProject = {
  name: string
  detail?: string
  links?: ResumeLink[]
  date: string
  stack: string
  role?: string
  bullets: string[]
}

/*
 * Source for both the /resume page and the downloadable PDF
 * (`npm run resume:pdf` prints the page to public/Shervin_Babaei_Resume.pdf).
 * Every bullet matches the code and commit history of the linked repo.
 * Only list a skill if you can point to a project that uses it.
 */
export const resume = {
  name: site.name,
  title: 'Full-Stack Developer',
  links: [
    { label: 'Portfolio', href: site.url },
    { label: 'GitHub', href: site.github },
    { label: 'LinkedIn', href: site.linkedin },
  ] satisfies ResumeLink[],
  summary: `Full-stack developer and BCIT student focused on backend development and application architecture. Built and deployed complete TypeScript, React, Node.js and Python applications with REST APIs, SQL and MongoDB databases, JWT and OAuth authentication, and automated tests. Placed ${facts.hackathon.placement} teams at ${facts.hackathon.name}.`,
  education: {
    school: 'British Columbia Institute of Technology (BCIT)',
    gpa: `GPA: ${facts.gpa}`,
    date: `Expected ${site.graduation}`,
    program: site.program,
    coursework: 'OOP, Database Systems, Agile Development, UX/UI Design, Web Application Development',
  },
  skills: [
    ['Languages', 'JavaScript (ES6+), TypeScript, Python, SQL, React, Next.js, Vite, Tailwind CSS, HTML, CSS'],
    ['Backend', 'Node.js, Express, MongoDB, Supabase (PostgreSQL), Redis, SQLite'],
    ['Auth & APIs', 'REST APIs, JWT, Auth0 (GitHub OAuth), WebSockets'],
    [
      'Tooling & AI',
      'Claude Code, GitHub Actions (CI), Playwright, Vitest, pytest, Git, Vercel, Azure, Nginx, Figma, asyncio, Ollama, LangChain, ChromaDB',
    ],
  ] as [string, string][],
  projects: [
    {
      name: 'Network Growth Assistant',
      detail: 'Networking & Job Search App',
      links: [
        { label: 'Live App', href: 'https://linkedin-network-growth-assistance.vercel.app' },
        { label: 'Repo', href: 'https://github.com/ShervinBabaei2007/Network-Growth-Assistance' },
        { label: 'Case Study', href: `${site.url}/work/network-growth-assistant` },
      ],
      date: 'Oct 2026 – Current',
      stack: 'Next.js, React, TypeScript, Supabase, PostgreSQL, Vercel',
      role: 'Solo project, design to deployment',
      bullets: [
        'Built a daily outreach list and job-application tracker that counts an invitation only once it is accepted.',
        'Added a research tool that shows proof for each person found, and an Apply button only after a job link is checked.',
        'Kept each user’s data private with database access rules, and wrote over 1,800 automated tests.',
      ],
    },
    {
      name: 'GitScribe',
      detail: `${facts.hackathon.name}, ${facts.hackathon.placement} Teams`,
      links: [
        { label: 'Live Demo', href: 'https://git-scribe-aybm.vercel.app/' },
        { label: 'Repo', href: 'https://github.com/adriencyr/GitScribe' },
        { label: 'Case Study', href: `${site.url}/work/gitscribe` },
      ],
      date: 'March 2026',
      stack: 'React, TypeScript, Chakra UI, Auth0, FastAPI, OpenAI',
      role: 'UI/UX Lead & Front-End Developer',
      bullets: [
        'Built the sign-in, navigation, and profile screens from the team’s Figma designs during a 24-hour sprint.',
        'Removed a step from sign-in by sending users straight to GitHub through Auth0’s GitHub connection.',
        'Contributed to an AI tool that compares two file versions and suggests a commit message; placed top 6 of 36.',
      ],
    },
    {
      name: 'SkillMatch',
      detail: 'Full-Stack Workshop Marketplace',
      links: [
        { label: 'Live App', href: 'https://skillmatch-web.vercel.app/' },
        { label: 'Team Repo', href: 'https://github.com/ClaisaZ/IDSP-MarketPlace-FSWD' },
        { label: 'Case Study', href: `${site.url}/work/skillmatch` },
      ],
      date: 'Spring 2026',
      stack: 'React, TypeScript, Express, MongoDB, JWT',
      role: `Backend & DevOps Lead, top committer (${commitsLine})`,
      bullets: [
        'Built the attend, review, and host-a-workshop flows end to end, from React screens to JWT-protected Express routes.',
        'Worked on first-load latency by preloading key routes, splitting React and UI libraries into separately cached chunks, and keeping MongoDB Atlas warm with a five-minute keepalive ping.',
        'Added capacity feedback that blocks full workshops, and replaced browser alerts with toast notifications.',
      ],
    },
    {
      name: 'ThinkBoard',
      detail: 'Full-Stack Notes Application',
      links: [{ label: 'Repo', href: 'https://github.com/ShervinBabaei2007/MERN-thinkBoard' }],
      date: 'March – April 2026',
      stack: 'MongoDB, Express, React, Node.js, Redis (Upstash), Tailwind CSS',
      bullets: [
        'Protected the API with Upstash Redis sliding-window rate limiting (50 requests per 60 seconds), returning HTTP 429 with a dedicated rate-limited screen in the UI.',
        'Built full CRUD for notes, with required fields enforced in both the form and the Mongoose schema.',
        'Gave every create, edit, and delete clear feedback with toast notifications, without a page refresh.',
      ],
    },
    {
      name: 'Discord AI Bridge',
      detail: 'Local AI Discord Bot',
      links: [
        { label: 'Repo', href: 'https://github.com/ShervinBabaei2007/Discord-ai-bridge' },
        { label: 'Case Study', href: `${site.url}/work/discord-ai-bridge` },
      ],
      date: 'March – April 2026',
      stack: 'Python, discord.py, LM Studio, REST API, asyncio',
      role: 'Solo project',
      bullets: [
        'Connected a Discord bot to a local Qwen 3.5 9B model through LM Studio’s OpenAI-compatible endpoint, answering the !.ask command with no cloud API.',
        'Moved the blocking HTTP call into a worker thread with asyncio.to_thread(), so the bot keeps handling other messages while a reply is generated.',
        'Turned connection failures and HTTP errors into clear channel messages, and blocked @everyone pings in replies.',
      ],
    },
  ] as ResumeProject[],
}
