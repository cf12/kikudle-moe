import type { AppProps } from "next/app"
import "normalize.css"
import "styles/global.scss"

import GameContext from 'contexts/GameContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameContext.Provider value={{
      stage: 0,
      setStage: () => {},
    }}>
      <Component {...pageProps} />
    </GameContext.Provider>
  )
}

export default MyApp
