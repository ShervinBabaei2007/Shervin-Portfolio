import type { NoteBlock } from '@/data/notes'
import CodeBlock from '@/components/shared/CodeBlock'
import RichText from '@/components/shared/RichText'
import { headingId } from '@/lib/utils'

/** A writeup's text, drawn block by block: headings, paragraphs, lists and code. */
function NoteBody({ blocks }: { blocks: NoteBlock[] }) {
  return (
    // The first block starts level with the top of the rail beside it.
    <div id="note-body" className="[&>:first-child]:mt-0">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={index}
                id={headingId(block.text)}
                className="mt-[56px] mb-0 border-t border-foreground/15 pt-8 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] tracking-[-0.03em]"
              >
                {block.text}
              </h2>
            )
          case 'p':
            return (
              <p key={index} className="mt-5 mb-0 text-[1.125rem] leading-[1.75] text-text-body max-[620px]:text-base">
                <RichText text={block.text} />
              </p>
            )
          case 'list':
            return (
              <ul
                key={index}
                className="mt-4 mb-0 list-disc pl-[22px] text-[1.125rem] leading-[1.75] text-text-body marker:text-primary max-[620px]:text-base [&>li+li]:mt-2.5"
              >
                {block.items.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            )
          case 'code':
            return (
              <CodeBlock
                key={index}
                className="mt-6"
                snippet={{
                  file: block.file,
                  href: '',
                  language: block.language,
                  code: block.code,
                  caption: block.caption ?? '',
                }}
                showLink={false}
                showCaption={Boolean(block.caption)}
              />
            )
        }
      })}
    </div>
  )
}

export default NoteBody
