import type { NoteBlock } from '@/data/notes'
import CodeBlock from '@/components/shared/CodeBlock'
import RichText from '@/components/shared/RichText'

function NoteBody({ blocks }: { blocks: NoteBlock[] }) {
  return (
    <div className="note-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={index}>{block.text}</h2>
          case 'p':
            return (
              <p key={index}>
                <RichText text={block.text} />
              </p>
            )
          case 'list':
            return (
              <ul key={index}>
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
