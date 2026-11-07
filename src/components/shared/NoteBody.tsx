import type { NoteBlock } from '@/data/notes'
import CodeBlock from '@/components/shared/CodeBlock'
import RichText from '@/components/shared/RichText'
import { headingId } from '@/lib/utils'

function NoteBody({ blocks }: { blocks: NoteBlock[] }) {
  return (
    <div className="mt-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={index} id={headingId(block.text)} className="mt-[52px] text-[1.5rem] font-semibold">
                {block.text}
              </h2>
            )
          case 'p':
            return (
              <p key={index} className="mt-5 text-[1.125rem] leading-[1.8] max-[620px]:text-base">
                <RichText text={block.text} />
              </p>
            )
          case 'list':
            return (
              <ul
                key={index}
                className="mt-4 list-disc pl-[22px] text-[1.125rem] leading-[1.8] max-[620px]:text-base [&>li+li]:mt-2.5"
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
