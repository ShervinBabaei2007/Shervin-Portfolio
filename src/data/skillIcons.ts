import {
  siAuth0,
  siExpress,
  siFigma,
  siJavascript,
  siJsonwebtokens,
  siMongodb,
  siNodedotjs,
  siPython,
  siPytest,
  siReact,
  siRedis,
  siSqlite,
  siTypescript,
  siVercel,
} from 'simple-icons'
import { Cable, Globe, Workflow, type LucideIcon } from 'lucide-react'

/**
 * A logo for each skill in skills.ts. Brand marks come from Simple Icons (one 24x24 path each, drawn in the
 * text colour so they stay cohesive in both themes); skills with no brand mark use a lucide icon instead.
 * Import only the icons listed here so the bundle does not carry the whole library.
 */
export type SkillIcon = { kind: 'brand'; path: string } | { kind: 'lucide'; Icon: LucideIcon }

const brand = (icon: { path: string }): SkillIcon => ({ kind: 'brand', path: icon.path })
const lucide = (Icon: LucideIcon): SkillIcon => ({ kind: 'lucide', Icon })

export const skillIcons: Record<string, SkillIcon> = {
  React: brand(siReact),
  TypeScript: brand(siTypescript),
  JavaScript: brand(siJavascript),
  'Node.js': brand(siNodedotjs),
  Express: brand(siExpress),
  'REST API': lucide(Globe),
  JWT: brand(siJsonwebtokens),
  MongoDB: brand(siMongodb),
  Python: brand(siPython),
  asyncio: lucide(Workflow),
  WebSockets: lucide(Cable),
  Redis: brand(siRedis),
  SQLite: brand(siSqlite),
  Vercel: brand(siVercel),
  Auth0: brand(siAuth0),
  Figma: brand(siFigma),
  pytest: brand(siPytest),
}
