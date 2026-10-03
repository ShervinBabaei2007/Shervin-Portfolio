import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="simple-page section-wrap" aria-labelledby="not-found-title">
      <p className="eyebrow">404</p>
      <h1 id="not-found-title">This page doesn&apos;t exist.</h1>
      <p>The link may be old, or the address may have a typo.</p>
      <Link className="button button-primary" to="/"><ArrowLeft size={16} /> Go to the home page</Link>
    </section>
  )
}

export default NotFoundPage
