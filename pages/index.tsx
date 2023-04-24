import Layout from "@/components/layout"
import { GetStaticProps } from "next"
import { getAllNotesFrontmatter, type Frontmatter } from "@/lib/markdown"
import Link from "next/link"

type Props = {
  frontmatters: {title: string, url: string}[]
}

export default function ({frontmatters}: Props) {
  return (
    <Layout>
      <article className="prose">
        <h1>하나씩</h1>
        <h2>최근 고친 글</h2>
        <ul>
          {frontmatters.slice(0, 10).map((note) => (
            <li><Link href={note.url}>{note.title}</Link></li>
          ))}
        </ul>
      </article>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const frontmatters = (await getAllNotesFrontmatter()).slice(0, 10).map(frontmatter => ({
    title: frontmatter.title,
    url: frontmatter.url()
  }))
  return {
    props: {
      frontmatters
    },
  }
}
