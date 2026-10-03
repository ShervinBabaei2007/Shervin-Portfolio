export type Project = {
  name: string
  number: string
  category: 'Full-stack' | 'AI tools' | 'Systems' | 'Hackathon'
  subtitle: string
  summary: string
  role: string
  highlight: string
  why: string
  goal: string
  process: string[]
  outcome: string
  learned: string
  next: string
  stack: string[]
  github?: string
  live?: string
  screenshots?: { src: string; alt: string; caption: string }[]
  visual: 'skillmatch' | 'thinkboard' | 'rpg' | 'gitscribe' | 'discord'
  featured?: boolean
}

export const projects: Project[] = [
  {
    name: 'SkillMatch',
    number: '01',
    category: 'Full-stack',
    subtitle: 'Workshop discovery, registration, and role-based access.',
    summary: 'A marketplace where students can find short workshops and instructors can share skills beyond the standard curriculum.',
    role: 'Backend & DevOps lead, 3-person team',
    highlight: 'Vercel deployments automated on every merge',
    why: 'The project explores a more organized way for students to find focused workshops outside their regular courses.',
    goal: 'Build a marketplace with distinct student and instructor flows, workshop registration, and deployment the team could repeat.',
    process: [
      'Implemented JWT-based separation between student and instructor permissions.',
      'Connected workshop registration limits to MongoDB transaction hooks.',
      'Configured GitHub Actions for Vercel deployments on merges and resolved ESM/CommonJS build issues.',
    ],
    outcome: 'Automated Vercel deployments on every merge with a GitHub Actions CI/CD workflow, replacing manual release steps for the team.',
    learned: 'Permissions, registration limits, and deployment all shape whether the workshop flow works reliably for each role.',
    next: 'I’d add integration tests for role permissions, registration capacity, and the deployment build.',
    stack: ['MongoDB', 'Express', 'React', 'JavaScript', 'TypeScript', 'Node.js', 'JWT', 'GitHub Actions', 'Vercel'],
    github: 'https://github.com/ShervinBabaei2007/SkillMatch',
    live: 'https://skillmatch-web.vercel.app/',
    screenshots: [
      { src: '/projects/skillmatch-dashboard.png', alt: 'SkillMatch dashboard with featured workshops, search, and recommended categories.', caption: 'Workshop dashboard' },
      { src: '/projects/skillmatch-workshop-details.png', alt: 'Workshop detail page showing schedule, location, attendee list, and reviews.', caption: 'Workshop details' },
      { src: '/projects/skillmatch-registration.png', alt: 'SkillMatch workshop registration form with attendee fields and a Register button.', caption: 'Registration flow' },
    ],
    visual: 'skillmatch',
    featured: true,
  },
  {
    name: 'GitScribe',
    number: '02',
    category: 'Hackathon',
    subtitle: 'AI commit-message suggestions from GitHub diffs.',
    summary: 'Built by a four-person team during a 24-hour sprint at Hack the Break 2026; placed in the Top 6 of 36 teams.',
    role: 'UI/UX lead and core developer',
    highlight: '50% fewer sign-in steps · Top 6 of 36 teams',
    why: 'Developers spend time turning code changes into useful commit messages; GitScribe generates suggestions from GitHub diffs.',
    goal: 'Deliver a usable AI commit-message flow and dashboard with a clear sign-in path within the 24-hour hackathon.',
    process: [
      'Translated Figma designs into a lazy-loaded React and TypeScript dashboard with 10+ reusable components.',
      'Resolved Auth0 SDK compatibility issues and implemented GitHub OAuth sign-in.',
      'Connected GitHub diff output to the AI commit-message interface as part of the four-person team.',
    ],
    outcome: 'Reduced GitScribe sign-in steps by 50% by resolving Auth0 SDK compatibility issues and implementing GitHub OAuth. The dashboard scored 92 on Lighthouse Performance; the team placed Top 6 of 36.',
    learned: 'A fast build still depends on the whole path working together: sign-in, dashboard, GitHub diff, and generated suggestion.',
    next: 'I’d measure sign-in with a repeatable baseline and test empty or unusually large diffs.',
    stack: ['React', 'JavaScript', 'TypeScript', 'Auth0', 'GitHub OAuth', 'LLM integration', 'Figma'],
    github: 'https://github.com/adriencyr/GitScribe',
    live: 'https://git-scribe-aybm.vercel.app/',
    visual: 'gitscribe',
    featured: true,
  },
  {
    name: 'ThinkBoard',
    number: '03',
    category: 'Full-stack',
    subtitle: 'A focused notes app with a full-stack foundation.',
    summary: 'A notes app for creating, editing, and organizing notes through a React interface and Express API.',
    role: 'Full-stack project',
    highlight: '50 requests per 60 seconds · HTTP 429 rate limit',
    why: 'The project focuses on a straightforward notes workflow with clear feedback when an action succeeds or fails.',
    goal: 'Build full CRUD flows while validating data at the API and database boundaries and limiting excessive requests.',
    process: [
      'Added request validation in Express and schema validation with Mongoose.',
      'Integrated Upstash Redis sliding-window rate limiting with a 50-request-per-60-second cap and 429 responses.',
      'Added toast notifications so CRUD actions report their result without a page refresh.',
    ],
    outcome: 'Added Upstash Redis sliding-window rate limiting with a 50-request-per-60-second cap and HTTP 429 responses after the limit.',
    learned: 'Validation at both the API and data layers helps keep invalid input out, while clear feedback keeps the interface in sync with actions.',
    next: 'I’d add integration tests for invalid input, rate-limit boundaries, and Redis connection failures.',
    stack: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Redis'],
    github: 'https://github.com/ShervinBabaei2007/MERN-thinkBoard',
    screenshots: [
      { src: '/projects/thinkboard-screen-1.png', alt: 'ThinkBoard dark notes dashboard with existing notes and a New Note action.', caption: 'Notes dashboard' },
      { src: '/projects/thinkboard-screen-2.png', alt: 'ThinkBoard create-note form with title and content fields.', caption: 'Create a note' },
      { src: '/projects/thinkboard-screen-3.png', alt: 'ThinkBoard form showing an all-fields-required validation message.', caption: 'Validation feedback' },
      { src: '/projects/thinkboard-screen-4.png', alt: 'ThinkBoard notes dashboard showing a successful note-created notification.', caption: 'Successful save' },
    ],
    visual: 'thinkboard',
    featured: true,
  },
  {
    name: 'Discord AI Automation Bridge',
    number: '04',
    category: 'AI tools',
    subtitle: 'A Discord bot that connects chat to a local language model.',
    summary: 'A Python bot that sends a custom Discord command to a local Qwen 3.5 9B model through the LM Studio API.',
    role: 'Python development',
    highlight: 'Local model inference moved off the event loop',
    why: 'The project brings a locally hosted language model into a Discord conversation through a simple command.',
    goal: 'Answer `!ask` requests using LM Studio while keeping the bot responsive during model inference.',
    process: [
      'Connected discord.py to the LM Studio REST API and a local Qwen 3.5 9B model.',
      'Moved inference to background threads with `asyncio.to_thread()` so the event loop stays available.',
      'Handled connection, API, and HTTP failures with user-facing error responses.',
    ],
    outcome: 'Kept the bot responsive while the local model ran by moving inference off the main event loop with `asyncio.to_thread()`.',
    learned: 'Slow model calls need to stay off the event loop, and failures need a response the person using the bot can understand.',
    next: 'I’d add request cancellation and tests for model-server timeouts and malformed responses.',
    stack: ['Python', 'discord.py', 'LM Studio', 'REST API', 'asyncio'],
    visual: 'discord',
    featured: true,
  },
  {
    name: 'Mini RPG Battle',
    number: '05',
    category: 'Systems',
    subtitle: 'A terminal RPG built around game systems.',
    summary: 'A terminal-based Python RPG with turn-based combat, progression, inventory, weighted loot, and boss encounters.',
    role: 'Personal project',
    highlight: 'JSON save/load with tests',
    why: 'This project gave me a way to explore how game rules, progression, and state fit together in a program.',
    goal: 'Build a turn-based RPG with reusable combat and inventory systems, plus a way to save and restore progress.',
    process: [
      'Separated combat, progression, inventory, and terminal UI responsibilities.',
      'Added JSON save/load and tests in the Python project.',
      'Built turn-based combat, boss encounters, weighted loot, and player progression.',
    ],
    outcome: 'Added tested JSON save/load support so game state can be restored between sessions.',
    learned: 'Separating game rules from terminal output makes systems easier to test and extend.',
    next: 'I’d add deterministic loot tests and expand combat with status effects or skills.',
    stack: ['Python', 'Object-oriented design', 'pytest', 'JSON'],
    github: 'https://github.com/ShervinBabaei2007/Mini-RPG-Battle',
    visual: 'rpg',
    featured: true,
  },
]
