import { useContext } from "react"
import styles from "./Footer.module.scss"

import AnimeInput from "./AnimeInput"

import GameContext from "contexts/GameContext"

import { GameState } from "pages/_app"

export default function Footer() {
  const { gameState, answer, answers } = useContext(GameContext)

  if (!answer) return undefined
  else if (gameState === GameState.PLAYING)
    return (
      <footer className={styles.container}>
        <div className={styles.containerInner}>
          <AnimeInput />
        </div>
      </footer>
    )
  else if (gameState === GameState.WIN)
    return (
      <footer className={styles.container + " " + styles.containerWin}>
        <div className={styles.containerInner}>
          <h1>Congratulations!</h1>

          <p>
            You found today&apos;s anime in <bold>{answers.length}</bold> tries:{" "}
            <a href={`https://anilist.co/anime/${answer.id}`}>{answer.title.english}</a>
          </p>
        </div>
      </footer>
    )
  else if (gameState === GameState.LOSE)
    return (
      <footer className={styles.container + " " + styles.containerLose}>
        <div className={styles.containerInner}>
          <h1>Better luck tomorrow!</h1>

          <p>
            Today&apos;s anime was:{" "}
            <a href={`https://anilist.co/anime/${answer.id}`}>{answer.title.english}</a>
          </p>
        </div>
      </footer>
    )
}
