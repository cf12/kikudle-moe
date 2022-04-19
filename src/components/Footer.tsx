import { useContext } from "react"
import styles from "./Footer.module.scss"

import AnimeInput from "./AnimeInput"

import useStore, { GameState } from "hooks/useStore"

export default function Footer() {
  const answers = useStore((state) => state.answers)
  const solution = useStore((state) => state.solution)
  const gameState = useStore((state) => state.gameState)

  if (!solution) return undefined
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
            You found today&apos;s anime in <strong>{answers.length}</strong>{" "}
            {answers.length === 1 ? "try" : "tries"}:{" "}
            <a href={`https://anilist.co/anime/${solution.id}`}>
              {solution.title.english}
            </a>
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
            <a href={`https://anilist.co/anime/${solution.id}`}>
              {solution.title.english}
            </a>
          </p>
        </div>
      </footer>
    )
}
