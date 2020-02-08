import React from "react"

import "./layout-footer.scss"

export default () => (
  <footer className="layout-footer">
    © {new Date().getFullYear()}, Reposited at
    {` `}
    <a
      rel="noopener noreferrer"
      target="_blank"
      href="https://github.com/nyeong/nyeong.github.io"
    >
      nyeong.github.io
    </a>
  </footer>
)
