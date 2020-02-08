import React from "react"

import PostListItem from "./post-list-item"

import "./post-list.scss"

export default ({ posts }) => (
  <section className="post-list">
    {posts.map(({ node }) => (
      <PostListItem
        key={node.fields.slug}
        title={node.frontmatter.title}
        url={node.fields.slug}
      />
    ))}
  </section>
)
