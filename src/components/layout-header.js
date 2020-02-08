import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"

import { slugify } from "../utils"

import "./layout-header.scss"

const LayoutHeader = ({ categoryNode }) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <header className="site-header">
      <Link to="/">{site.siteMetadata.title}</Link>
      {categoryNode && (
        <Link to={`/categories#${slugify(categoryNode.fields.categorySlug)}`}>
          #{categoryNode.frontmatter.title}
        </Link>
      )}
    </header>
  )
}

LayoutHeader.propTypes = {
  categoryNode: {
    fields: {
      categorySlug: PropTypes.string,
    },
    frontmatter: {
      title: PropTypes.string,
    },
  },
}

export default LayoutHeader
