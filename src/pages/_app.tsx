import { useEffect, useState } from "react"
import type { AppProps } from "next/app"
import "normalize.css"
import "styles/global.scss"

import GameContext from "contexts/GameContext"

const MAX_STAGES = 5

export enum GameState {
  PLAYING = "PLAYING",
  WIN = "WIN",
  LOSE = "LOSE",
}

function MyApp({ Component, pageProps }: AppProps) {
  const [stage, setStage] = useState(0)
  const [answers, setAnswers] = useState([])
  const [answer, setAnswer] = useState(null)
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING)

  useEffect(() => {
    if (!answers.length || !answer) return

    if (answers.at(-1).id === answer.id) setGameState(GameState.WIN)
    else if (stage === MAX_STAGES) setGameState(GameState.LOSE)
  }, [stage, answers, answer])

  useEffect(() => {
    setAnswer({
      "video": "https://animethemes.moe/video/ShingekiNoKyojinS4-OP1-NCBD1080.webm",
      "id": 110277,
      "title": {
        "romaji": "Shingeki no Kyojin: The Final Season",
        "english": "Attack on Titan Final Season",
        "native": "進撃の巨人 The Final Season"
      },
      "coverImage": {
        "medium": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx110277-qDRIhu50PXzz.jpg"
      },
      "seasonYear": 2021,
      "season": "WINTER",
      "genres": [
        "Action",
        "Drama",
        "Fantasy",
        "Mystery"
      ],
      "averageScore": 88,
      "rankings": [
        {
          "rank": 13,
          "type": "RATED",
          "format": "TV",
          "allTime": true
        },
        {
          "rank": 21,
          "type": "POPULAR",
          "format": "TV",
          "allTime": true
        },
        {
          "rank": 1,
          "type": "RATED",
          "format": "TV",
          "allTime": false
        },
        {
          "rank": 2,
          "type": "POPULAR",
          "format": "TV",
          "allTime": false
        }
      ]
    })
  }, [])

  return (
    <GameContext.Provider
      value={{
        stage,
        setStage,

        answers,
        setAnswers,

        gameState,
        setGameState,

        answer
      }}
    >
      <Component {...pageProps} />
    </GameContext.Provider>
  )
}

export default MyApp
