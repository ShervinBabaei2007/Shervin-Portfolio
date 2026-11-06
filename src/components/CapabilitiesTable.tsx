import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { projectsUsing, skillTabs, usageLevel } from '../data/skills'

const variant = { Core: 'default', Used: 'secondary', Exploring: 'outline' } as const

function CapabilitiesTable() {
  const rows = skillTabs.flatMap((tab) => tab.skills)
  return (
    <section className="section-wrap" id="capabilities" aria-labelledby="capabilities-title">
      <div className="section-heading">
        <div><p className="eyebrow"><span className="eyebrow-mark">06</span> AT A GLANCE</p><h2 id="capabilities-title">Technical capabilities<span>.</span></h2></div>
        <p className="section-aside">Usage is counted from the case studies:<br />Core is 3+ projects, Used is 1 to 2.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Technology</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Projects</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ name, category }) => {
            const level = usageLevel(name)
            return (
              <TableRow key={name}>
                <TableCell>{category}</TableCell>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell><Badge variant={variant[level]}>{level}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{projectsUsing(name).map((project) => project.name).join(', ')}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}

export default CapabilitiesTable
