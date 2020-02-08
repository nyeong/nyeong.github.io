import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { slugify } from "../utils"

import "./category-list-item.scss"

const CategoryLinkItem = ({ categoryName, categorySlug }) => (
  <Link
    className="category-list-item"
    to={`/categories#${slugify(categorySlug)}`}
  >
    {categoryName}
  </Link>
)

export default CategoryLinkItem

CategoryLinkItem.propTypes = {
  categoryName: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
}
