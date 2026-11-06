import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer section-wrap">
      <Link className="wordmark" to="/" aria-label="Shervin Babaei, home">
        <span>SB</span>
        <i>.</i>
      </Link>
      <span>
        MADE IN VANCOUVER <span className="footer-dot">/</span> 2026
      </span>
      <Link className="footer-built" to="/how-its-built">
        How this site is built
      </Link>
      <a href="#main">
        BACK TO TOP <ArrowUpRight size={13} />
      </a>
    </footer>
  )
}

export default SiteFooter
