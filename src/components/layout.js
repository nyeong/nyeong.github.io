import React from "react"
import PropTypes from "prop-types"

import LayoutHeader from "./layout-header"
import LayoutFooter from "./layout-footer"

import "./layout.scss"

const Layout = ({ location, children, categoryNode }) => {
  return (
    <>
      <LayoutHeader categoryNode={categoryNode} />
      <main className="layout">{children}</main>
      <LayoutFooter />
    </>
  )
}

export default Layout

Layout.propTypes = {
  categoryNode: {
    fields: {
      categorySlug: PropTypes.string,
    },
    frontmatter: {
      title: PropTypes.string,
    },
  },
}
