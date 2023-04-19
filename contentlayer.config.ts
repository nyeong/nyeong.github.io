import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import wikiLinkPlugin, { getPermalinks } from "@flowershow/remark-wiki-link";
import { join } from "path";

const HANASSIG_DIR =
  process.env.NODE_ENV === "production" ? "hanassig" : "../hanassig";
const NOTE_DIR = join(HANASSIG_DIR, "notes");

export const Note = defineDocumentType(() => ({
  name: "Note",
  filePathPattern: "**/*.md",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date" },
    tags: { type: "list", of: { type: "string" } },
  },
  computedFields: {
    slug: { type: "string", resolve: (doc) => doc._raw.flattenedPath },
  },
}));

export default makeSource({
  contentDirPath: NOTE_DIR,
  documentTypes: [Note],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      [
        wikiLinkPlugin,
        {
          pathFormat: "obsidian-short",
          permalinks: getPermalinks(NOTE_DIR),
          hrefTemplate: (permalink) =>
            permalink === "index" ? `/n/` : `/n${permalink}`,
        },
      ],
      remarkMath,
    ],
    rehypePlugins: [rehypeKatex],
  },
});
