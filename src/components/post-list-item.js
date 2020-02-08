import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import "./post-list-item.scss"

const PostListItem = ({ title, url }) => (
  <article className="post-list-item">
    <Link className="-title" to={url}>
      {title}
    </Link>
  </article>
)

export default PostListItem

PostListItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}
