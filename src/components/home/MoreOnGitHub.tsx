import { ArrowUpRight } from 'lucide-react'
import { otherRepos } from '@/data/repos'

const updated = (iso: string) =>
  new Date(iso).toLocaleDateString('en-CA', { month: 'short', year: 'numeric', timeZone: 'UTC' })

/** Repos without a case study yet. Filled from the GitHub snapshot, so it needs no editing. */
function MoreOnGitHub() {
  if (otherRepos.length === 0) return null
  return (
    <div className="mt-20" data-more-repos>
      <h2 className="text-h2 font-semibold">More on GitHub</h2>
      <p className="mt-2 max-w-[60ch] text-muted-foreground">
        Smaller or older repositories, listed here straight from GitHub. They don&apos;t have a case study yet.
      </p>
      <ul className="m-0 mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {otherRepos.map((repo) => (
          <li
            key={repo.name}
            className="relative flex flex-col overflow-hidden rounded-[12px] border bg-card transition-colors focus-within:border-primary pointer-fine:hover:border-primary"
          >
            {repo.thumbnail && (
              <img
                src={repo.thumbnail}
                alt=""
                width={640}
                height={320}
                loading="lazy"
                decoding="async"
                className="aspect-[2/1] w-full border-b object-cover dark:brightness-[.94]"
              />
            )}
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="text-lg leading-tight font-semibold">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-6 items-center gap-1.5 no-underline after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-offset-4 pointer-coarse:min-h-11"
                >
                  {repo.name}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </h3>
              <p className="line-clamp-3 text-sm leading-[1.6] text-muted-foreground">{repo.description}</p>
              <p className="mt-auto pt-2 font-mono text-label text-muted-foreground">
                {[repo.language, `Updated ${updated(repo.pushedAt)}`].filter(Boolean).join(' · ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MoreOnGitHub
