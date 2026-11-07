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
  /** Plain-language introduction for someone who has never heard of the project: what it is and who it is for. */
  overview?: string[]
  /** What it can do, one short everyday-language point each. */
  features?: { title: string; text: string }[]
  /** How it works from the user's side, in order, with no jargon. */
  howItWorks?: string[]
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
    slug: 'network-growth-assistant',
    name: 'Network Growth Assistant',
    category: 'Full-stack',
    flagship: true,
    date: 'Oct – Nov 2026',
    subtitle: 'A networking and job-search workspace that only counts what actually happened.',
    summary:
      'A Next.js and Supabase app for growing a professional network and running a job search: a daily outreach queue, a research assistant that quotes its sources, verified job postings, and an applications board.',
    role: 'Solo project, design to deployment',
    team: 'Built on my own. All 256 commits in the repository are mine.',
    highlight: '1,523 unit tests, 305 database tests, 256 commits',
    signal: {
      ownership:
        'The whole product: Next.js app, Supabase schema and row-level security, job crawler, and test suites.',
      decision: 'Return fewer people rather than lower the evidence bar, and count only accepted invitations.',
      evidence: 'A live app, a public repository with CI, and the safe-fetch source shown below.',
    },
    overview: [
      'Network Growth Assistant is a website that helps you meet more people in your field and run your job search, all in one place. It remembers who you want to contact, which messages are still waiting to be sent, and which jobs you have applied for.',
      'It is careful on purpose. It never logs into LinkedIn for you, never sends a message for you, and never counts something as done before it really happened. You do the human parts, and the app does the remembering and the research.',
    ],
    features: [
      {
        title: 'Quick capture',
        text: 'Copy a LinkedIn search page and paste it into the app. It turns the page into a tidy list of people, with their school and program already filled in. It only reads what you paste, and it never visits LinkedIn.',
      },
      {
        title: 'A to-do list for each day',
        text: 'Every day the app builds a short list of people to contact, based on the goals you set. You open each profile, send the invitation yourself, then tick it off.',
      },
      {
        title: 'Honest progress',
        text: 'Your progress bar only moves when someone actually accepts. Invitations that are still waiting are shown in a separate colour, so the numbers never flatter you.',
      },
      {
        title: 'Discover',
        text: 'Type a request like “Find 10 UBC alumni who work at Amazon”. The app searches public websites such as GitHub and ORCID, checks each fact on the person’s own page, and shows the proof next to every result. If it cannot back something up, it leaves it out.',
      },
      {
        title: 'Real jobs only',
        text: 'Jobs come from companies’ own career pages. Every link is checked before the Apply button turns on, and each job shows how well it fits your resume and what is missing.',
      },
      {
        title: 'Follow-ups and applications',
        text: 'When someone accepts, the app suggests a thank-you and later check-ins, with drafts you can edit. A board follows each job from saved to offer, and there is interview preparation for the ones that get that far.',
      },
    ],
    howItWorks: [
      'You add people by pasting a search page or importing a file.',
      'Each day the app sorts the new people and builds your list for the day.',
      'You open each profile and send the invitation yourself, then mark it as sent.',
      'When someone accepts, you record it, and the app creates the follow-up reminders for that person.',
      'The overview shows how close you are to your goals. Only accepted invitations count.',
      'You search for jobs, save the ones you like, track your applications, and prepare for interviews.',
    ],
    why: 'Networking tools tend to flatter you with vanity numbers or automate the part that should stay personal. I wanted one that is honest about progress and leaves every invitation and message to me.',
    mine: [
      'Built the Next.js 16 App Router front end with React 19, Tailwind CSS 4, and shadcn/ui, including light and dark themes and lists that turn into cards on a phone.',
      'Designed the Supabase Postgres schema with row-level security on every table, scoped to the owner, plus Auth (Google, password, emailed link), Storage, and pg_cron jobs.',
      'Wrote safe-fetch, the only path for fetching outside URLs: it refuses private and reserved addresses, pins the connection to the addresses it just checked, and follows redirects by hand.',
      'Built Discover, a research assistant over public sources that verifies each fact against the source page and drops any quote it cannot find, with scores computed by visible rules rather than a model.',
      'Built the Jobs search over employers’ own boards, where a posting gets an Apply button only after its link is verified.',
      'Wrote 1,523 unit tests and 305 pgTAP database tests, and ran axe-core accessibility scans in the Playwright end-to-end suite, with CI on GitHub Actions.',
    ],
    outcome:
      'A deployed app on Vercel and Supabase that never scrapes LinkedIn, never sends anything for you, and shows progress that cannot be inflated by pending invitations.',
    tradeoff:
      'Discover returns fewer people rather than weaker matches, and an AI model only writes text; scores, rankings, and fit are rules. That makes results explainable and checkable, but a short list can feel less impressive than a long, loosely matched one.',
    learned:
      'Security and honesty rules are easiest to keep when they live in one place: one function for outside fetches, one place for counting rules, and row-level security in the database instead of checks scattered through the app.',
    next: 'Run the screen-reader checklist (not done yet, and the README says so) and re-measure Lighthouse on production, which has not been repeated since the newest features landed.',
    architecture: [
      { label: 'Next.js 16', detail: 'App Router, server actions' },
      { label: 'proxy.ts', detail: 'Session refresh, sign-in redirect' },
      { label: 'Supabase', detail: 'Postgres, row-level security, Auth' },
      { label: 'pg_cron + API routes', detail: 'Crawler and alerts' },
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'Vercel', 'Vitest', 'GitHub Actions'],
    github: 'https://github.com/ShervinBabaei2007/Network-Growth-Assistance',
    live: 'https://linkedin-network-growth-assistance.vercel.app',
    screenshots: [
      {
        src: '/projects/nga-overview.webp',
        alt: 'Network Growth Assistant overview: a connection total against a goal, pipeline tiles, and progress per discipline.',
        caption: 'Overview (example data)',
      },
      {
        src: '/projects/nga-quick-capture.webp',
        alt: 'Quick capture turning a pasted search results page into rows with school and program already matched.',
        caption: 'Quick capture (example data)',
      },
      {
        src: '/projects/nga-discover.webp',
        alt: 'Discover results listing verified matches with a visible score and the reasons each person matches.',
        caption: 'Discover (example data)',
      },
      {
        src: '/projects/nga-jobs.webp',
        alt: 'Jobs page with verified postings, a fit score, and the matching requirements on each card.',
        caption: 'Jobs (example data)',
      },
    ],
    snippet: {
      file: 'src/lib/follow-ups/templates.ts',
      href: 'https://github.com/ShervinBabaei2007/Network-Growth-Assistance/blob/main/src/lib/follow-ups/templates.ts',
      language: 'ts',
      caption:
        'The four follow-up messages the app suggests after someone accepts an invitation, and when each is due. The messages come from fixed templates, not from an AI, so they can never include a made-up fact.',
      code: `/**
 * The follow-up touches after someone accepts an invitation, and a draft message for each. Drafts are built
 * from a template using only what the record holds (the person's name and, if known, their school and field),
 * never claim a conversation that did not happen, and are copied by the user, who sends them. Nothing here
 * calls an AI service, so a draft cannot contain an invented fact.
 */

export const FOLLOW_UP_KINDS = ["thank_you", "coffee_chat", "check_in_30", "check_in_90"] as const;
export type FollowUpKind = (typeof FOLLOW_UP_KINDS)[number];

export const FOLLOW_UP_LABELS: Record<FollowUpKind, { title: string; when: string }> = {
  thank_you: { title: "Thank them for connecting", when: "the day they accept" },
  coffee_chat: { title: "Ask for a short chat", when: "a week after" },
  check_in_30: { title: "Check in", when: "30 days after" },
  check_in_90: { title: "Catch up", when: "90 days after" },
};`,
    },
  },
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
    overview: [
      'SkillMatch is a website for short workshops. Instructors can post a class, and students can find one, sign up, and leave a review afterwards.',
      'It was a BCIT course project built by a team of three in four weeks. I worked on the parts where a student attends, reviews, and hosts a workshop.',
    ],
    features: [
      {
        title: 'Browse by topic',
        text: 'Workshops are grouped by topic, such as front-end, back-end, graphic design, DevOps, and databases. Tap a topic to see only those.',
      },
      {
        title: 'A page for every workshop',
        text: 'Each workshop shows its schedule, its location, who is attending, and what past students said.',
      },
      {
        title: 'Sign up and get a ticket',
        text: 'Registering gives you a reference number and a QR code receipt for the workshop.',
      },
      {
        title: 'Reviews from attendees',
        text: 'Once you have attended a workshop, a star-rating form opens up for it.',
      },
      {
        title: 'Host your own',
        text: 'Anyone with a skill to share can fill in a form, preview how the workshop will look, and publish it.',
      },
      {
        title: 'Seats left at a glance',
        text: 'The attendance card changes colour as a workshop fills up, and the Attend button switches off when it is full.',
      },
    ],
    howItWorks: [
      'You sign in. The site gives you a secure pass that proves who you are each time you do something.',
      'You browse the workshops and open one that looks interesting.',
      'You register, and your name is added to the list of people attending.',
      'After you have attended, the review form opens and you can leave a star rating.',
      'To host a workshop, you fill in a form, check the preview, confirm, and the workshop is saved for everyone to see.',
    ],
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
      caption:
        'What happens when someone presses Attend. It stops you from signing up twice, but it does not check whether the workshop is already full. That gap is explained in the trade-off below.',
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
    overview: [
      'GitScribe suggests commit messages. A commit message is the short note a programmer writes when saving a change to their code, like “Fix the login bug”. Good ones help everyone understand what changed, but they are easy to rush.',
      'You can use GitScribe on a website, or as a command in the terminal. It was built in 24 hours at Hack the Break 2026, where our team placed in the top 6 of 36. I built the website’s sign-in, navigation bar, and profile screens.',
    ],
    features: [
      {
        title: 'Compare two versions',
        text: 'Upload the old version of a file and the new one. GitScribe looks at what changed.',
      },
      {
        title: 'Suggested messages',
        text: 'You choose how many suggestions you want, and each one comes with a copy button.',
      },
      {
        title: 'Sign in with GitHub',
        text: 'One click takes you straight to GitHub to sign in, so there is no new account to create.',
      },
      {
        title: 'A terminal version',
        text: 'Typing gs generate in a project folder does the same job without opening the website.',
      },
    ],
    howItWorks: [
      'You sign in with your GitHub account.',
      'You upload the old version of your file, then the new version.',
      'You choose how many message suggestions you want.',
      'The site sends both versions to the team’s server, which asks an AI model to describe the change in a short message.',
      'The suggestions appear on screen, and you copy the one you like.',
    ],
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
    screenshots: [
      {
        src: '/projects/gitscribe-sign-in.webp',
        alt: 'GitScribe sign-in card with a Continue with GitHub button on a dark background.',
        caption: 'Sign-in screen I built',
      },
    ],
    snippet: {
      file: 'src/components/LoginpageCard.tsx',
      href: 'https://github.com/adriencyr/GitScribe/blob/main/src/components/LoginpageCard.tsx',
      language: 'tsx',
      caption:
        'Because the button names GitHub directly, people skip an extra “choose how to sign in” screen and go straight to GitHub.',
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
    overview: [
      'ThinkBoard is a simple notes app. You can write a note, edit it, and delete it, in a calm dark design with nothing in the way.',
      'I built every part myself so I could follow one action all the way from a button click to the database and back. It also protects itself by limiting how fast anyone can use it.',
    ],
    features: [
      {
        title: 'Write, edit, and delete notes',
        text: 'Every action updates the page straight away, with no waiting for a reload.',
      },
      {
        title: 'No empty notes',
        text: 'A note needs both a title and some content. The form and the database both check this.',
      },
      {
        title: 'Pop-up messages',
        text: 'Small messages tell you when a note was saved, changed, or deleted, and when something went wrong.',
      },
      {
        title: 'A slow-down screen',
        text: 'If too many requests come in at once, the app shows a friendly screen asking you to wait, instead of a confusing error.',
      },
      { title: 'A dark theme', text: 'A minimal dark design that keeps the focus on your notes.' },
    ],
    howItWorks: [
      'You press a button on the page, such as Save.',
      'The page sends your request to the server.',
      'The server first asks a counting service whether there have been too many requests in the last minute. The limit is 50.',
      'If there have been too many, the server says no and the page shows the slow-down screen.',
      'If not, the server saves the change to the database.',
      'The page updates and a small message confirms what happened.',
    ],
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
        'Every request goes through this check first. It counts requests and turns away any beyond 50 per minute. It counts everyone together, which is the trade-off described below.',
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
    flagship: false,
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
    overview: [
      'Discord AI Bridge is a Discord bot that answers questions using an AI that runs on my own computer instead of in the cloud. Type !.ask followed by a question in a chat channel, and the bot replies.',
      'I built it to learn what it takes to put an AI behind a real chat app, and to keep the bot from freezing while the AI thinks.',
    ],
    features: [
      { title: 'One command', text: 'Type !.ask and your question. The bot does the rest.' },
      {
        title: 'An AI on my own machine',
        text: 'The answers come from a model called Qwen 3.5 9B, running in a program called LM Studio on my computer. No outside AI service is involved.',
      },
      {
        title: 'Stays responsive',
        text: 'While the AI is thinking, the bot can still answer other people instead of freezing.',
      },
      {
        title: 'Clear error messages',
        text: 'If the AI program is not running, or something else goes wrong, the bot says what happened in the chat.',
      },
      {
        title: 'No accidental pings',
        text: 'Even if an answer contains @everyone, the bot will not notify the whole server.',
      },
      {
        title: 'Secrets stay secret',
        text: 'The bot’s login token lives in a private settings file, not in the code.',
      },
    ],
    howItWorks: [
      'Someone types !.ask and a question in the chat.',
      'The bot passes the question to LM Studio, the program that runs the AI on my computer.',
      'While it waits, the bot keeps doing other work on a separate track, so nobody is left hanging.',
      'The answer comes back and the bot posts it in the channel.',
      'If anything fails along the way, the bot posts a short explanation instead.',
    ],
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
      caption:
        'The bot sends the question to the AI on a separate track, so it can keep answering other people while it waits.',
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
    overview: [
      'Warrior’s Path is a fighting game you play in the terminal, a text-only window. You choose actions from a menu, fight enemies and bosses, collect loot, level up, and save your game to continue later.',
      'Games are a good way to practise keeping many things in step: health, items, levels, and saves all have to agree with each other.',
    ],
    features: [
      {
        title: 'Turn-based fights',
        text: 'You and the enemy take turns. Each hit does your attack minus their defence, and never less than zero.',
      },
      {
        title: 'Three bosses',
        text: 'A White Tiger, a Shadow Dragon, and an Ancient Golem. Which one you meet depends on your level.',
      },
      {
        title: 'Angry bosses',
        text: 'At half health a boss becomes enraged, and has a 30% chance of using a special attack.',
      },
      { title: 'Loot with odds', text: 'Common items drop often and rare ones very rarely, such as the Dragon Scale.' },
      {
        title: 'Bad luck protection',
        text: 'After 100 kills you get a guaranteed rare item, and after 10 boss fights a guaranteed boss reward.',
      },
      {
        title: 'Levels and saving',
        text: 'You can reach level 25. Each win makes you stronger, and your progress is saved to a file you can load later.',
      },
    ],
    howItWorks: [
      'A menu shows your health, level, and attack, and lets you fight, use items, equip gear, save, or load.',
      'In a fight, you and the enemy take turns until one of you runs out of health.',
      'If you win, you earn experience, a chance at loot, and stronger stats.',
      'Hidden counters keep track of your kills and boss fights, ready to give a guaranteed reward when they reach the limit.',
      'Saving writes everything about your character to a file. Loading reads it back.',
    ],
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
    snippet: {
      file: 'main.py',
      href: 'https://github.com/ShervinBabaei2007/Mini-RPG-Battle/blob/main/main.py',
      language: 'python',
      caption:
        'The “bad luck protection”. The game counts kills and boss fights, and once the count is high enough it hands out a guaranteed reward and starts counting again.',
      code: `    def check_rare_pity(self):
        if self.rare_pity >= 100:  # 100 kills required
            reward = random.choice(self.rare_items)
            self.inventory.append(reward)
            self.rare_pity = 0  # resets pity back to 0
            print(Fore.MAGENTA + Style.BRIGHT + f"  ✦ Pity reward: {reward['name']} ✦")

    def check_boss_pity(self):
        if self.boss_pity >= 10:  # 10 boss skills required
            reward = random.choice(self.boss_items)
            self.inventory.append(reward)
            self.boss_pity = 0  # resets pity back to 0
            print(
                Fore.MAGENTA
                + Style.BRIGHT
                + f"  ✦ Boss pity reward: {reward['name']} ✦"
            )`,
    },
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
    overview: [
      'Job Application Tracker is a small program for keeping track of the jobs you have applied for. When you apply to many places, it is easy to forget where you applied, when, and what happened since.',
      'It keeps everything in one place on your own computer, with no account and nothing to install.',
    ],
    features: [
      {
        title: 'Add an application',
        text: 'Record the company, the role, the status, the date, the job link, and any notes.',
      },
      { title: 'See everything at once', text: 'View all your applications in one list.' },
      {
        title: 'Update the status',
        text: 'Move an application between Applied, Interview, Rejected, Offer, and Accepted.',
      },
      { title: 'Filter by status', text: 'Show only the applications at the stage you care about, such as Interview.' },
      {
        title: 'Remembers everything',
        text: 'Your data is saved in a file on your computer, so it is still there the next time you open the program.',
      },
      { title: 'Checks what you type', text: 'It makes sure dates and statuses are valid before saving them.' },
    ],
    howItWorks: [
      'You start the program and choose an option from a menu.',
      'It asks you questions one at a time, such as the company and the role.',
      'It checks your answers, for example that the date is a real date.',
      'It saves the application to a small database file on your computer.',
      'The next time you start it, everything you saved is still there.',
    ],
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
    snippet: {
      file: 'main.py',
      href: 'https://github.com/ShervinBabaei2007/Job-Application-Tracker/blob/main/main.py',
      language: 'python',
      caption:
        'Showing only the applications with a chosen status. The question mark in the search keeps whatever you type from being treated as an instruction to the database.',
      code: `def filter_by_status():
    status = input("Status (Applied, Interview, Rejected, Offer, Accepted): ").strip()

    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT * FROM applications WHERE status = ?
    """,
        (status,),
    )

    rows = cursor.fetchall()
    connection.close()

    if not rows:
        print("No applications found")
        return

    for row in rows:
        print(
            f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]} | {row[6]}"
        )`,
    },
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
    overview: [
      'Jinterest is a mood board you build in your web browser. You add pictures, make them bigger or smaller, drag them around, and when you come back later the board is exactly as you left it. The page itself calls the board “Mood Jorts”.',
      'I built it without any helper libraries, using only plain HTML, CSS, and JavaScript, to understand how a web page really works underneath.',
    ],
    features: [
      {
        title: 'Add pictures',
        text: 'Paste a picture’s web address, or press the seed button to fill the board with random demo images.',
      },
      {
        title: 'Look and edit modes',
        text: 'A card normally shows only its picture. In edit mode it shows buttons to resize, move, and delete it. Only one card can be edited at a time.',
      },
      {
        title: 'Resize and reorder',
        text: 'Make a card bigger or smaller, and move it earlier or later on the board.',
      },
      { title: 'Pop-out cards', text: 'Lift a card out of the board so it floats, then drag it anywhere.' },
      { title: 'Undo and redo', text: 'Changed your mind? Step backwards and forwards through your changes.' },
      {
        title: 'Remembers your board',
        text: 'Everything, including sizes, order, and positions, is saved in your browser, so a refresh changes nothing.',
      },
    ],
    howItWorks: [
      'Before every change, the app takes a snapshot of the whole board for undo.',
      'It then makes your change, such as resizing a card.',
      'It redraws the cards on the page.',
      'It saves the new board in your browser.',
      'Pressing undo brings back the last snapshot, and keeps the current board so redo can bring it back.',
    ],
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
    snippet: {
      file: 'static/spa.js',
      href: 'https://github.com/ShervinBabaei2007/Jinterest/blob/main/static/spa.js',
      language: 'js',
      caption:
        'How undo and redo work. Before every change the board is saved as a snapshot. Undo brings back the last snapshot, and keeps the current board so redo can bring it back.',
      code: `// saving a snapshot of the cards before making any changes
function saveHistory() {
  history.push(JSON.stringify(cards));
  // clearing the future since a new action was taken
  future = [];
}

// going back to the previous state
function undo() {
  if (history.length === 0) return;
  // saving current state, to be able to redo it
  future.push(JSON.stringify(cards));
  // restores the last saved state
  cards = JSON.parse(history.pop());
  render();
}

// going forward to a state that was undone
function redo() {
  if (future.length === 0) return;
  history.push(JSON.stringify(cards));
  cards = JSON.parse(future.pop());
  render();
}`,
    },
    github: 'https://github.com/ShervinBabaei2007/Jinterest',
    screenshots: [
      {
        src: '/projects/jinterest-board.webp',
        alt: 'The Jinterest mood board with five image cards of different sizes and a toolbar with undo, redo, and help.',
        caption: 'A seeded board',
      },
    ],
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
    overview: [
      'Jicnic is a website for planning a picnic with friends. Everyone says which days they can come, and everyone sees each other’s answers the moment they change, without refreshing the page.',
      'I built it to combine several things in one small app: signing in, live updates, and a weather forecast from another service.',
    ],
    features: [
      {
        title: 'Vote for each day',
        text: 'For every day, choose Yes or No, or leave it unset. Your own votes are highlighted so you can see what you picked.',
      },
      {
        title: 'Live updates',
        text: 'When anyone votes, every other person with the page open sees it straight away.',
      },
      {
        title: 'Weather forecast',
        text: 'Each day shows the expected high temperature and a weather icon, so you can pick a nice day.',
      },
      {
        title: 'Sign in',
        text: 'Your votes are saved under your name, and the weather forecast only shows while you are signed in.',
      },
      {
        title: 'Private key',
        text: 'The weather service’s secret key never sits in the page. The server hands it only to people who are signed in.',
      },
      {
        title: 'Gentle on the weather service',
        text: 'Forecasts are saved in your browser for a while, so the app does not keep asking for the same thing.',
      },
    ],
    howItWorks: [
      'You sign in with a username and password.',
      'The page asks the server for the latest votes and shows them.',
      'When you vote, your choice is sent to the server and saved.',
      'The server sends a short “something changed” message to everyone else who has the page open.',
      'Each of those pages asks the server for the latest votes again, so they all match.',
      'Forecasts are fetched with a key the server gives only to signed-in people.',
    ],
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
    snippet: {
      file: 'server.js',
      href: 'https://github.com/ShervinBabaei2007/Jicnic/blob/main/server.js',
      language: 'js',
      caption:
        'How everyone sees votes instantly. When one person votes, the server passes a short message to everybody else who has the page open.',
      code: `// when our client votes, we will send it to all other clients (like a radio (broadcasting it) to them)
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // sending to everyone except the sender
    for (const client of wss.clients) {
      if (client !== ws && client.readyState === 1) {
        client.send(message);
      }
    }
  });
});`,
    },
    github: 'https://github.com/ShervinBabaei2007/Jicnic',
    screenshots: [
      {
        src: '/projects/jicnic-voting.webp',
        alt: 'Jicnic voting board with five days, yes, maybe, and no buttons, and colored vote bars for each person.',
        caption: 'Voting board, signed in as a test user',
      },
    ],
  },
  {
    slug: 'linklocker',
    name: 'LinkLocker',
    category: 'Full-stack',
    flagship: false,
    date: 'October 2026',
    subtitle: 'A URL shortener with Google sign-in, deployed on an Azure VM.',
    summary:
      'Paste a long URL, get a short link that redirects to it. Built as a two-person course project, with Google OAuth protecting link creation and the app served over HTTPS from Azure.',
    role: 'Application and authentication developer, 2-person team',
    team: 'BCIT course project with a teammate who set up the infrastructure. I made 15 of the 49 commits; they made 34.',
    highlight: 'Google OAuth with passport.js, live on Azure',
    overview: [
      'LinkLocker is a link shortener. You paste a long web address and get a short one. When someone opens the short link, they are sent to the original page.',
      'It was a two-person course project. I built the app and the sign-in, and my teammate set up the server it runs on, so it is really online.',
    ],
    features: [
      { title: 'Short links', text: 'Paste any web address and get a short link back.' },
      {
        title: 'Sign in with Google',
        text: 'Only signed-in people can create links, so there is no need to make a new password.',
      },
      { title: 'Spam protection', text: 'Each person can create only 20 links every 15 minutes.' },
      {
        title: 'Checks the address',
        text: 'It only accepts web addresses that start with http or https, and turns anything else away.',
      },
      { title: 'Really online', text: 'It runs on a server in Azure with a secure HTTPS address.' },
    ],
    howItWorks: [
      'You sign in with your Google account.',
      'You paste a long web address.',
      'The app checks it is a real web address, makes a short random code, and saves the pair.',
      'If that code is already taken, it quietly tries a new one.',
      'When anyone opens the short link, the app looks up the code and sends them to the original page.',
    ],
    why: 'The course asked for an app that is actually deployed, so the work was as much about getting a real server and sign-in flow running as about the shortener itself.',
    mine: [
      'Built the front end and the Express backend for URL shortening, backed by MongoDB (Milestone A).',
      'Implemented Google OAuth with passport.js, the auth routes, user sessions, and login-protected link creation (Milestone B).',
      'Registered the production OAuth callback and wrote the Milestone B write-up.',
    ],
    outcome: 'A live shortener at its own HTTPS address. Milestones A and B are complete; Milestone C was not reached.',
    tradeoff:
      'Everything runs on one Azure VM: Nginx terminates HTTPS and forwards to Express on 127.0.0.1:3000, managed by PM2. It keeps the setup small and only Nginx is public, but there is no redundancy if the VM goes down.',
    learned:
      'Sign-in works locally long before it works in production: the OAuth callback and environment variables have to match the deployed address exactly.',
    next: 'Finish Milestone C, which the README lists as not reached yet, and add tests around the redirect and the login-protected routes.',
    architecture: [
      { label: 'Visitor', detail: 'HTTPS' },
      { label: 'Nginx', detail: 'Reverse proxy, Let’s Encrypt cert' },
      { label: 'Express', detail: '127.0.0.1:3000, PM2' },
      { label: 'MongoDB', detail: 'Links and users' },
    ],
    stack: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'Azure', 'Nginx'],
    snippet: {
      file: 'src/app.js',
      href: 'https://github.com/ShervinBabaei2007/Web-adminProject/blob/main/src/app.js',
      language: 'js',
      caption:
        'What happens when a signed-in person pastes a web address. It checks the address is real, makes a short random code, and saves it. If the code is already taken, it tries again.',
      code: `// Create a new short code and store the target URL in MongoDB.
// Only signed-in users may create links.
app.post("/api/links", requireAuth, async (req, res) => {
  const destination = req.body?.url;

  if (typeof destination !== "string") {
    return res.status(400).json({ error: "Enter a valid HTTP or HTTPS URL." });
  }

  let parsedDestination;
  try {
    parsedDestination = new URL(destination);
  } catch {
    return res.status(400).json({ error: "Enter a valid HTTP or HTTPS URL." });
  }

  if (!["http:", "https:"].includes(parsedDestination.protocol)) {
    return res.status(400).json({ error: "Enter a valid HTTP or HTTPS URL." });
  }

  // Retry a few times if a generated short code collides with an existing one.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const code = crypto.randomBytes(6).toString("base64url");

    try {
      await Link.create({ code, url: parsedDestination.toString(), owner: req.user._id });
      return res.status(201).json({ code, path: \`/l/\${code}\` });
    } catch (error) {
      if (error.code !== 11000 || attempt === 2) {
        return res.status(503).json({ error: "Link storage is temporarily unavailable." });
      }
    }
  }
});`,
    },
    github: 'https://github.com/ShervinBabaei2007/Web-adminProject',
    live: 'https://linklocker.northcentralus.cloudapp.azure.com/',
    screenshots: [
      {
        src: '/projects/linklocker-sign-in.webp',
        alt: 'The live LinkLocker page with a Sign in with Google link and the text Sign in to create short links.',
        caption: 'Live sign-in page (link creation is behind login)',
      },
    ],
  },
  {
    slug: 'tic-tac-toe-minimax',
    name: 'Tic-Tac-Toe Minimax AI',
    category: 'Systems',
    flagship: false,
    date: 'June 2026',
    subtitle: 'A terminal game with an AI that picks the best move by searching every outcome.',
    summary:
      'A Python command-line Tic-Tac-Toe with a random player, a human player, and a Minimax player, plus a simulation mode that plays many games to show the Minimax player does not lose.',
    role: 'Solo project',
    team: 'Built on my own.',
    highlight: 'Never lost in 1,200 games against a random player',
    overview: [
      'This is a Tic-Tac-Toe game for the terminal, with a computer player that never loses. It decides each move by trying out every way the rest of the game could go. That method is called Minimax.',
      'To check it works, I made it play against a computer that moves at random. Out of 1,200 games, the perfect player won 988, drew 212, and lost none.',
    ],
    features: [
      {
        title: 'Three kinds of player',
        text: 'A human, a random player, and the perfect one. Any two can play each other.',
      },
      { title: 'Perfect play', text: 'The AI always picks the best move available, so the worst it can do is draw.' },
      { title: 'Faster wins', text: 'Among winning moves, it prefers the one that wins sooner.' },
      { title: 'Watch it play', text: 'A visual mode shows the board move by move, with a short pause between moves.' },
      {
        title: 'Run many games at once',
        text: 'A silent mode plays any number of games and counts the wins, losses, and draws.',
      },
    ],
    howItWorks: [
      'For each empty square, the AI pretends to play there.',
      'It imagines both players playing their best until the game ends.',
      'It scores how that imagined game ends: a win is good, a loss is bad, and a draw is zero.',
      'It undoes the pretend move and remembers the score.',
      'Once it has tried every square, it plays the one with the best score.',
    ],
    why: 'Minimax is easy to describe and easy to get subtly wrong. I wanted to write the recursion myself and check it against a player that moves at random.',
    mine: [
      'Wrote the board, winner detection, and game loop in game.py, and the Random, Human, and Minimax players in player.py.',
      'Implemented the recursive Minimax search: try a move, simulate the rest of the game, undo the move, and keep the best score.',
      'Weighted a win by the number of empty squares left, so the AI prefers winning sooner.',
      'Added a simulation mode that runs any number of games silently and reports win, loss, and tie counts.',
    ],
    outcome:
      'A game you can play in the terminal. Run against a random player for 1,200 games, the Minimax player won 988 and tied 212, with no losses.',
    tradeoff:
      'It searches the full game tree on every move. That is fine for a 3×3 board, but it would not scale to larger boards without something like alpha-beta pruning.',
    learned:
      'Undoing a move correctly, including the winner flag, is as important as the scoring, because the search shares one board.',
    next: 'Add alpha-beta pruning and a board-size option to see where the plain search stops being practical.',
    architecture: [
      { label: 'game.py', detail: 'Board, winner, game loop' },
      { label: 'player.py', detail: 'Random, Human, Minimax' },
      { label: 'Minimax', detail: 'Recursive search, undo each move' },
      { label: 'Simulation', detail: 'Win, loss, tie counts' },
    ],
    stack: ['Python', 'Minimax', 'Recursion'],
    snippet: {
      file: 'player.py',
      href: 'https://github.com/ShervinBabaei2007/tic-tac-toe-minimax-ai/blob/main/player.py',
      language: 'python',
      caption:
        'The AI’s thinking. For every empty square it pretends to play there, imagines the rest of the game, scores how it ends, then undoes the pretend move. It keeps the move with the best score.',
      code: `    def minimax(self, state, player):
        max_player = self.letter  # yourself
        other_player = "O" if player == "X" else "X"  # othe other player

        if state.current_winner == other_player:
            return {
                "position": None,
                "score": 1 * (state.num_empty_squares() + 1)
                if other_player == max_player
                else -1 * (state.num_empty_squares() + 1),
            }

        elif not state.empty_squares():  # no empty squares
            return {"position": None, "score": 0}

        if player == max_player:
            best = {"position": None, "score": -math.inf}  # each score should maximize
        else:
            best = {
                "position": None,
                "score": math.inf,
            }  # each score should be minimize

        for possible_move in state.available_moves():
            # step 1 - make a move and try that spot
            state.make_move(possible_move, player)

            # step 2 - use minimax to simuilate a game after making that move
            sim_score = self.minimax(
                state, other_player
            )  # now, we alternate the players

            # step 3 - undo the move
            state.board[possible_move] = " "
            state.current_winner = None

            sim_score["position"] = possible_move  # otherwise this will get messed up

            # step 4 - update the dictionaries if necessary
            if player == max_player:
                if sim_score["score"] > best["score"]:
                    best = sim_score  # replaces best
            else:  # minimzies the other player
                if sim_score["score"] < best["score"]:
                    best = sim_score  # replaces best

        return best`,
    },
    github: 'https://github.com/ShervinBabaei2007/tic-tac-toe-minimax-ai',
    terminal: {
      title: 'python game.py',
      transcript: `After 1200 iterations, we see 0 X wins, 988 O wins, and 212 ties`,
    },
  },
  {
    slug: 'ollama-rag',
    name: 'Local LLM and RAG Experiments',
    category: 'AI tools',
    flagship: false,
    date: 'June 2026',
    subtitle: 'Two small projects exploring how local models and retrieval work.',
    summary:
      'A grocery-list categorizer that gets structured output from a local model, and a PDF question-answering pipeline built on embeddings and a vector database, all running through Ollama.',
    role: 'Solo project',
    team: 'Built on my own.',
    highlight: 'Local RAG over a PDF with ChromaDB',
    overview: [
      'These are two small experiments with AI models that run on my own computer. The first sorts a messy grocery list into sections. The second answers questions about a PDF.',
      'For the PDF, the AI does not just guess. The program first finds the few parts of the document most related to your question and hands only those to the AI, so the answer comes from the document.',
    ],
    features: [
      {
        title: 'Grocery list sorter',
        text: 'Give it a messy list and it sorts the items into sections such as produce, dairy, and drinks.',
      },
      {
        title: 'Ask questions about a PDF',
        text: 'Ask a question in plain words and get an answer based on the document.',
      },
      {
        title: 'Answers only from the document',
        text: 'The AI is told to use only what it was handed, and to say “I cannot find that information” when the answer is not there.',
      },
      { title: 'Remembers the document', text: 'The prepared document is saved, so it is only processed once.' },
    ],
    howItWorks: [
      'The program reads the PDF.',
      'It cuts the text into overlapping pieces, each about 1,200 characters long.',
      'It turns each piece into a set of numbers that capture its meaning, and stores them in a small local database.',
      'When you ask a question, it finds the 5 pieces whose meaning is closest to your question.',
      'It gives those pieces to the AI with strict instructions to answer only from them.',
    ],
    why: 'I wanted to see how retrieval-augmented generation works under the hood, using models on my own machine instead of a hosted API.',
    mine: [
      'Wrote categorizer.py, which sends a grocery list to a local model and organizes the items into sections.',
      'Wrote pdf-rag.py: load a PDF, split it into chunks, embed them with nomic-embed-text, store them in ChromaDB, retrieve relevant context, and answer with llama3.2.',
    ],
    outcome: 'Two working scripts, one for structured output and one for asking questions about a document.',
    tradeoff:
      'Everything runs locally, so there is no API cost and no data leaves the machine, but answer quality is limited by the size of the model I can run.',
    learned: 'Most of a RAG system’s quality comes from how the document is chunked and retrieved, not from the model.',
    next: 'Add citations that point to the retrieved chunk and a small set of test questions to compare chunk sizes.',
    architecture: [
      { label: 'PDF loader', detail: 'LangChain' },
      { label: 'Chunks + embeddings', detail: 'nomic-embed-text' },
      { label: 'ChromaDB', detail: 'Vector store' },
      { label: 'Ollama', detail: 'llama3.2 answers' },
    ],
    stack: ['Python', 'Ollama', 'LangChain', 'ChromaDB'],
    github: 'https://github.com/ShervinBabaei2007/Ollama',
    snippet: {
      file: 'pdf-rag.py',
      href: 'https://github.com/ShervinBabaei2007/Ollama/blob/main/pdf-rag.py',
      language: 'python',
      caption:
        'The instructions given to the AI. It must answer only from the pieces of the document it was handed, and say so plainly when the answer is not there.',
      code: `def create_chain(retriever, llm):

    prompt = ChatPromptTemplate.from_template(
        """
You are a helpful assistant.

Answer ONLY using the provided context.

If the answer is not in the context, say:
"I cannot find that information in the provided documents."

Context:
{context}

Question:
{question}
"""
    )

    chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    logging.info("Chain created.")
    return chain`,
    },
  },
]

export const flagshipProjects = projects.filter((project) => project.flagship)
export const moreProjects = projects.filter((project) => !project.flagship)

export function findProject(slug: string | undefined): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
