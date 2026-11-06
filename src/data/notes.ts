/*
 * Engineering notes: short write-ups that go one level deeper than a case study.
 * Text wrapped in `backticks` renders as inline code.
 *
 * These were drafted from the code in each repository. Read every note before
 * publishing and rewrite anything that does not sound like you: an interviewer
 * may ask you to explain any sentence here.
 */

export type NoteBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; language: 'js' | 'python'; file: string; code: string; caption?: string }

export type Note = {
  slug: string
  title: string
  summary: string
  /** ISO date, used for <time> and sorting. */
  date: string
  minutes: number
  /** Slug of the related case study. */
  project: string
  body: NoteBlock[]
}

export const notes: Note[] = [
  {
    slug: 'skillmatch-attend-race-condition',
    title: 'The race condition in SkillMatch’s attend route',
    summary:
      'Disabling the Attend button stops one person from overbooking a workshop. It does nothing about two people. Here is why, and the one-query fix.',
    date: '2026-10-03',
    minutes: 5,
    project: 'skillmatch',
    body: [
      {
        type: 'p',
        text: 'SkillMatch shows how full a workshop is and disables the Attend button once every seat is taken. It looks correct when you click through it alone. The problem only appears when two people act at nearly the same moment.',
      },
      { type: 'h2', text: 'What the route does today' },
      {
        type: 'code',
        language: 'js',
        file: 'backend/routes/workshopRoutes.js',
        code: `const workshop = await Workshop.findById(req.params.id);   // 1. read
if (workshop.attendees.includes(req.user._id))
  return res.status(400).json({ error: 'Already attending' });

workshop.attendees.push(req.user._id);                        // 2. change in memory
await workshop.save();                                        // 3. write`,
      },
      {
        type: 'p',
        text: 'The route reads the workshop, decides in JavaScript, then writes. Between step 1 and step 3, another request can run the same three steps. The server never checks the seat count at all; the only capacity check lives in the React component that disables the button.',
      },
      { type: 'h2', text: 'How two people both get the last seat' },
      {
        type: 'list',
        items: [
          'The workshop has 20 seats and 19 attendees. Alice and Bob both see an enabled Attend button.',
          'Both requests run `findById` and load a document with 19 attendees.',
          'Neither request finds its user in the list, so both push and save.',
          'The workshop now has 21 attendees for 20 seats.',
        ],
      },
      {
        type: 'p',
        text: 'Anyone can also skip the button entirely and call `POST /:id/attend` with a valid token, so the UI check was never a guarantee. The rule has to live where the data is.',
      },
      { type: 'h2', text: 'The fix: let MongoDB decide in one step' },
      {
        type: 'p',
        text: 'MongoDB applies a single-document update atomically. If the conditions and the change are in one `findOneAndUpdate`, there is no gap for another request to slip into: the update only happens if the document still matches at the moment it is written.',
      },
      {
        type: 'code',
        language: 'js',
        file: 'backend/routes/workshopRoutes.js (proposed)',
        code: `const workshop = await Workshop.findOneAndUpdate(
  {
    _id: req.params.id,
    hostedBy: { $ne: req.user._id },      // can't attend your own workshop
    attendees: { $ne: req.user._id },     // not already attending
    // seats is stored as a String, so convert it before comparing
    $expr: { $lt: [{ $size: '$attendees' }, { $toInt: '$seats' }] },
  },
  { $push: { attendees: req.user._id } },
  { new: true },
);

if (!workshop) {
  return res.status(409).json({ error: 'Workshop is full or you are already attending' });
}
res.json(workshop);`,
        caption: 'If any condition fails, nothing is written and the route returns 409 Conflict.',
      },
      {
        type: 'p',
        text: 'The `$toInt` matters. `seats` is declared as `String` in the Mongoose schema, and MongoDB compares a number to a string by type order, not value: every number sorts before every string. Without the conversion, `$lt` would always be true and the check would silently pass.',
      },
      { type: 'h2', text: 'A second bug the rewrite fixes' },
      {
        type: 'p',
        text: 'The current owner check is `workshop.hostedBy.toString() === req.user._id`. The left side is a string and the right side is an ObjectId, so strict equality is always false and hosts can attend their own workshops. Moving the check into the query as `hostedBy: { $ne: req.user._id }` lets MongoDB compare ObjectIds properly.',
      },
      { type: 'h2', text: 'How I would test it' },
      {
        type: 'p',
        text: 'Create a workshop with one seat, then fire two attend requests with `Promise.all` from two different users. Exactly one should get 200 and the other 409. Before the fix, both get 200. A test like that is worth more than any amount of reasoning about timing, because it fails loudly when someone later “simplifies” the query back into read-then-write.',
      },
    ],
  },
  {
    slug: 'sliding-window-rate-limiting',
    title: 'What a sliding-window rate limiter actually counts',
    summary:
      'I used Upstash’s slidingWindow in ThinkBoard without knowing how it worked. Reading its Lua script showed it is an estimate, and why that is a good trade.',
    date: '2026-10-03',
    minutes: 4,
    project: 'thinkboard',
    body: [
      {
        type: 'p',
        text: 'ThinkBoard limits its API to 50 requests per 60 seconds with one line: `Ratelimit.slidingWindow(50, "60 s")`. When I wrote it, “sliding window” just sounded better than “fixed window”. This note is what I found when I read the script that `@upstash/ratelimit` runs inside Redis.',
      },
      { type: 'h2', text: 'The problem with a fixed window' },
      {
        type: 'p',
        text: 'A fixed window counts requests per clock minute and resets at :00. A client can send 50 requests at 0:59 and 50 more at 1:00. Both minutes look fine, but the server took 100 requests in about two seconds.',
      },
      { type: 'h2', text: 'What Upstash does instead' },
      {
        type: 'p',
        text: 'A true sliding window would store a timestamp for every request and count those in the last 60 seconds. Upstash avoids that. It keeps just two counters, one for the current clock window and one for the previous one, and estimates the sliding count by assuming the previous window’s requests were spread evenly.',
      },
      {
        type: 'code',
        language: 'js',
        file: '@upstash/ratelimit: slidingWindow (Lua, simplified)',
        code: `local percentageInCurrent = ( now % window ) / window
requestsInPreviousWindow =
  math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)

if requestsInPreviousWindow + requestsInCurrentWindow >= limit then
  return -1                                   -- rejected, nothing is counted
end

redis.call("INCRBY", currentKey, 1)           -- allowed, count it`,
      },
      {
        type: 'p',
        text: 'Fifteen seconds into a window, a quarter of the current window has passed, so three quarters of the previous window still counts. With 40 requests last window and 10 so far this window, the estimate is `floor(0.75 × 40) + 10 = 40`, so ten more are allowed.',
      },
      { type: 'h2', text: 'Why the estimate is a good trade' },
      {
        type: 'list',
        items: [
          'Memory is two integers per key, no matter how many requests arrive.',
          'The whole check runs as one Lua script, so Redis executes it atomically. There is no read-then-write gap like the one in SkillMatch’s attend route.',
          'Rejected requests are not counted, so a client that keeps retrying is not punished forever.',
          'The cost is precision: if traffic in the previous window was bunched up rather than even, the estimate is off. For protecting a free-tier API that is fine.',
        ],
      },
      { type: 'h2', text: 'What it taught me about my own code' },
      {
        type: 'p',
        text: 'The algorithm was never ThinkBoard’s weak point. The key was. I pass the fixed string `"my-rate-limit"`, so every visitor shares one budget of 50. The case study page has a simulation of this exact script where you can watch one visitor’s burst lock out another, then switch to one key per visitor and see the fix.',
      },
    ],
  },
  {
    slug: 'one-blocking-call-froze-my-bot',
    title: 'How one blocking call froze my Discord bot',
    summary:
      'While the local model was thinking, my bot could not answer anyone else. The cause was one ordinary HTTP request inside an async function.',
    date: '2026-10-03',
    minutes: 4,
    project: 'discord-ai-bridge',
    body: [
      {
        type: 'p',
        text: 'The first version of my Discord bot worked, as long as only one person used it. While the local Qwen model was generating a reply, which can take many seconds on my machine, the bot could not respond to anything else.',
      },
      { type: 'h2', text: 'Why async code can still block' },
      {
        type: 'p',
        text: '`discord.py` runs on `asyncio`: one thread and one event loop that switches between tasks whenever a task hits an `await`. That only works if every slow operation actually awaits. `requests.post` does not. It is a normal blocking call, so while it waited for the model, the event loop could not run anything else, including the heartbeat that keeps the bot connected to Discord (discord.py logs a “heartbeat blocked” warning when this happens).',
      },
      { type: 'h2', text: 'The fix' },
      {
        type: 'code',
        language: 'python',
        file: 'discord_ai_bridge/main.py',
        code: `# Before: blocks the event loop until the model answers
response = requests.post(API_URL, json=payload)

# After: runs in a worker thread; the event loop keeps serving others
response = await asyncio.to_thread(requests.post, API_URL, json=payload)`,
      },
      {
        type: 'p',
        text: '`asyncio.to_thread` hands the call to a thread pool and gives the event loop an awaitable. The bot keeps reading messages and sending heartbeats while the model works.',
      },
      { type: 'h2', text: 'Why I did not switch to aiohttp' },
      {
        type: 'p',
        text: 'An async HTTP client would avoid threads entirely, and it is the cleaner design for a bot under real load. I chose `to_thread` because it fixed the bug with one line in code I already understood, and the bot serves one small server. The trade-off is a thread per in-flight request and no way to cancel one once it starts.',
      },
      { type: 'h2', text: 'What is still wrong' },
      {
        type: 'list',
        items: [
          'There is no `timeout=` on the request. If LM Studio hangs, that worker thread waits forever. Adding `timeout=120` and catching `requests.exceptions.Timeout` is the next change.',
          'Discord rejects messages over 2,000 characters, and long model answers will fail to send. Replies need to be split into chunks.',
        ],
      },
      {
        type: 'p',
        text: 'The lesson I took from it: in async code, “it works” is not enough. The question is whether it still works while something slow is happening.',
      },
    ],
  },
]

export const findNote = (slug: string | undefined) => notes.find((note) => note.slug === slug)
export const notesForProject = (slug: string) => notes.filter((note) => note.project === slug)

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
