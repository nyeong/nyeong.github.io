import Layout from '@/components/layout'
import { allNotes, type Note } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'

type Params = {
  note: Note
}

export default function ({ note }: Params) {
  const MDXContent = useMDXComponent(note.body.code)
  return (
    <Layout>
      <main>
        <article>
          <header>
            <h1>{note.title}</h1>
          </header>
          <MDXContent />
        </article>
      </main>
    </Layout>
  )
}

type GetStaticProps = {
  params: {
    slug: string[]
  }
}

export async function getStaticProps({ params }: GetStaticProps) {
  const slug = params.slug ? params.slug.join('/') : ''
  const note = allNotes.find(note => note._raw.flattenedPath === slug)

  return {
    props: {
      note,
    }
  }
}

export async function getStaticPaths() {
  const paths = allNotes.map(note => ({ params: { slug: note.slug.split("/") } }))

  return {
    paths,
    fallback: false,
  }
}
