import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'

function ProjectVisual({ project }: { project: Project }) {
  const { visual } = project

  if (project.screenshots?.length) {
    return (
      <div className={`project-screenshot-strip project-screenshot-strip--${visual}`} aria-hidden="true">
        {project.screenshots.slice(0, 3).map((screenshot) => (
          <figure key={screenshot.src}>
            <img src={screenshot.src} alt="" loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
    )
  }

  if (visual === 'rpg') {
    return (
      <div className="terminal-preview" aria-hidden="true">
        <div className="terminal-bar"><span /><span /><span /><b>warriors_path.py</b></div>
        <div className="terminal-body">
          <p className="terminal-muted">WARRIOR&apos;S PATH <span>LV. 03</span></p>
          <p>HP <i className="health-bar"><b /></i> 150 / 200</p>
          <p className="terminal-log">Battle: Hero vs White Tiger</p>
          <p>You deal <strong>14 damage</strong>. Enemy HP: 186</p>
          <p className="terminal-choice"><span>01</span> Fight <span>02</span> Inventory <span>03</span> Save</p>
        </div>
      </div>
    )
  }

  if (visual === 'gitscribe') {
    return (
      <div className="scribe-preview" aria-hidden="true">
        <div className="scribe-top"><span>GITSCRIBE</span><span className="scribe-status"><i /> CONNECTED</span></div>
        <div className="scribe-content">
          <span className="scribe-label">YOUR WORK, EXPLAINED</span>
          <div className="scribe-lines"><i /><i /><i /></div>
          <div className="scribe-output"><small>GENERATED OUTPUT</small><b>Describe the change.<br />Keep the signal.</b><span>Copy suggestion <ArrowUpRight size={13} /></span></div>
        </div>
      </div>
    )
  }

  if (visual === 'discord') {
    return (
      <div className="discord-preview" aria-hidden="true">
        <div className="discord-sidebar"><b>DEV SERVER</b><span># general</span><span className="discord-channel"># ask-ai</span><span># projects</span></div>
        <div className="discord-chat"><div className="discord-chat-head"># ask-ai <small>LOCAL MODEL CONNECTED</small></div><div className="discord-message"><b>shervin</b><span>!ask explain async tasks</span></div><div className="discord-message discord-bot"><b>assistant</b><span>Async tasks let the event loop continue while longer work runs in the background.</span><small>QWEN 3.5 9B · LM STUDIO</small></div></div>
      </div>
    )
  }

  return null
}

export default ProjectVisual
