import { useEffect, useState } from "react"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import useStore from "hooks/useStore"

import "normalize.css"
import "styles/global.scss"
import "tippy.js/dist/tippy.css"

function MyApp({ Component, pageProps }: AppProps) {
  const init = useStore((store) => store.init)
  init()

  return <Component {...pageProps} />
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
})
