import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PostList from "../components/post-list"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="모든 포스트" />
      <h1>하나씩</h1>
      <PostList posts={posts} />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [fields___updatedAt], order: DESC }
      filter: { fields: { isCategory: { ne: true } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            updatedAt(formatString: "YYYY년 MM월 DD일")
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
