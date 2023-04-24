import { siteMetadata } from "lib/constants"
import Link from "next/link"

export default function ({ children }) {
  return (
    <div className="font-serif antialiased container grid grid-cols-1 p-3">
      <nav className="mb-5">
        {[
          ["/", siteMetadata.title, "font-bold"],
          // ["/tags", "주제별"],
          ["/n", "index"],
        ].map(([href, title, style=""]) => (
          <Link className={[style, "transition-colors text-gray-600 hover:text-gray-900 no-underline pr-2"].join(' ')} href={href} key={href}>{title}</Link>
        ))}
      </nav>

      <main>{children}</main>

      <footer>
        <p>&copy; {new Date().getFullYear()} An Nyeong. <Link target="_blank" href="https://github.com/nyeong/hanassig/blob/main/LICENSE">CC BY-SA</Link></p>
      </footer>
    </div>
  )
}
