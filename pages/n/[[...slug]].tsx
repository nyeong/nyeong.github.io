import Layout from "@/components/layout"
import { getAllNotesFrontmatter, getNoteBySlug } from "lib/markdown"
import { GetStaticProps, GetStaticPaths } from "next"
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import Giscus from '@giscus/react'

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const pathToSlug = (words) => (!words ? "index" : words.join("/"))
  const note = await getNoteBySlug(pathToSlug(slug as string[]))
  return {
    props: {
      source: note.source,
      title: note.frontmatter.title,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const frontmatters = await getAllNotesFrontmatter()

  return {
    paths: frontmatters.map((f) => ({ params: { slug: f.slug.split("/") } })),
    fallback: false,
  }
}

export default function ({ source, title }) {
  const Component = useMemo(() => getMDXComponent(source), [source])
  return (
    <Layout>
      <article className="prose">
        <header>
          <h1>{title}</h1>
        </header>
        <Component />
      </article>
      <footer>
        <Giscus
          repo="nyeong/hanassig"
          repoId="R_kgDOHBvc-w"
          category="Giscus"
          categoryId="DIC_kwDOHBvc-84CV5Xc"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          lang="ko"
          loading="lazy"
        />
      </footer>
    </Layout>
  )
}
