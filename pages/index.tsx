import React from 'react';
import Layout from '@/components/layout'
import { allNotes } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import {NoteList} from '@/components/note_link';

export default function ({notes}) {

  return (
    <Layout>
      <h2>최근에 업데이트 됨:</h2>
      <NoteList notes={notes} />
    </Layout>
  )
}

export async function getStaticProps() {
  const notes = allNotes.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return { props: { notes }}
}