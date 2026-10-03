export type ResumeLink = { label: string; href: string };

export type ResumeProject = {
  name: string;
  detail?: string;
  links?: ResumeLink[];
  date: string;
  stack: string;
  role?: string;
  bullets: string[];
};

export const resume = {
  name: 'Shervin Babaei',
  title: 'Full-Stack Developer',
  location: 'Vancouver, BC',
  email: 'shervinb22@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/ShervinBabaei2007' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shervin-babaei/' },
  ] satisfies ResumeLink[],
  summary:
    'Full-stack developer building AI-integrated tooling and local LLM infrastructure. MERN/TypeScript across deployed production projects. Hack The Break 2026 Top-6 Finalist out of 36 teams.',
  education: {
    school: 'British Columbia Institute of Technology (BCIT)',
    gpa: 'GPA: 88%',
    date: 'Expected May 2027',
    program: 'Diploma in Full-Stack Web Development',
    coursework: 'OOP, Database Systems, Agile Development, UX/UI Design, Web Application Development',
  },
  skills: [
    ['Languages', 'JavaScript (ES6+), TypeScript, Python, SQL'],
    ['Frameworks & Libraries', 'React, Flask, TanStack, Node.js, Express.js, TailwindCSS'],
    ['Databases & Caching', 'MySQL, PostgreSQL, MongoDB, Redis, Drizzle ORM, Sequelize, SQLAlchemy'],
    ['Cloud & DevOps', 'AWS (EC2, S3), Docker, Vercel, GitHub Actions, Git, Jira, Figma, pytest, Jest'],
    ['Auth & APIs', 'REST APIs, WebSockets, JWT, OAuth 2.0, Better Auth'],
  ] as [string, string][],
  projects: [
    {
      name: 'SkillMatch',
      detail: 'Full-Stack Marketplace',
      links: [
        { label: 'Live App', href: 'https://skillmatch-web.vercel.app/' },
        { label: 'Team Repo', href: 'https://github.com/ClaisaZ/IDSP-MarketPlace-FSWD' },
        { label: 'My Repo', href: 'https://github.com/ShervinBabaei2007/SkillMatch' },
      ],
      date: 'April 2026',
      stack: 'MongoDB, Express.js, React, Node.js, JWT, Vercel, shadCN',
      role: 'Backend & DevOps Lead (3-person team)',
      bullets: [
        'Shipped automated Vercel deployments on every merge by configuring GitHub Actions CI/CD pipelines, eliminating manual release overhead across a 3-person team.',
        'Enforced secure permission separation between instructors and students by implementing RBAC via JWT and linking registration limits to MongoDB transaction hooks, preventing unauthorized cross-role data access.',
        'Eliminated recurring build failures on Vercel by resolving ESM/CommonJS module conflicts through refactoring legacy dependencies to native Node.js modules.',
      ],
    },
    {
      name: 'GitScribe',
      detail: 'Hack The Break 2026 (Top 6 / 36 Teams)',
      links: [
        { label: 'Repo', href: 'https://github.com/adriencyr/GitScribe' },
        { label: 'Live Demo', href: 'https://git-scribe-aybm.vercel.app/' },
      ],
      date: 'March 2026',
      stack: 'React, TypeScript, Auth0, LLM Integration',
      role: 'UI/UX Lead & Core Developer (4-person team)',
      bullets: [
        'Achieved a 92 Lighthouse performance score by translating Figma designs into a lazy-loaded React/TypeScript dashboard with optimized component architecture.',
        'Reduced user authentication steps by 50% by bypassing Auth0 SDK version conflicts with a custom GitHub OAuth SSO flow.',
        'Delivered a full AI commit message feature within a 24-hour sprint by architecting a real-time LLM pipeline from GitHub diff output to structured commit message UI, contributing to a Top-6 finish out of 36 teams.',
      ],
    },
    {
      name: 'Discord AI Automation Bridge',
      date: 'March 2026 – April 2026',
      stack: 'Python, Discord.py, LM Studio, REST API, asyncio',
      bullets: [
        'Enabled real-time AI conversations on a live Discord server by integrating a local Qwen 3.5 9B model via the LM Studio API through a custom !ask command.',
        'Preserved bot responsiveness under concurrent load by offloading LLM inference to background threads via asyncio.to_thread(), eliminating main event loop blocking.',
        'Maintained bot uptime during LLM server failures by building layered exception handling across connection, API, and HTTP failure paths with user-facing error responses.',
      ],
    },
    {
      name: 'ThinkBoard',
      detail: 'Full-Stack Notes Application',
      date: 'March 2026 – April 2026',
      stack: 'MongoDB, Express, React, Node.js, Redis (Upstash), Tailwind CSS',
      bullets: [
        'Guaranteed data integrity at the persistence layer by centralizing request validation across Express middleware and Mongoose schemas, preventing malformed submissions from reaching the database.',
        'Protected the API from abuse by integrating Upstash Redis rate-limiting with a sliding window algorithm, capping throughput at 50 requests per 60 seconds and returning graceful 429 responses on breach.',
        'Removed ambiguous UI state by synchronizing frontend and backend validation with real-time toast notifications, ensuring users receive accurate feedback on every CRUD operation without a page refresh.',
      ],
    },
  ] as ResumeProject[],
};
