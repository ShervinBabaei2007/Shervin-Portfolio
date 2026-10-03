import { Moon, Sun } from 'lucide-react'

type SiteHeaderProps = {
  darkMode: boolean
  onToggleTheme: () => void
}

function SiteHeader({ darkMode, onToggleTheme }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Shervin Babaei, home"><span>SB</span><i>.</i></a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="header-actions">
        <span className="availability"><i /> OPEN TO OPPORTUNITIES</span>
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'} title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  )
}

export default SiteHeader
