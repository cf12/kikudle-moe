import type { AppProps } from "next/app"
import "normalize.css"
import "styles/global.scss"

import GameContext from 'contexts/GameContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameContext.Provider>
      <Component {...pageProps} />
    </GameContext.Provider>
  )
}

export default MyApp
