import type { ReactNode } from 'react'

type PageIntroProps = { eyebrow: string; id: string; title: ReactNode; lead?: ReactNode }

/** Eyebrow, heading and lead paragraph that open the simple pages (404, writeups, how it's built). */
function PageIntro({ eyebrow, id, title, lead }: PageIntroProps) {
  return (
    <>
      <p className="mt-4 mb-7 eyebrow">{eyebrow}</p>
      <h1 id={id} className="mt-3.5 max-w-[18ch] text-[clamp(2.25rem,1.7rem+2vw,3.25rem)] leading-[1.08] font-semibold">
        {title}
      </h1>
      {lead && <p className="mt-4 mb-7 max-w-[60ch] text-[1.125rem] leading-[1.65] text-muted-foreground">{lead}</p>}
    </>
  )
}

export default PageIntro
