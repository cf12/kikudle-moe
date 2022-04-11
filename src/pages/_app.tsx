import { useEffect, useState } from "react"
import type { AppProps } from "next/app"
import "normalize.css"
import "styles/global.scss"
import useStore from "hooks/useStore"

function MyApp({ Component, pageProps }: AppProps) {
  const init = useStore(store => store.init)
  init()

  return <Component {...pageProps} />
}

export default MyApp
