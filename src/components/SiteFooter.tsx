import { ArrowUpRight } from 'lucide-react'

function SiteFooter() {
  return (
    <footer className="site-footer section-wrap">
      <a className="wordmark" href="#home"><span>SB</span><i>.</i></a>
      <span>MADE IN VANCOUVER <span className="footer-dot">/</span> 2026</span>
      <a href="#home">BACK TO TOP <ArrowUpRight size={13} /></a>
    </footer>
  )
}

export default SiteFooter
