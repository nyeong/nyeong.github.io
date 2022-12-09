import React, { useEffect } from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'

const siteUrl = "https://nyeong.github.io/nth-week-today/"

export default () => {
  useEffect(() => {
    window.location.href = siteUrl;
  });

  return (
    <Layout>
      <div style={{
        textAlign: "center"
      }}>
        <p style={{
          marginTop: "10vh"
        }}>
          <Link to={siteUrl}>오늘은 몇 주차?</Link>
          <span> 사이트로 이동합니다...</span>
        </p>
      </div>
    </Layout>
  )
}