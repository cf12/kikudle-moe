import useStore, { GameState } from "hooks/useStore"
import { useContext, useEffect, useRef, useState } from "react"

import styles from "./Answers.module.scss"

const parseSeason = (userAnswer, answer) => {
  const userSeasonDate = new Date(
    `${userAnswer.season} ${userAnswer.seasonYear}`
  )
  const answerSeasonDate = new Date(`${answer.season} ${answer.seasonYear}`)
  const displaySeason =
    userAnswer.season && userAnswer.seasonYear
      ? `${userAnswer.season} ${userAnswer.seasonYear}`
      : "—"

  let res = styles.correct

  if (
    !userAnswer.season ||
    !userAnswer.seasonYear ||
    !answer.season ||
    !answer.seasonYear
  )
    res = styles.none
  else if (userSeasonDate < answerSeasonDate) res = styles.above
  else if (userSeasonDate > answerSeasonDate) res = styles.below

  return <td className={res}>{displaySeason}</td>
}

const parseRanking = (answer, solution) => {
  const userRanking = answer.rankings.find(
    ({ type, allTime }) => type === "POPULAR" && allTime
  )?.rank
  const answerRanking = solution.rankings.find(
    ({ type, allTime }) => type === "POPULAR" && allTime
  )?.rank
  const displayRanking = userRanking ? `#${userRanking}` : "—"

  let res = styles.correct

  if (!userRanking || !answerRanking) res = styles.none
  else if (userRanking < answerRanking) res = styles.below
  else if (userRanking > answerRanking) res = styles.above

  return <td className={res}>{displayRanking}</td>
}

const parsePopularity = (answer, solution) => {
  const displayPopularity = answer.popularity
    ? Number(answer.popularity).toLocaleString()
    : "—"
  let res = styles.correct

  if (!answer.popularity || !solution.popularity) res = styles.none
  if (answer.popularity < solution.popularity) res = styles.above
  else if (answer.popularity > solution.popularity) res = styles.below

  return <td className={res}>{displayPopularity}</td>
}

const parseGenres = (answer, solution) => {
  let res

  if (answer.genres.length === 0) {
    res = "—"
  } else if (answer.genres.length === 1) {
    res = (
      <span key={genre} className={styles.correct}>
        {genre[0]}
      </span>
    )
  } else {
    res = answer.genres
      .map((genre) => {
        if (solution.genres.includes(genre))
          return (
            <span key={genre} className={styles.correct}>
              {genre}
            </span>
          )
        else return <span key={genre}>{genre}</span>
      })
      .reduce((a, b) => [a, ", ", b])
  }

  return <td className={styles.none}>{res}</td>
}

export default function Answers() {
  const answers = useStore((state) => state.answers)
  const solution = useStore((state) => state.solution)
  const gameState = useStore((state) => state.gameState)

  if (!answers.length) {
    return (
      <div className={styles.container}>
        <p>
          <i>
            You haven&apos;t made any guesses yet! To begin, play the clip from
            above and guess what anime it&apos;s from.
          </i>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Year</th>
            <th>Ranking</th>
            <th>Popularity</th>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer, index) => {
            if (!answer) {
              return (
                <tr>
                  <td>
                    <p>{index + 1}</p>
                  </td>
                  <td>SKIPPED</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              )
            }

            const isCorrect = answer.id === solution.id

            return (
              <tr key={answer.id}>
                <td className={isCorrect ? styles.correct : ""}>
                  <p>{index + 1}</p>
                </td>
                <td className={isCorrect ? styles.correct : styles.none}>
                  <p>{answer.title.english}</p>
                </td>
                {parseSeason(answer, solution)}
                {parseRanking(answer, solution)}
                {parsePopularity(answer, solution)}
                {parseGenres(answer, solution)}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
