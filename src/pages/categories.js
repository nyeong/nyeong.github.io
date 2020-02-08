import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PostList from "../components/post-list"
import CategryListItem from "../components/category-list-item"
import { slugify } from "../utils"

import "./categories.scss"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges
  const categories = data.allCategories.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="주제별" />

      <section className="categories">
        {categories.map(({ node }) => (
          <CategryListItem
            categorySlug={node.fields.categorySlug}
            categoryName={node.frontmatter.title}
          />
        ))}
      </section>

      {categories.map(({ node }) => (
        <section id={slugify(node.fields.categorySlug)}>
          <h2>{node.frontmatter.title}</h2>
          <PostList
            posts={posts.filter(
              post => post.node.fields.categorySlug === node.fields.categorySlug
            )}
          />
        </section>
      ))}
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
    allCategories: allMarkdownRemark(
      filter: { fields: { isCategory: { eq: true } } }
      sort: { fields: [frontmatter___title], order: ASC }
    ) {
      edges {
        node {
          fields {
            categorySlug
          }
          frontmatter {
            title
          }
        }
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
            categorySlug
            updatedAt(formatString: "MMMM DD, YYYY")
          }
          frontmatter {
            title
            description
          }
        }
      }
    }
  }
`
