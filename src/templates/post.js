import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PostNav from "../components/post-nav"

import "./post.scss"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const categoryNode = data.categoryNode
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle} categoryNode={categoryNode}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article className="post">
        <header>
          <h1>{post.frontmatter.title}</h1>
          <p>{post.frontmatter.subtitle}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <PostNav previous={previous} next={next} />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $categorySlug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    categoryNode: markdownRemark(
      fields: { categorySlug: { eq: $categorySlug }, isCategory: { eq: true } }
    ) {
      fields {
        categorySlug
      }
      frontmatter {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        updatedAt(formatString: "MMMM DD, YYYY")
      }
      frontmatter {
        title
        subtitle
      }
    }
  }
`
