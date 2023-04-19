import React from 'react';
import Layout from '@/components/layout'
import { allNotes, type Note } from 'contentlayer/generated';
import { NoteList } from '@/components/note_link';
import Link from 'next/link';

type NotesByTags = { [key: string]: Note[] }

export default function ({ tags }: { tags: NotesByTags }) {

  return (
    <Layout>
      <ul>
        {Object.keys(tags).map(tag => (
          <li key={tag}>
            <Link href={`#${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>

      <main>
        {Object.entries(tags).map(([tag, notes]) => (
          <article>
            <h2 id={tag}>{tag}</h2>
            <NoteList notes={notes} />
          </article>
        ))}

      </main>
    </Layout>
  )
}

// gather tags into object. key is tag name and value is the note.
function gatherTags(notes: Note[]): NotesByTags {
  let tags = {}
  for (const note of notes) {
    if (note.tags == undefined) {
      continue
    }

    for (const tag of note.tags) {
      const t = tag.toLowerCase()
      if (tags[t] === undefined) {
        tags[t] = []
      } 
      tags[t].push(note)
    }
  }

  return tags
}

export async function getStaticProps() {
  const tags = gatherTags(allNotes)

  return { props: { tags } }
}