import {
  siClaudecode,
  siCss,
  siDocker,
  siExpress,
  siFastapi,
  siFigma,
  siGithub,
  siGithubactions,
  siHtml5,
  siJavascript,
  siLangchain,
  siMongodb,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siOllama,
  siPostgresql,
  siPython,
  siPytest,
  siReact,
  siRedis,
  siShadcnui,
  siSqlite,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVitest,
} from 'simple-icons'
import { Cable, Cloud, Database, Drama, Globe, KeyRound, ShieldCheck, Workflow, type LucideIcon } from 'lucide-react'

/**
 * A logo for each skill in skills.ts. Brand marks come from Simple Icons (one 24x24 path each, drawn in the
 * text colour so they stay cohesive in both themes); skills with no brand mark use a lucide icon instead.
 * Import only the icons listed here so the bundle does not carry the whole library.
 */
export type SkillIcon = { kind: 'brand'; path: string } | { kind: 'lucide'; Icon: LucideIcon }

/** Wraps a Simple Icons logo. */
const brand = (icon: { path: string }): SkillIcon => ({ kind: 'brand', path: icon.path })
/** Wraps a lucide icon. */
const lucide = (Icon: LucideIcon): SkillIcon => ({ kind: 'lucide', Icon })

/** Skill name (exactly as written in skills.ts) to its icon. */
export const skillIcons: Record<string, SkillIcon> = {
  React: brand(siReact),
  TypeScript: brand(siTypescript),
  JavaScript: brand(siJavascript),
  'Node.js': brand(siNodedotjs),
  Express: brand(siExpress),
  HTML5: brand(siHtml5),
  CSS3: brand(siCss),
  'Tailwind CSS': brand(siTailwindcss),
  'shadcn/ui': brand(siShadcnui),
  FastAPI: brand(siFastapi),
  Docker: brand(siDocker),
  'REST API': lucide(Globe),
  'JWT & OAuth': lucide(KeyRound),
  SQL: lucide(Database),
  'Git & GitHub': brand(siGithub),
  Playwright: lucide(Drama),
  'axe-core': lucide(ShieldCheck),
  MongoDB: brand(siMongodb),
  Python: brand(siPython),
  asyncio: lucide(Workflow),
  WebSockets: lucide(Cable),
  Redis: brand(siRedis),
  SQLite: brand(siSqlite),
  Vercel: brand(siVercel),
  Figma: brand(siFigma),
  'Next.js': brand(siNextdotjs),
  PostgreSQL: brand(siPostgresql),
  Supabase: brand(siSupabase),
  Ollama: brand(siOllama),
  LangChain: brand(siLangchain),
  Azure: lucide(Cloud),
  Nginx: brand(siNginx),
  'GitHub Actions': brand(siGithubactions),
  Vitest: brand(siVitest),
  'Claude Code': brand(siClaudecode),
  pytest: brand(siPytest),
}
