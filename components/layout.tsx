import React from 'react'
import Link from 'next/link'
import { siteMetadata } from '@/lib/constants'

export default function({children}) {
  return (
    <>
      <nav>
        <div>
          <Link href='/'>{siteMetadata.title}</Link>
        </div>
        <div>
          <Link href='/n/'>index</Link>
          <Link href='/tags'>주제별</Link>
        </div>
      </nav>

      <div>
        {children}
      </div>

      <footer>
        <ul>
          <li>
            <Link href={siteMetadata.repositoryUrl}>Repo</Link>
          </li>
          <li>
            안녕 ©️ <Link href={siteMetadata.licenseUrl}>CC BY-SA</Link>
          </li>
        </ul>
      </footer>
    </>
  )
}
