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
      video: "https://animethemes.moe/video/NeonGenesisEvangelion-OP1.webm",
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
