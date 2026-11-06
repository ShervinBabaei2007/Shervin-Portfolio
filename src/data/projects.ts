/*
 * Every claim here was checked against the project's source code and git
 * history (October 2026). If you change a claim, keep it something you can
 * point to in a repo, a commit, or a live demo during an interview.
 */

import { commitsLine, facts, hackathonLine, mergedPrsLine } from './facts'

export type Screenshot = { src: string; alt: string; caption: string }

export type Snippet = {
  /** Path inside the repo, shown as the code block's title. */
  file: string
  /** Link to the file on GitHub. */
  href: string
  language: 'js' | 'ts' | 'tsx' | 'python'
  code: string
  /** One sentence on why this code matters. */
  caption: string
}

export type Project = {
  slug: string
  name: string
  category: 'Full-stack' | 'AI tools' | 'Systems' | 'Hackathon'
  /** Flagship projects get a large card on the home page; the rest are listed compactly. */
  flagship: boolean
  date: string
  subtitle: string
  summary: string
  role: string
  /** Team context, for example who else worked on it and how the work was split. */
  team: string
  highlight: string
  /** Recruiter/senior-engineer scan: what I owned, the decision I made, and evidence someone can inspect. */
  signal?: {
    ownership: string
    decision: string
    evidence: string
  }
  why: string
  /** What I personally built. On team projects this is the part interviewers ask about. */
  mine: string[]
  outcome: string
  tradeoff: string
  learned: string
  next: string
  /** Request path through the system, left to right. */
  architecture: { label: string; detail: string }[]
  stack: string[]
  github?: string
  teamRepo?: string
  live?: string
  screenshots?: Screenshot[]
  snippet?: Snippet
  /** A real recorded terminal session, used for command-line projects. */
  terminal?: { title: string; transcript: string }
  /**
   * A short silent screen recording of the real app. Record one with
   * `npm run record`, then add it here. `poster` is shown before it plays.
   */
  video?: { src: string; poster: string; caption: string; type?: 'video/mp4' | 'video/webm' }
  /** An interactive demo rendered on the case-study page. */
  demo?: 'rate-limiter'
}

export const projects: Project[] = [
  {
    slug: 'skillmatch',
    name: 'SkillMatch',
    category: 'Full-stack',
    flagship: true,
    date: 'Spring 2026',
    subtitle: 'A workshop marketplace where students attend, review, and host short classes.',
    summary:
      'A MERN marketplace for short skill workshops. I built the attend, review, and host-a-workshop flows and was the most active committer on a three-person team.',
    role: 'Backend & DevOps lead, 3-person team',
    team: `BCIT team project with Clayton Liang and Ky Thai. I wrote ${commitsLine} and merged ${mergedPrsLine.replace(' merged PRs', '')} pull requests in the team repo.`,
    highlight: `${mergedPrsLine}, ${commitsLine}`,
    signal: {
      ownership: 'Attend, review, and host flows across React, Express, JWT, and MongoDB.',
      decision: 'Treat workshop capacity as a server invariant, not just a disabled-button concern.',
      evidence: 'A live app, the team repository history, and the exact route source shown below.',
    },
    why: 'Students wanted a simple way to find focused workshops outside their regular courses, and to run one themselves if they had a skill to share.',
    mine: [
      'Built the attend-and-review flow: completing checkout registers you as an attendee, which then unlocks a star-rating review form.',
      'Wrote the Express routes for attending, reviewing, and hosting a workshop, behind the JWT middleware that protects them.',
      'Built the host-a-workshop flow end to end: form, preview, confirmation, and a POST route that saves to MongoDB, with form state restored when you go back to edit.',
      'Added capacity feedback: the attendance card changes colour at 75% and 90% full, and the Attend button is disabled once a workshop is full.',
      'Worked on first-load latency by preloading key routes, splitting React and UI libraries into separately cached chunks, and pinging MongoDB Atlas every five minutes so the first request of the day is less likely to hit a cold database connection.',
      'Replaced browser alert() errors with toast notifications and wrote a seed script for realistic workshop and user data.',
    ],
    outcome:
      'A live marketplace where students can browse, check out, attend, and review workshops, and anyone can host one. The frontend and Express API deploy together on Vercel.',
    tradeoff:
      'Workshop capacity is checked in the interface, not enforced by the API. That was quick to build and gives instant feedback, but the attend route only checks that you are not already attending, so two people taking the last seat at the same moment would both get in. The API should be the source of truth for anything a user could race.',
    learned:
      'Reading my own route back months later, the gaps are on the server, not the screen. A disabled button is a hint; the rule has to live in the API.',
    next: 'Make the attend route atomic with a single conditional update (only add the user if the attendee count is still below the seat count), and fix the owner check, which compares an ObjectId to a string and so never matches. Then add integration tests for both.',
    architecture: [
      { label: 'React + Vite', detail: 'TypeScript SPA, lazy routes' },
      { label: 'Express API', detail: 'Vercel service at /_/backend' },
      { label: 'JWT middleware', detail: 'protectRoute on writes' },
      { label: 'MongoDB Atlas', detail: 'Mongoose models, keepalive ping' },
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Vercel'],
    github: 'https://github.com/ShervinBabaei2007/SkillMatch',
    teamRepo: 'https://github.com/ClaisaZ/IDSP-MarketPlace-FSWD',
    live: 'https://skillmatch-web.vercel.app/',
    screenshots: [
      {
        src: '/projects/skillmatch-dashboard.webp',
        alt: 'SkillMatch dashboard with featured workshops, search, and recommended categories.',
        caption: 'Workshop dashboard',
      },
      {
        src: '/projects/skillmatch-workshop-details.webp',
        alt: 'Workshop detail page showing schedule, location, attendee list, and reviews.',
        caption: 'Workshop details',
      },
      {
        src: '/projects/skillmatch-registration.webp',
        alt: 'SkillMatch workshop registration form with attendee fields and a Register button.',
        caption: 'Registration flow',
      },
    ],
    snippet: {
      file: 'backend/routes/workshopRoutes.js',
      href: 'https://github.com/ShervinBabaei2007/SkillMatch/blob/main/backend/routes/workshopRoutes.js',
      language: 'js',
      caption: 'The attend route. It blocks duplicates but not overbooking, which is the trade-off described below.',
      code: `router.post('/:id/attend', protectRoute, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ error: 'Not found' });
    if (workshop.attendees.includes(req.user._id))
      return res.status(400).json({ error: 'Already attending' });

    workshop.attendees.push(req.user._id);
    await workshop.save();
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ error: 'Failed to attend' });
  }
});`,
    },
  },
  {
    slug: 'gitscribe',
    name: 'GitScribe',
    category: 'Hackathon',
    flagship: true,
    date: 'March 2026',
    subtitle: 'AI commit-message suggestions, built in 24 hours.',
    summary: `Compare two versions of your code and get a suggested commit message. Built at ${facts.hackathon.name}, where the team placed in the ${facts.hackathon.placement.toLowerCase()}.`,
    role: 'UI/UX lead and front-end developer',
    team: 'Hack the Break 2026 team project. I built the sign-in, navigation, and profile screens; teammates built the FastAPI backend and the OpenAI generation pipeline.',
    highlight: hackathonLine,
    signal: {
      ownership: 'Sign-in, navigation, profile UI, and the Auth0-to-GitHub entry path.',
      decision: 'Use managed OAuth in a 24-hour sprint and remove an unnecessary provider-selection step.',
      evidence: `Working live demo; the team placed in the ${facts.hackathon.placement.toLowerCase()}.`,
    },
    why: 'Writing a clear commit message is a small task people rush. GitScribe takes the before and after of a change and suggests one.',
    mine: [
      'Built the sign-in card, navigation bar, and profile layout from the team’s Figma designs.',
      'Passed Auth0’s connection option so “Continue with GitHub” goes straight to GitHub instead of stopping at Auth0’s choose-a-provider screen, one fewer screen between a visitor and the app.',
      'Kept the front end merging cleanly in a shared repo with several teammates pushing during a 24-hour sprint.',
    ],
    outcome:
      'A working demo, live today, that signs you in with GitHub and turns two file versions into a suggested commit message. The team placed in the top 6 of 36.',
    tradeoff:
      'We used Auth0’s GitHub connection instead of writing our own OAuth flow. Auth0 handled tokens, refresh, and session storage, which we could not have built safely in 24 hours. The cost is a third-party dependency and less control over the redirect and the look of the sign-in step.',
    learned:
      'In a 24-hour build, the useful contribution is often removing friction at the edges, like the first screen someone sees, so the core feature gets used.',
    next: 'Replace the hotlinked GitHub logo with a local SVG, move the inline styles into the component stylesheet, and add a loading state while the suggestion is generated.',
    architecture: [
      { label: 'React + Chakra UI', detail: 'TypeScript front end' },
      { label: 'Auth0', detail: 'GitHub connection' },
      { label: 'FastAPI', detail: 'Upload and compare endpoint' },
      { label: 'OpenAI + Redis', detail: 'Generation, cached messages' },
    ],
    stack: ['React', 'TypeScript', 'Auth0', 'GitHub OAuth', 'Figma'],
    github: 'https://github.com/adriencyr/GitScribe',
    live: 'https://git-scribe-aybm.vercel.app/',
    snippet: {
      file: 'src/components/LoginpageCard.tsx',
      href: 'https://github.com/adriencyr/GitScribe/blob/main/src/components/LoginpageCard.tsx',
      language: 'tsx',
      caption: 'Naming the connection skips Auth0’s provider picker and sends people straight to GitHub.',
      code: `const LoginPageCard = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div style={cardStyle}>
      <h1>GitScribe</h1>
      <p>Please sign in with your GitHub account to continue.</p>
      <button
        onClick={() =>
          loginWithRedirect({ authorizationParams: { connection: "github" } })
        }
      >
        Continue with GitHub
      </button>
    </div>
  );
};`,
    },
  },
  {
    slug: 'thinkboard',
    name: 'ThinkBoard',
    category: 'Full-stack',
    flagship: true,
    date: 'March – April 2026',
    subtitle: 'A notes app with a rate-limited Express API.',
    summary:
      'A MERN notes app with create, edit, and delete, plus a Redis sliding-window rate limiter that returns HTTP 429 and a matching screen in the UI.',
    role: 'Solo project',
    team: 'Built on my own.',
    highlight: '50 requests per 60 seconds, then HTTP 429',
    signal: {
      ownership: 'React UI, Express CRUD API, MongoDB model, and Redis rate-limit middleware.',
      decision: 'Use a sliding-window limiter, then question the shared key when fairness broke down.',
      evidence: 'Interactive reproduction on this site plus the exact middleware source.',
    },
    why: 'I wanted a small app where I owned every layer, so I could follow a single request from a button click to the database and back.',
    mine: [
      'Built the React interface and Express API for full create, read, update, and delete on notes.',
      'Added Upstash Redis sliding-window rate limiting as Express middleware: 50 requests per 60 seconds, then HTTP 429.',
      'Handled 429 in the interface with a dedicated rate-limited screen instead of a generic error.',
      'Required title and content in both the form and the Mongoose schema, and added toast messages so every create, edit, and delete reports its result.',
    ],
    outcome:
      'A working notes app where every action gives clear feedback, and the API protects itself (and the Upstash free tier) from bursts of requests.',
    tradeoff:
      'The limiter uses one fixed key, so all visitors share a single 50-request budget. That kept the code to a few lines and protects the free-tier quota, but one busy client can lock everyone out. Keying by IP address or user would isolate them, at the cost of more Redis keys.',
    learned: 'A rate limiter is only as fair as its key. Choosing what to count matters as much as the limit itself.',
    next: 'Key the limiter by IP, and return 400 with the field name when Mongoose validation fails. Right now a missing title falls through to a generic 500.',
    architecture: [
      { label: 'React + Tailwind', detail: 'Axios client, toasts' },
      { label: 'Rate limiter', detail: 'Upstash Redis, sliding window' },
      { label: 'Express routes', detail: '/api/notes CRUD' },
      { label: 'MongoDB', detail: 'Mongoose schema, timestamps' },
    ],
    stack: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Redis'],
    github: 'https://github.com/ShervinBabaei2007/MERN-thinkBoard',
    demo: 'rate-limiter',
    screenshots: [
      {
        src: '/projects/thinkboard-screen-1.webp',
        alt: 'ThinkBoard dark notes dashboard with existing notes and a New Note action.',
        caption: 'Notes dashboard',
      },
      {
        src: '/projects/thinkboard-screen-2.webp',
        alt: 'ThinkBoard create-note form with title and content fields.',
        caption: 'Create a note',
      },
      {
        src: '/projects/thinkboard-screen-3.webp',
        alt: 'ThinkBoard form showing an all-fields-required validation message.',
        caption: 'Validation feedback',
      },
      {
        src: '/projects/thinkboard-screen-4.webp',
        alt: 'ThinkBoard notes dashboard showing a successful note-created notification.',
        caption: 'Successful save',
      },
    ],
    snippet: {
      file: 'backend/src/middleware/rateLimiter.js',
      href: 'https://github.com/ShervinBabaei2007/MERN-thinkBoard/blob/main/backend/src/middleware/rateLimiter.js',
      language: 'js',
      caption:
        'Every request passes through this before reaching a route. The fixed key is the trade-off described below.',
      code: `// config/upstash.js: 50 requests per 60 seconds, sliding window
const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, "60 s"),
});

// middleware/rateLimiter.js
const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");
    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};`,
    },
  },
  {
    slug: 'discord-ai-bridge',
    name: 'Discord AI Bridge',
    category: 'AI tools',
    flagship: true,
    date: 'March – April 2026',
    subtitle: 'A Discord bot that answers questions with a model running on my own machine.',
    summary:
      'A Python bot that sends a Discord command to a local Qwen 3.5 9B model through LM Studio, without freezing the bot while the model thinks.',
    role: 'Solo project',
    team: 'Built on my own.',
    highlight: 'Local inference moved off the event loop',
    signal: {
      ownership: 'Discord command flow, local LM Studio bridge, error handling, and the async fix.',
      decision: 'Move the blocking request off the event loop before considering a full async-client rewrite.',
      evidence: 'Source excerpt and an engineering note that explains the failure mode and trade-off.',
    },
    why: 'I wanted to see what it takes to put a locally hosted language model behind a real chat interface, with no cloud API in between.',
    mine: [
      'Connected discord.py to LM Studio’s OpenAI-compatible endpoint and a local Qwen 3.5 9B model, triggered by the !.ask command.',
      'Moved the blocking HTTP call into a worker thread with asyncio.to_thread(), so the bot keeps handling other messages while a reply is generated.',
      'Turned connection failures, HTTP errors, and unexpected responses into plain messages in the channel instead of silent failures.',
    ],
    outcome:
      'People in the server can ask the local model a question with one command, and the bot stays responsive while it answers.',
    tradeoff:
      'I kept the requests library and wrapped it in asyncio.to_thread() instead of switching to an async HTTP client like aiohttp. It fixed the blocking with one line and code I already understood. The cost is a thread per request and no way to cancel one once it starts.',
    learned:
      'Async code only stays async if every slow call respects it. One blocking request can freeze the whole bot.',
    next: 'Add a timeout to the model request (today a hung model server holds a thread forever), and split replies longer than Discord’s 2,000-character message limit.',
    architecture: [
      { label: 'Discord', detail: '!.ask command' },
      { label: 'discord.py', detail: 'Event loop stays free' },
      { label: 'Worker thread', detail: 'asyncio.to_thread()' },
      { label: 'LM Studio', detail: 'Qwen 3.5 9B, local' },
    ],
    stack: ['Python', 'discord.py', 'LM Studio', 'REST API', 'asyncio'],
    github: 'https://github.com/ShervinBabaei2007/Discord-ai-bridge',
    snippet: {
      file: 'discord_ai_bridge/main.py',
      href: 'https://github.com/ShervinBabaei2007/Discord-ai-bridge/blob/main/discord_ai_bridge/main.py',
      language: 'python',
      caption: 'The blocking call runs in a worker thread, so the event loop keeps serving other messages.',
      code: `try:
    # Run the blocking request in a thread so the bot stays responsive
    response = await asyncio.to_thread(requests.post, API_URL, json=payload)
    response.raise_for_status()
    ai_response = response.json()["choices"][0]["message"]["content"]

    await message.channel.send(
        ai_response, allowed_mentions=discord.AllowedMentions(everyone=False)
    )
except requests.exceptions.ConnectionError:
    await message.channel.send("⚠️ Error: LM Studio server is not running.")
except requests.exceptions.HTTPError as e:
    await message.channel.send(f"⚠️ Server Error: {e.response.status_code}")`,
    },
  },
  {
    slug: 'mini-rpg-battle',
    name: 'Mini RPG Battle',
    category: 'Systems',
    flagship: false,
    date: '2026',
    subtitle: 'A terminal RPG with combat, loot, bosses, and save files.',
    summary:
      'A turn-based Python RPG with progression, weighted loot, boss encounters, and JSON save and load, covered by pytest.',
    role: 'Solo project',
    team: 'Built on my own.',
    highlight: 'JSON save and load, 3 passing pytest tests',
    why: 'Games are a compact way to practise state: health, inventory, levels, and saves all have to stay consistent.',
    mine: [
      'Separated combat, progression, inventory, and terminal output into their own classes and functions.',
      'Built turn-based combat, boss encounters with a pity counter, weighted loot, and player progression.',
      'Added JSON save and load for player state, with pytest tests.',
    ],
    outcome:
      'A playable game whose progress survives between sessions. The session on this page was recorded from the real program.',
    tradeoff:
      'Saves are plain JSON rather than pickle. JSON is readable and safe to load, but every field has to be mapped by hand in both directions.',
    learned: 'Keeping game rules separate from printing made the rules testable without running the game.',
    next: 'The save menu prints “saved successfully” before the file is written, so a failed write still reports success. I’d move the message after the write and add a test for a failed save.',
    architecture: [
      { label: 'Menu loop', detail: 'Terminal input' },
      { label: 'Battle', detail: 'Turn-based rules' },
      { label: 'Player state', detail: 'Inventory, pity counters' },
      { label: 'JSON file', detail: 'Save and load' },
    ],
    stack: ['Python', 'Object-oriented design', 'pytest', 'JSON'],
    github: 'https://github.com/ShervinBabaei2007/Mini-RPG-Battle',
    terminal: {
      title: 'python main.py',
      transcript: `==========================================
          ⚔   WARRIOR'S PATH   ⚔
==========================================
  Name:    Hero
  Level:   0    XP: 0
  HP:      [**********----------] 100/200
  ATK:     15    DEF: 5
------------------------------------------
  [1]  Fight      [2]  Inventory (0 items)
  [3]  Equip      [4]  Use Item
  [5]  Exit       [6]  Save     [7]  Load
==========================================
  Choose: 1
==========================================
  Battle: Hero vs Enemy
==========================================
  You deal 10 damage.   Enemy HP: 90
  Enemy deals 10 damage.  Your HP: 190
  ...
  You deal 10 damage.   Enemy HP: 0
  Stats upgraded! ATK: 25 | DEF: 10
  Level: 0 | XP: 50
  Loot: Rusty Dagger
  *** Victory! Survived 10 rounds. ***
  Choose: 6
Saving Players data...
Writing File...
Player data saved sucessfully.

$ cat playerSave.json
{"KeyXP": 50, "KeyInv": [{"name": "Rusty Dagger", "type": "weapon"}],
 "KeyLvl": 0, "KeyHp": 110, "KeyMaxHp": 200, "KeyAtk": 25, "KeyDef": 10, ...}`,
    },
  },
  {
    slug: 'job-application-tracker',
    name: 'Job Application Tracker',
    category: 'Systems',
    flagship: false,
    date: '2026',
    subtitle: 'A command-line tool for keeping a job search organized.',
    summary:
      'A Python CLI for tracking co-op and junior applications, stored in SQLite, with status updates and filtering.',
    role: 'Solo project',
    team: 'Built on my own.',
    highlight: 'SQLite-backed, no dependencies',
    why: 'Job searching at volume gets messy fast. I wanted one local place for statuses, dates, links, and notes.',
    mine: [
      'Designed a menu-driven CLI for adding applications with company, role, status, date, link, and notes.',
      'Stored everything in SQLite with Python’s built-in sqlite3 module, so data persists between runs.',
      'Added status updates (Applied, Interview, Rejected, Offer, Accepted) with validation, and filtering by status.',
    ],
    outcome:
      'A dependency-free tool that keeps a full application history on your own machine. The session on this page was recorded from the real program.',
    tradeoff:
      'A terminal interface instead of a web one. It was fast to build and keeps data on my machine, but it is harder to use on a phone.',
    learned:
      'Even a small CLI benefits from a clear data model, and persistent storage changes how you think about program state.',
    next: 'Add editing and deleting, sorting by date, CSV export, and eventually a small Flask front end.',
    architecture: [
      { label: 'Menu loop', detail: 'input() prompts' },
      { label: 'Validation', detail: 'Status and date checks' },
      { label: 'sqlite3', detail: 'Parameterised queries' },
      { label: 'applications.db', detail: 'Local file' },
    ],
    stack: ['Python', 'SQLite', 'CLI design', 'CRUD'],
    github: 'https://github.com/ShervinBabaei2007/Job-Application-Tracker',
    terminal: {
      title: 'python main.py',
      transcript: `[1] Add application
[2] View all
[3] Update status
[4] Filter by status
[5] Exit
Choose: 1
Company: Klue
Role: Software Co-op
Status: Interview
Job link: https://example.com/coop
Notes: Tech screen Thursday
Use today's date? (Y/N): Y
Application added successfully

Choose: 4
Status (Applied, Interview, Rejected, Offer, Accepted): Interview
2 | Klue | Software Co-op | Interview | 2026-10-03 | https://example.com/coop | Tech screen Thursday`,
    },
  },
  {
    slug: 'jinterest',
    name: 'Jinterest',
    category: 'Full-stack',
    flagship: false,
    date: '2026',
    subtitle: 'A mood board built with vanilla JavaScript.',
    summary:
      'A single-page mood board with resizable, reorderable image cards, draggable pop-outs, undo and redo, and localStorage persistence.',
    role: 'Course project',
    team: 'BCIT course assignment, built on my own.',
    highlight: 'Undo/redo and session restore, no framework',
    why: 'I wanted to understand DOM updates, UI state, and events without a framework doing the work.',
    mine: [
      'Built a card system with display and edit modes, where only one card can be edited at a time.',
      'Used one delegated event handler instead of a listener on every card and button.',
      'Saved order, size, image URLs, pop-out state, and positions to localStorage, with undo, redo, and keyboard shortcuts.',
    ],
    outcome: 'A framework-free app that restores your exact previous board on refresh.',
    tradeoff:
      'Snapshots of the whole board for undo instead of recording individual changes. Simple and reliable, but memory grows with every step.',
    learned: 'Keeping UI and stored state in sync is much easier when every event flows through one handler.',
    next: 'Add image uploads, multiple boards, and automated tests for the undo and redo history.',
    architecture: [
      { label: 'DOM events', detail: 'One delegated handler' },
      { label: 'Board state', detail: 'Cards, order, positions' },
      { label: 'History', detail: 'Undo and redo stacks' },
      { label: 'localStorage', detail: 'Restore on load' },
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'localStorage'],
    github: 'https://github.com/ShervinBabaei2007/Jinterest',
  },
  {
    slug: 'jicnic',
    name: 'Jicnic',
    category: 'Full-stack',
    flagship: false,
    date: '2026',
    subtitle: 'Live availability voting for planning a picnic.',
    summary:
      'A group votes on which days they are free, sees everyone’s votes update live over WebSockets, and checks the forecast for each day.',
    role: 'Course project',
    team: 'BCIT course assignment, built on my own.',
    highlight: 'Live WebSocket updates, API key kept server-side',
    why: 'I wanted to combine AJAX, WebSockets, sign-in, and a third-party API in one small app.',
    mine: [
      'Built a Node and Express backend with cookie sessions and bcrypt, and a vanilla JavaScript front end using fetch.',
      'Used WebSocket messages only as a signal to re-fetch, which kept real-time logic separate from data logic.',
      'Served the OpenWeatherMap key from a sign-in-protected route and cached forecasts to respect rate limits.',
    ],
    outcome: 'Every connected person sees vote changes immediately, and forecasts quietly disappear when signed out.',
    tradeoff:
      'WebSocket messages carry no data, only “something changed”. That costs an extra request per update but means there is only one code path for loading votes.',
    learned:
      'Request order and failure states mattered more than the happy path, especially around keeping the API key private.',
    next: 'Add multiple events, a “best day” summary, and tests for the vote and socket flow.',
    architecture: [
      { label: 'Browser', detail: 'fetch + WebSocket' },
      { label: 'Express', detail: 'Sessions, bcrypt' },
      { label: 'ws server', detail: 'Change notifications' },
      { label: 'OpenWeatherMap', detail: 'Key stays server-side' },
    ],
    stack: ['Node.js', 'Express', 'WebSockets', 'OpenWeatherMap API', 'bcrypt', 'JavaScript'],
    github: 'https://github.com/ShervinBabaei2007/Jicnic',
  },
]

export const flagshipProjects = projects.filter((project) => project.flagship)
export const moreProjects = projects.filter((project) => !project.flagship)

export function findProject(slug: string | undefined): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
