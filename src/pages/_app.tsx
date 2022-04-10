import { useState } from "react"
import type { AppProps } from "next/app"
import "normalize.css"
import "styles/global.scss"

import GameContext from 'contexts/GameContext'

function MyApp({ Component, pageProps }: AppProps) {
  const [stage, setStage] = useState(0)
  return (
    <GameContext.Provider value={{
      stage,
      setStage,
    }}>
      <Component {...pageProps} />
    </GameContext.Provider>
  )
}

export default MyApp
