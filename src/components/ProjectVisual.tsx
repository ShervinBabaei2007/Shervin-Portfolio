import { ArrowUpRight, Brush, Check, Cloud, CloudRain, Redo2, Sprout, Sun, Undo2, X } from 'lucide-react'
import type { Project } from '../data/projects'

const picnicDays = [
  { day: 'Saturday', date: 'Oct 3', weather: <Sun size={14} />, temp: '24°', votes: [['fry', 'no'], ['leela', 'yes'], ['bender', 'no']] },
  { day: 'Sunday', date: 'Oct 4', weather: <Cloud size={14} />, temp: '19°', votes: [['leela', 'no'], ['farnsworth', 'no'], ['fry', 'yes']] },
  { day: 'Monday', date: 'Oct 5', weather: <CloudRain size={14} />, temp: '15°', votes: [['fry', 'no'], ['bender', 'yes'], ['farnsworth', 'yes']] },
  { day: 'Tuesday', date: 'Oct 6', weather: <Sun size={14} />, temp: '22°', votes: [['fry', 'yes'], ['leela', 'no'], ['bender', 'yes']] },
]

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

    if (visual === 'tracker') {
    return (
      <div className="terminal-preview" aria-hidden="true">
        <div className="terminal-bar"><span /><span /><span /><b>main.py</b></div>
        <div className="terminal-body">
          <p className="terminal-muted">JOB TRACKER <span>5 APPLICATIONS</span></p>
          <p className="tracker-row"><b>Acme Co.</b><em>Software Intern</em><i className="tracker-status tracker-status--interview">Interview</i></p>
          <p className="tracker-row"><b>Northwind</b><em>Junior Dev</em><i className="tracker-status">Applied</i></p>
          <p className="tracker-row"><b>Globex</b><em>Co-op Dev</em><i className="tracker-status tracker-status--offer">Offer</i></p>
          <p className="terminal-choice"><span>01</span> Add <span>02</span> View <span>03</span> Update <span>04</span> Filter</p>
        </div>
      </div>
    )
  }

    if (visual === 'moodboard') {
    return (
      <div className="mood-preview" aria-hidden="true">
        <div className="mood-toolbar">
          <b>Mood Jorts</b>
          <span className="mood-tools">
            <i><Undo2 size={9} /></i>
            <i><Redo2 size={9} /></i>
            <i>Help</i>
            <i><Brush size={9} /></i>
            <i><Sprout size={9} /></i>
            <i>Add Image</i>
          </span>
        </div>
        <div className="mood-board">
          <div className="mood-img mood-img--cafe" />
          <div className="mood-img mood-img--clouds" />
          <div className="mood-img mood-img--forest" />
          <div className="mood-img mood-img--ocean" />
          <div className="mood-img mood-img--rail" />
        </div>
        <div className="mood-popup">
          <span className="mood-input" />
          <span className="mood-popup-btns"><i>Add More</i><i className="mood-popup-add">Add</i><i>Cancel</i></span>
        </div>
      </div>
    )
  }

    if (visual === 'calendar') {
    return (
      <div className="picnic-preview" aria-hidden="true">
        <div className="picnic-bar"><b>Jicnic</b><span className="picnic-refresh">Refresh</span></div>
        <div className="picnic-board">
          {picnicDays.map((d) => (
            <div className="picnic-day" key={d.day}>
              <div className="picnic-day-head">
                <span>{d.day}<br />{d.date}</span>
                <span className="picnic-weather">{d.weather}<small>{d.temp}</small></span>
              </div>
              <p className="picnic-attend">Can you attend?</p>
              <div className="picnic-btns">
                <span className="picnic-btn-yes">Yes <Check size={9} /></span>
                <span>??</span>
                <span className="picnic-btn-no">No <X size={9} /></span>
              </div>
              <div className="picnic-voters">
                {d.votes.map(([name, vote]) => (
                  <span key={name} className={`picnic-voter picnic-voter--${vote}`}>{name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default ProjectVisual
