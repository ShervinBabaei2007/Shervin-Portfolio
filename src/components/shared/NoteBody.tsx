import type { NoteBlock } from '@/data/notes'
import CodeBlock from '@/components/shared/CodeBlock'
import RichText from '@/components/shared/RichText'

function NoteBody({ blocks }: { blocks: NoteBlock[] }) {
  return (
    <div className="mt-2.5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={index} className="mt-[38px] text-[1.375rem] font-semibold">
                {block.text}
              </h2>
            )
          case 'p':
            return (
              <p key={index} className="mt-[18px] max-w-[68ch] text-[1.0625rem] leading-[1.75] max-[620px]:text-base">
                <RichText text={block.text} />
              </p>
            )
          case 'list':
            return (
              <ul
                key={index}
                className="mt-3.5 max-w-[68ch] list-disc pl-[22px] text-[1.0625rem] leading-[1.75] max-[620px]:text-base [&>li+li]:mt-2"
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
                className="mt-5"
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
