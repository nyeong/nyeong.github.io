import type { AppProps } from "next/app"

import "@/styles/globals.css"
import "@/styles/prism-nord.css"
import "katex/dist/katex.min.css"

export default function ({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
