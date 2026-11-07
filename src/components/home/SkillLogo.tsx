import { skillIcons } from '@/data/skillIcons'
import { cn } from '@/lib/utils'

/** The logo for a skill, in the current text colour. Decorative: the skill name is always next to it. */
function SkillLogo({ name, className }: { name: string; className?: string }) {
  const icon = skillIcons[name]
  if (!icon) return null
  if (icon.kind === 'lucide') return <icon.Icon className={cn('size-5 shrink-0', className)} aria-hidden="true" />
  return (
    <svg className={cn('size-5 shrink-0', className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}

export default SkillLogo
