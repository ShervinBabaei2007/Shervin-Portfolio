/*
 * Engineering notes: short write-ups that go one level deeper than a case study.
 * Text wrapped in `backticks` renders as inline code.
 * Add new writeups at the bottom of the list. The site orders them on its own: newest month first, best `rank` first.
 *
 * These were drafted from the code in each repository. Read every note before
 * publishing and rewrite anything that does not sound like you: an interviewer
 * may ask you to explain any sentence here.
 */

export type NoteBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; language: 'js' | 'ts' | 'python'; file: string; code: string; caption?: string }

export type Note = {
  slug: string
  title: string
  summary: string
  /** ISO date, used for <time> and sorting. */
  date: string
  minutes: number
  /** Slug of the related case study. */
  project: string
  /**
   * How impressive this writeup is, 1 being the best. Within a month the best-ranked comes first. Leave it out
   * and the writeup goes after the ranked ones, newest first.
   */
  rank?: number
  /** Shows a "Featured" badge. Use it for the writeups you most want a visitor to open. */
  featured?: boolean
  body: NoteBlock[]
}

const entries: Note[] = [
  {
    slug: 'skillmatch-attend-race-condition',
    title: 'The race condition in SkillMatch’s attend route',
    summary:
      'Disabling the Attend button stops one person from overbooking a workshop. It does nothing about two people. Here is why, and the one-query fix.',
    date: '2026-10-03',
    minutes: 5,
    project: 'skillmatch',
    rank: 1,
    featured: true,
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
    rank: 2,
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
    rank: 3,
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
  {
    slug: 'fetching-links-you-dont-trust',
    title: 'How my app fetches links it doesn’t trust',
    summary:
      'Network Growth Assistant checks job links that strangers can influence. Here is how a link can trick a server into visiting its own network, and the four checks that stop it.',
    date: '2026-11-07',
    minutes: 6,
    project: 'network-growth-assistant',
    rank: 1,
    featured: true,
    body: [
      {
        type: 'p',
        text: 'Network Growth Assistant shows job postings and checks that each Apply link still works. Those links come from other websites, so a stranger decides where they point. That is harmless when a person clicks a link in a browser. It is risky when my server follows the link, because my server can reach places a stranger cannot.',
      },
      { type: 'h2', text: 'The trick this protects against' },
      {
        type: 'p',
        text: 'Every cloud server has a private side: other machines on the same internal network, and a special address, `169.254.169.254`, where many cloud providers hand out information about the server itself. Someone on the internet cannot reach any of that. My server can. So if a “job link” points at an internal address and my server fetches it, the stranger has borrowed my server’s access. This kind of attack is usually called server-side request forgery.',
      },
      { type: 'h2', text: 'Why checking the link’s text is not enough' },
      {
        type: 'list',
        items: [
          'A name can hide an address. `jobs.example.com` looks public, but its DNS record can point at a private address such as `10.0.0.5`.',
          'A link can bounce. A harmless-looking page can answer with a redirect to an internal address, and a plain fetch follows it without asking.',
          'The answer can change. A site can give one answer when I look the name up and a different one a moment later when I connect. This is called DNS rebinding.',
        ],
      },
      {
        type: 'p',
        text: 'So the check has to happen at the moment of connecting, on the real address, at every step of the journey. `safe-fetch.ts` does that in four steps.',
      },
      { type: 'h2', text: 'Check 1: is the link the right shape?' },
      {
        type: 'code',
        language: 'ts',
        file: 'src/lib/net/safe-fetch.ts',
        code: `export function assertFetchableUrl(raw: string | URL): URL {
  let url: URL;
  try {
    url = new URL(raw.toString());
  } catch {
    throw new UnsafeUrlError("not a valid URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new UnsafeUrlError("only http and https are allowed");
  if (url.username || url.password) throw new UnsafeUrlError("credentials in the URL");
  if (url.port && url.port !== (url.protocol === "https:" ? "443" : "80")) throw new UnsafeUrlError("non-standard port");
  const host = url.hostname.replace(/^\\[|\\]$/g, "").toLowerCase();
  if (isIP(host)) throw new UnsafeUrlError("IP address hosts aren't allowed");
  if (!host.includes(".") || METADATA_HOSTS.has(host) || /\\.(local|localhost|internal|lan|home|corp)$/.test(host) || host === "localhost") throw new UnsafeUrlError("not a public hostname");
  return url;
}`,
      },
      {
        type: 'p',
        text: 'This catches the obvious things before any network is touched: only `http` and `https`, no username and password hidden in the link, no unusual ports, no raw IP addresses, no internal-sounding names such as `.local` or `.internal`, and no known cloud metadata hostnames.',
      },
      { type: 'h2', text: 'Check 2: where does the name really point?' },
      {
        type: 'p',
        text: 'Next the app looks the name up itself and requires every address that comes back to be public. One private address in the list is enough to refuse. The blocked ranges cover private networks, the machine talking to itself (loopback), link-local addresses like `169.254.169.254`, and the IPv6 versions of all of these, including IPv4 addresses wrapped inside IPv6 ones.',
      },
      { type: 'h2', text: 'Check 3: connect to exactly the address I checked' },
      {
        type: 'p',
        text: 'If the app looked up the name and then connected by name, the second lookup could give a different answer. So the connection is forced to use only the address that was just checked.',
      },
      {
        type: 'code',
        language: 'ts',
        file: 'src/lib/net/safe-fetch.ts (inside the connection setup)',
        code: `// Every lookup for this request returns only the address we checked.
        lookup: ((_host: string, options: { all?: boolean }, cb: (...args: unknown[]) => void) =>
          options?.all ? cb(null, [{ address: address.address, family: address.family }]) : cb(null, address.address, address.family)) as unknown as LookupFunction,
        servername: url.hostname,`,
      },
      {
        type: 'p',
        text: 'The `servername` line keeps the website’s certificate checked against its real name, so HTTPS still works normally.',
      },
      { type: 'h2', text: 'Check 4: every redirect starts again from Check 1' },
      {
        type: 'code',
        language: 'ts',
        file: 'src/lib/net/safe-fetch.ts',
        code: `  for (let hop = 0; hop <= maxRedirects; hop++) {
    const host = url.hostname.replace(/^\\[|\\]$/g, "");
    const addresses = await resolvePublic(host, resolve);
    const left = deadline - Date.now();
    if (left <= 0) throw new Error("timed out");
    const res = await transport(url, addresses[0], { timeoutMs, deadlineMs: left, maxBytes: opts.maxBytes ?? 64 * 1024, headers });
    const location = res.headers.location;
    if (res.status >= 300 && res.status < 400 && location && opts.followRedirects !== false) {
      // Every hop is checked again before it's followed.
      url = assertFetchableUrl(new URL(location, url));
      redirects.push(url.toString());
      continue;
    }
    return { ...res, url: url.toString(), redirects };
  }
  throw new UnsafeUrlError("too many redirects");`,
      },
      {
        type: 'p',
        text: 'Redirects are followed by hand, at most five. Each new address goes through the same checks before the app follows it, so a safe page cannot pass me along to an unsafe one.',
      },
      { type: 'h2', text: 'Limits, so a bad link cannot waste my server either' },
      {
        type: 'list',
        items: [
          'Only the first 64 KB of a page is read by default.',
          'A connection that goes quiet is dropped after 8 seconds, and the whole fetch, redirects included, has a deadline of three times that.',
          'No cookies are sent, so nothing about a signed-in user can reach the other website.',
        ],
      },
      { type: 'h2', text: 'How I tested it' },
      {
        type: 'p',
        text: 'The name lookup and the connection can be swapped out in tests, so the checks run without touching the real internet. The test file covers a public-looking name that resolves to a private address, a list where only one address is private, IPv6 loopback, a redirect to a private address, and a check that the connection really goes only to the address that was checked.',
      },
      { type: 'h2', text: 'What I would still be careful about' },
      {
        type: 'p',
        text: 'The point of this file is that it is the one gate for outside links. One gate is much easier to trust than checks scattered around the app. The risk is someone, including me later, adding a plain `fetch` somewhere else. The rule has to stay that every outside link goes through `safeFetch`.',
      },
    ],
  },
  {
    slug: 'stopping-an-ai-from-inventing-facts',
    title: 'Stopping an AI from inventing facts about a person',
    summary:
      'The app drafts messages to real people, and one wrong claim like “we met last year” would be embarrassing. Here is the check every message must pass, and why most messages never come from an AI at all.',
    date: '2026-11-07',
    minutes: 6,
    project: 'network-growth-assistant',
    rank: 2,
    body: [
      {
        type: 'p',
        text: 'Network Growth Assistant helps write short messages to real people: a first note, a thank-you, a check-in. A message that says “great talking to you last week” to someone I have never spoken to is worse than no message. So the app has one rule: a message may only say things the app can back up.',
      },
      { type: 'h2', text: 'Most messages never come from an AI at all' },
      {
        type: 'p',
        text: 'The follow-up messages after someone accepts an invitation come from fixed templates, filled in with what the record holds: the person’s name and, if known, their school and field. Nothing in that step calls an AI service, so a draft cannot contain an invented fact. Where an AI does write text, its output goes through the same check before it is used.',
      },
      { type: 'h2', text: 'What counts as a lie?' },
      {
        type: 'p',
        text: 'I wrote down the kinds of statements the app must never make, and turned each into a rule with a reason:',
      },
      {
        type: 'list',
        items: [
          'Pretending we have met: “we spoke”, “as we discussed”, “remember me”.',
          'Claiming a mutual connection or a “2nd-degree” link.',
          'Asking for a referral or a job in a message.',
          'Including a link or a handle.',
          'Sounding promotional, such as “amazing” or a string of exclamation marks.',
        ],
      },
      {
        type: 'code',
        language: 'ts',
        file: 'src/lib/discovery/grounding.ts (three of the rules)',
        code: `  { pattern: /\\bmutual (connection|friend|contact)s?\\b|\\b(2nd|3rd|second|third)[- ]degree\\b|\\bwe have .* in common\\b/i, reason: "claims a mutual connection or degree" },
  { pattern: /\\b(refer(ral)?|refer me|hire me|send (me )?a job)\\b/i, reason: "asks for a referral or job" },
  { pattern: /https?:\\/\\/|www\\.|@\\w/i, reason: "contains a link or handle" },`,
      },
      {
        type: 'p',
        text: 'Each rule carries a reason, so a refused message comes back with the reason it was refused, such as “claims a mutual connection or degree”, not just “invalid”.',
      },
      { type: 'h2', text: 'The harder rule: only names I was told' },
      {
        type: 'p',
        text: 'Banned phrases catch what I thought of. The second rule catches what I did not. Any capitalised word in the message that is not at the start of a sentence, and is not an everyday word, has to appear in the facts the app was given about that person. If a message mentions “Amazon” and Amazon is not in the record, it is refused.',
      },
      {
        type: 'code',
        language: 'ts',
        file: 'src/lib/discovery/grounding.ts (the second half of checkGrounded)',
        code: `  const knownText = \` \${known.filter(Boolean).join(" ").toLowerCase()} \`;
  const words = t.split(/\\s+/);
  for (let i = 0; i < words.length; i++) {
    const w = words[i].replace(/^[^\\p{L}\\d]+|[^\\p{L}\\d'’]+$/gu, "");
    if (!w || !/^\\p{Lu}/u.test(w)) continue;
    const sentenceStart = i === 0 || /[.!?:—–-]$/.test(words[i - 1]) || /^["“(]/.test(words[i]);
    const lower = w.toLowerCase().replace(/[’']s$/, "");
    if (sentenceStart || COMMON.has(lower)) continue;
    if (!knownText.includes(lower)) return { ok: false, reason: \`mentions “\${w}”, which isn't in the evidence\` };
  }
  return { ok: true };`,
      },
      { type: 'p', text: 'Reading it in plain words:' },
      {
        type: 'list',
        items: [
          'The facts are joined into one lowercase string to search in.',
          'Each word that starts with a capital letter is a candidate name. Words at the start of a sentence are skipped, because every sentence starts with a capital.',
          'A short list of everyday words, such as “hello”, “thanks” and “university”, is also skipped.',
          'Any other capitalised word must appear in the facts, otherwise the message is refused and says which word was the problem.',
        ],
      },
      { type: 'h2', text: 'It also checks length, numbers, and your edits' },
      {
        type: 'p',
        text: 'The same function refuses a message that is empty or longer than its limit. Follow-up drafts get an extra rule against implying an earlier conversation, and a check on numbers. And because you can edit a draft before copying it, the check runs again on your edited version, so an edit cannot sneak in a claim the record does not support.',
      },
      { type: 'h2', text: 'What this does not do' },
      {
        type: 'p',
        text: 'It is a filter, not a fact-checker. It cannot tell whether a true-sounding sentence is true, and the name check only looks at capitalised words, so a wrong claim written in lowercase would get past it. What keeps the risk small is the design around it: use a template wherever a template is enough, and refuse anything that cannot be traced back to the record.',
      },
    ],
  },
  {
    slug: 'sign-in-behind-a-proxy',
    title: 'Three settings that make sign-in work behind a proxy',
    summary:
      'LinkLocker runs behind Nginx. That one fact touches the rate limiter, the secure cookie, and the Google callback address. Here is why each setting exists.',
    date: '2026-11-07',
    minutes: 5,
    project: 'linklocker',
    rank: 3,
    body: [
      {
        type: 'p',
        text: 'LinkLocker runs on an Azure server with Nginx in front of it. Nginx handles the secure (HTTPS) connection and passes each request on to my Express app, which listens on port 3000 and is not open to the internet. My teammate set up Nginx, and I wrote the Google sign-in. Putting the two together showed me that this one arrangement quietly touches three things in my code.',
      },
      { type: 'h2', text: 'The problem: the app only sees Nginx' },
      {
        type: 'p',
        text: 'From Express’s point of view, every request comes from the same visitor: Nginx, at `127.0.0.1`. Nginx knows the truth, so on the way through it writes it into headers: `X-Real-IP` and `X-Forwarded-For` carry the visitor’s address, and `X-Forwarded-Proto` says whether the visitor used HTTPS. Express ignores those headers unless it is told to trust them. One line does that:',
      },
      {
        type: 'code',
        language: 'js',
        file: 'src/app.js',
        code: `// Trust loopback traffic so the rate limiter can correctly read the client IP
// when the app is behind local proxying.
app.set("trust proxy", "loopback");`,
      },
      {
        type: 'p',
        text: '`"loopback"` means it only trusts a proxy running on the same machine, not anything that merely claims to be one.',
      },
      { type: 'h2', text: 'Place 1: the rate limiter' },
      { type: 'p', text: 'Creating links is limited to 20 per 15 minutes per visitor, to stop spam.' },
      {
        type: 'code',
        language: 'js',
        file: 'src/app.js',
        code: `// Limit how often a client can create short links to reduce spam and abuse.
const linkCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many links created. Please try again later." },
});`,
      },
      {
        type: 'p',
        text: 'A limit per visitor only works if the app can tell visitors apart. Without the proxy setting, everyone would look like `127.0.0.1`, so all visitors would share one budget of 20. It is the same kind of mistake as the shared key in my ThinkBoard limiter, with a different cause.',
      },
      { type: 'h2', text: 'Place 2: the sign-in cookie' },
      {
        type: 'p',
        text: 'After Google confirms who you are, the app gives your browser a cookie that says “this person is signed in”. In production that cookie is marked `secure`, which means the browser only sends it over HTTPS. But Express is talking plain HTTP to Nginx, so it has to learn that the visitor’s original connection was HTTPS. That is what `X-Forwarded-Proto` is for, and why `trust proxy` matters here too.',
      },
      {
        type: 'code',
        language: 'js',
        file: 'src/auth.js',
        code: `cookie: {
  httpOnly: true,
  sameSite: "lax",
  // Secure cookies require HTTPS (nginx terminates TLS and "trust proxy" is set).
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
},`,
      },
      {
        type: 'p',
        text: 'The other settings are protections. `httpOnly` keeps scripts on the page from reading the cookie, `sameSite: "lax"` limits when other websites can make a browser send it, and `maxAge` keeps you signed in for seven days. The session itself is stored in MongoDB and the cookie only refers to it by the user’s id, so logins survive a restart of the server.',
      },
      { type: 'h2', text: 'Place 3: the address Google sends you back to' },
      {
        type: 'p',
        text: 'When you click Sign in with Google, you go to Google and then back to a callback address on my site. Google only sends people to addresses that were registered ahead of time, and the address has to match exactly, including `https` and the path. There are two: `http://localhost:3000/auth/google/callback` for development and the Azure address for production. The app reads which one to use from an environment setting. If they do not match, Google refuses with an error called `redirect_uri_mismatch`.',
      },
      { type: 'h2', text: 'Keeping the secrets out of the code' },
      {
        type: 'list',
        items: [
          'The Google client ID and secret, the callback address, and the session secret are read from environment settings, never written in the code.',
          'The `.env` file is not committed. The repository only has `.env.example` with placeholder values.',
          'The server refuses to start if any of them is missing, so a mistake shows up immediately instead of as a strange login failure later.',
        ],
      },
      { type: 'h2', text: 'What I would change' },
      {
        type: 'p',
        text: 'The Google consent screen is still in testing mode, which means only accounts I list as test users can sign in. That is fine for a course project, but it would have to be published before real visitors could use it.',
      },
      { type: 'h2', text: 'What I took from it' },
      {
        type: 'p',
        text: 'When an app sits behind another program, a few settings have to agree: what the proxy forwards, what the app trusts, and what Google was told. None of them is hard, but each can fail quietly. Writing them down in one place, the Milestone B write-up in the repository, is what made them easy to find again.',
      },
    ],
  },
]

/**
 * The order everywhere the site lists writeups: the newest month first, and inside a month the best-ranked
 * writeup first (see `rank`). Writeups without a rank follow, newest first. Add a new writeup at the bottom of
 * `entries` with today's date and, if it is one of your best, a low `rank`.
 */
export const notes: Note[] = entries
  .map((note, index) => ({ note, index }))
  .sort(
    (a, b) =>
      b.note.date.slice(0, 7).localeCompare(a.note.date.slice(0, 7)) ||
      (a.note.rank ?? 99) - (b.note.rank ?? 99) ||
      b.note.date.localeCompare(a.note.date) ||
      b.index - a.index,
  )
  .map(({ note }) => note)

export const findNote = (slug: string | undefined) => notes.find((note) => note.slug === slug)
export const notesForProject = (slug: string) => notes.filter((note) => note.project === slug)

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

/** "Nov 7": the day, for a row that already sits under its month heading. */
export const formatDay = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' })

/** "November 2026": the heading that groups writeups by month. */
export const formatMonth = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' })
