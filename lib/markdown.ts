import { bundleMDX } from "mdx-bundler"
import { NOTE_DIR } from "./constants"
import fs from "fs/promises"
import matter from "gray-matter"
import { join } from "path"
import remarkWikiLink, { getPermalinks } from "@flowershow/remark-wiki-link"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import { execSync } from "child_process"
import rehypeExternalLinks from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import rehypePrism from "rehype-prism-plus"

function getLastModifiedDate(path: string): Date | null {
  const command = `cd ${NOTE_DIR}; git log -1 --pretty=format:%cd --date=iso ${path}`
  const output = execSync(command).toString()
  return output ? new Date(output) : new Date(Date.now())
}

export class Frontmatter {
  public readonly title: string
  public readonly slug: string
  public readonly lastModified: Date

  public url = () => `/n/${this.slug}`

  public static async read_from_path(path: string) {
    const file = await fs.readFile(path, "utf8")
    let slug = path.slice(NOTE_DIR.length + 1).replace(/\.md$/, "")
    slug = slug === "index" ? "" : slug
    const { data } = matter(file)
    const lastModified = getLastModifiedDate(path)

    return new Frontmatter({ ...data, slug, lastModified })
  }

  constructor(params) {
    this.title = params.title
    this.slug = params.slug
    this.lastModified = params.lastModified
  }
}

export class Note {
  public readonly frontmatter: Frontmatter
  public readonly source

  public static async read_from_path(path: string) {
    const source = await fs.readFile(path, "utf8")
    const { code, frontmatter } = await bundleMDX({
      source,
      mdxOptions(options, frontmatter) {
        options.remarkPlugins = [
          ...(options.remarkPlugins ?? []),
          remarkGfm,
          remarkMath,
          [
            remarkWikiLink,
            {
              pathFormat: "obsidian-short",
              permalinks: getPermalinks(NOTE_DIR),
              hrefTemplate: (page) => (page === "index" ? "/n" : `/n${page}`),
            },
          ],
        ]
        options.rehypePlugins = [
          ...(options.rehypePlugins ?? []),
          rehypeKatex,
          rehypeSlug,
          [
            rehypeExternalLinks,
            {
              rel: ["nofollow"],
            },
          ],
          rehypePrism,
        ]

        return options
      },
    })
    const front = new Frontmatter({
      ...frontmatter,
      slug: path.slice(NOTE_DIR.length + 1).replace(/\.md$/, ""),
    })

    return new Note(code, front)
  }

  constructor(code, front) {
    this.source = code
    this.frontmatter = front
  }
}

export async function getNoteBySlug(slug: string): Promise<Note> {
  const fullpath = join(NOTE_DIR, `${slug}.md`)
  const note = Note.read_from_path(fullpath)

  return note
}

export async function getAllNotesFrontmatter(): Promise<Frontmatter[]> {
  const files = await fs.readdir(NOTE_DIR)

  const frontmatters = Promise.all(
    files.map(async (path) => {
      const fullpath = join(NOTE_DIR, path)
      const frontmatter = await Frontmatter.read_from_path(fullpath)
      return frontmatter
    })
  )

  return (await frontmatters).sort(
    (a, b) => b.lastModified.getTime() - a.lastModified.getTime()
  )
}
