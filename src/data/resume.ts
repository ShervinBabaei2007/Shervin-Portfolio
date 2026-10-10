import { site } from './site'

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
  location: site.location,
  email: site.email,
  /** Printed on the PDF only, so it is not scraped from the public web page. */
  phone: '(604) 499-5673',
  links: [
    { label: 'Portfolio', href: site.url },
    { label: 'GitHub', href: site.github },
    { label: 'LinkedIn', href: site.linkedin },
  ] satisfies ResumeLink[],
  summary:
    'Full-stack developer and BCIT student who builds across UI, API, and data layers, then traces failures until I can explain the trade-off and fix. Top 6 of 36 teams at Hack the Break 2026.',
  education: {
    school: 'British Columbia Institute of Technology (BCIT)',
    gpa: 'GPA: 88%',
    date: `Expected ${site.graduation}`,
    program: site.program,
    coursework: 'OOP, Database Systems, Agile Development, UX/UI Design, Web Application Development',
  },
  skills: [
    ['Languages', 'JavaScript (ES6+), TypeScript, Python, SQL'],
    ['Front end', 'React, Vite, Tailwind CSS, HTML, CSS'],
    ['Back end & data', 'Node.js, Express, MongoDB (Mongoose), Redis (Upstash), SQLite'],
    ['Auth & APIs', 'REST APIs, JWT, Auth0 (GitHub OAuth), WebSockets'],
    ['Tools & testing', 'Git, GitHub, Vercel, Figma, pytest, Playwright'],
  ] as [string, string][],
  projects: [
    {
      name: 'SkillMatch',
      detail: 'Full-Stack Workshop Marketplace',
      links: [
        { label: 'Live App', href: 'https://skillmatch-web.vercel.app/' },
        { label: 'Team Repo', href: 'https://github.com/ClaisaZ/IDSP-MarketPlace-FSWD' },
        { label: 'Case Study', href: `${site.url}/work/skillmatch` },
      ],
      date: 'Spring 2026',
      stack: 'React, TypeScript, Express, MongoDB, JWT, Vercel',
      role: 'Backend & DevOps Lead (3-person team), top committer (114 of ~245 commits)',
      bullets: [
        'Built the attend, review, and host-a-workshop flows end to end, from React screens to JWT-protected Express routes.',
        'Worked on first-load latency by preloading key routes, splitting React and UI libraries into separately cached chunks, and keeping MongoDB Atlas warm with a five-minute keepalive ping.',
        'Added capacity feedback that blocks full workshops, and replaced browser alerts with toast notifications.',
      ],
    },
    {
      name: 'GitScribe',
      detail: 'Hack the Break 2026, Top 6 of 36 Teams',
      links: [
        { label: 'Live Demo', href: 'https://git-scribe-aybm.vercel.app/' },
        { label: 'Repo', href: 'https://github.com/adriencyr/GitScribe' },
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
      detail: 'Local LLM Chat Bot',
      links: [{ label: 'Repo', href: 'https://github.com/ShervinBabaei2007/Discord-ai-bridge' }],
      date: 'March – April 2026',
      stack: 'Python, discord.py, LM Studio, REST API, asyncio',
      bullets: [
        'Connected a Discord bot to a locally hosted Qwen 3.5 9B model through LM Studio’s OpenAI-compatible API.',
        'Kept the bot responsive during generation by moving the blocking HTTP call into a worker thread with asyncio.to_thread().',
        'Reported connection, HTTP, and malformed-response failures as plain messages in the channel instead of failing silently.',
      ],
    },
  ] as ResumeProject[],
}
