import { Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'

type SiteHeaderProps = {
  darkMode: boolean
  onToggleTheme: () => void
}

function SiteHeader({ darkMode, onToggleTheme }: SiteHeaderProps) {
  const { from } = site.availability
  const label = darkMode ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Shervin Babaei, home"><span>SB</span><i>.</i></Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/#work">Work</Link>
        <Link to="/#about">About</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/resume">Resume</Link>
        <Link to="/#contact">Contact</Link>
      </nav>
      <div className="header-actions">
        <span className="availability"><i /> {from ? `AVAILABLE ${from.toUpperCase()}` : 'OPEN TO CO-OP + JUNIOR ROLES'}</span>
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={label} title={label}>
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  )
}

export default SiteHeader
