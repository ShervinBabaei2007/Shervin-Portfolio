import { site } from './site'
import { facts } from './facts'

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
 * (`npm run resume:pdf` prints the page to public/Shervin-Babaei-Resume.pdf).
 * Every bullet matches the code and commit history of the linked repo.
 * Only list a skill if you can point to a project that uses it.
 */
export const resume = {
  name: site.name,
  title: 'Full-Stack Software Developer',
  links: [
    { label: 'Portfolio', href: site.url },
    { label: 'GitHub', href: site.github },
    { label: 'LinkedIn', href: site.linkedin },
  ] satisfies ResumeLink[],
  summary: `Full-Stack Developer and BCIT student (${facts.gpa} GPA, graduating ${site.graduation}) seeking a Co-op, Internship, or Junior Full-Stack role. Experienced in building, testing, and deploying web applications with REST APIs, cloud databases, secure user login systems, Docker containers, and automated delivery pipelines. Top 6 of 36 teams at ${facts.hackathon.name}.`,
  education: {
    school: 'British Columbia Institute of Technology (BCIT)',
    gpa: `GPA: ${facts.gpa}`,
    date: `Expected ${site.graduation}`,
    program: site.program,
    coursework:
      'Data Structures & Algorithms, Object-Oriented Programming, Web Database Technologies, JavaScript Frameworks & Server, C# & ASP.NET Web Application Development, Agile Software Development, UI/UX Development',
  },
  skills: [
    ['Languages & Core', 'TypeScript, JavaScript (ES6+), Python, SQL, C++, HTML5, CSS3'],
    ['Frontend', 'React, Next.js, Vite, Tailwind CSS, shadcn/ui, Chakra UI'],
    ['Backend & Cloud', 'Node.js, Express.js, FastAPI, RESTful APIs, WebSockets, Python asyncio'],
    ['Databases', 'PostgreSQL, MongoDB, Supabase, Redis, SQLite, Drizzle ORM, Mongoose, Sequelize'],
    [
      'DevOps & Security',
      'Docker, Docker Compose, Git, GitHub Actions, AWS (EC2, S3), Vercel, Nginx, OAuth 2.0/JWT, RBAC',
    ],
    [
      'Testing & Applied AI',
      'Vitest, Playwright, pytest, Integration Testing, Claude Code, Cursor, OpenRouter, Ollama, LangChain',
    ],
  ] as [string, string][],
  projects: [
    {
      name: 'SignalDesk',
      detail: 'AI News Intelligence & Cross-Source Analysis Platform',
      links: [
        { label: 'Live App', href: 'https://signaldesk-lemon.vercel.app' },
        { label: 'Repo', href: 'https://github.com/ShervinBabaei2007/SignalDesk' },
      ],
      date: 'Oct 2026 – Nov 2026',
      stack: 'Python, FastAPI, React, TypeScript, PostgreSQL, SQLite, Docker, GitHub Actions',
      role: 'Solo Developer',
      bullets: [
        'Architected an automated news analysis system combining text matching with smart semantic search to group coverage and compare conflicting story claims across outlets.',
        'Built isolated user workspaces equipped with secure session tokens, IP rate limiting, and defensive web security protections to safely process feeds.',
        'Created a comprehensive system health dashboard tracking response speeds and feed uptime, backed by containerized workflows and automated code testing.',
      ],
    },
    {
      name: 'Network Growth Assistant',
      detail: 'Full-Stack Networking Platform',
      links: [
        { label: 'Live App', href: 'https://linkedin-network-growth-assistance.vercel.app' },
        { label: 'Repo', href: 'https://github.com/ShervinBabaei2007/Network-Growth-Assistance' },
        { label: 'Case Study', href: `${site.url}/work/network-growth-assistant` },
      ],
      date: 'Oct 2026 – Present',
      stack: 'Next.js, React, TypeScript, PostgreSQL, Supabase, Vercel, Vitest, Playwright',
      role: 'Solo Developer & Architect',
      bullets: [
        'Built a full-stack outreach and job-application tracker featuring verified contact discovery, live link health checks, and detailed networking metrics.',
        'Enforced tenant data isolation via PostgreSQL RLS and maintained production reliability with 1,500+ automated unit and E2E tests in GitHub Actions.',
        'Integrated automated background job processing for contact verification and rate-limited API retries using exponential backoff retry routines.',
      ],
    },
    {
      name: 'SkillMatch',
      detail: 'Workshop Discovery Marketplace',
      links: [
        { label: 'Live App', href: 'https://skillmatch-web.vercel.app/' },
        { label: 'Team Repo', href: 'https://github.com/ClaisaZ/IDSP-MarketPlace-FSWD' },
        { label: 'Case Study', href: `${site.url}/work/skillmatch` },
      ],
      date: 'Apr 2025 – May 2025',
      stack: 'React, TypeScript, Node.js, Express, MongoDB, Mongoose, JWT',
      role: 'Backend & DevOps Lead',
      bullets: [
        'Delivered end-to-end workshop registration, QR ticketing, and review systems equipped with secure login and role-based access for students and instructors.',
        'Reduced initial page-load latency by 18% via route preloading, React bundle code-splitting, and background server pings to eliminate database delays.',
        'Designed advanced database indexing strategies utilizing compound geospatial and text search indexes to instantly filter categories during high traffic.',
      ],
    },
    {
      name: 'GitScribe',
      detail: `AI Conventional Commit Generator (${facts.hackathon.name} — Top 6 of 36)`,
      links: [
        { label: 'Live Demo', href: 'https://git-scribe-aybm.vercel.app/' },
        { label: 'Repo', href: 'https://github.com/adriencyr/GitScribe' },
        { label: 'Case Study', href: `${site.url}/work/gitscribe` },
      ],
      date: 'March 2026',
      stack: 'React, TypeScript, Chakra UI, Auth0, FastAPI, OpenAI',
      role: 'UI/UX & Frontend Lead',
      bullets: [
        'Built responsive user sign-in, navigation, and profile interface screens from Figma mockups during a fast-paced 24-hour team hackathon sprint.',
        'Reduced onboarding friction by ~30% by bypassing manual forms and routing users straight to GitHub single sign-on (SSO) via Auth0 authentication.',
        'Developed an AI tool that compares code file versions to generate standardized commit descriptions, securing Top 6 of 36 teams at Hack the Break.',
      ],
    },
  ] as ResumeProject[],
}
