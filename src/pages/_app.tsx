import { useState } from "react"
import type { AppProps } from "next/app"
import "normalize.css"
import "styles/global.scss"

import GameContext from "contexts/GameContext"

function MyApp({ Component, pageProps }: AppProps) {
  const [stage, setStage] = useState(0)
  const [answers, setAnswers] = useState([])

  return (
    <GameContext.Provider
      value={{
        stage,
        setStage,

        answers,
        setAnswers,

        answer: {
          video: 'https://animethemes.moe/video/NeonGenesisEvangelion-OP1.webm',
          id: 30,
          title: {
            romaji: "Shin Seiki Evangelion",
            english: "Neon Genesis Evangelion",
            native: "新世紀エヴァンゲリオン",
          },
          coverImage: {
            medium:
              "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx30-1Ro1NFFg28bu.jpg",
          },
          seasonYear: 1995,
          season: "FALL",
          genres: [
            "Action",
            "Drama",
            "Mecha",
            "Mystery",
            "Psychological",
            "Sci-Fi",
          ],
          popularity: 247726,
          rankings: [
            {
              id: 97,
              rank: 97,
              type: "RATED",
              allTime: true,
            },
            {
              id: 552,
              rank: 52,
              type: "POPULAR",
              allTime: true,
            },
            {
              id: 1236,
              rank: 1,
              type: "RATED",
              allTime: false,
            },
            {
              id: 1264,
              rank: 1,
              type: "POPULAR",
              allTime: false,
            },
          ],
        },
      }}
    >
      <Component {...pageProps} />
    </GameContext.Provider>
  )
}

export default MyApp
