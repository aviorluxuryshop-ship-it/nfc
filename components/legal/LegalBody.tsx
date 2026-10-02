import { Fragment } from 'react'

import { site } from '@/data/site'
import type { Block, LegalDoc } from '@/lib/legal/types'

/**
 * Renders `**bold**` and, while the store is in demo mode, highlights every
 * [placeholder] so the owner can see at a glance what still needs filling.
 */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
        if (site.demoMode && part.startsWith('[') && part.endsWith(']')) {
          return (
            <mark key={i} className="placeholder-mark">
              {part}
            </mark>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return <h2>{block.text}</h2>
    case 'h3':
      return <h3>{block.text}</h3>
    case 'p':
      return (
        <p>
          <Inline text={block.text} />
        </p>
      )
    case 'ul':
    case 'ol': {
      const List = block.type
      return (
        <List>
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </List>
      )
    }
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table>
            {block.head && (
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    !block.head && c === 0 ? (
                      <th key={c} scope="row" className="w-[38%]">
                        {cell}
                      </th>
                    ) : (
                      <td key={c}>
                        <Inline text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export function LegalBody({ doc }: { doc: LegalDoc }) {
  return (
    <div className="legal">
      {doc.blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  )
}
