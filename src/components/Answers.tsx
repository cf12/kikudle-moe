import { useContext, useEffect, useRef, useState } from "react"

import styles from "./Answers.module.scss"

import GameContext from "contexts/GameContext"

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

const parseRanking = (userAnswer, answer) => {
  const userRanking = userAnswer.rankings.find(
    ({ type, allTime }) => type === "POPULAR" && allTime
  )?.rank
  const answerRanking = answer.rankings.find(
    ({ type, allTime }) => type === "POPULAR" && allTime
  )?.rank
  const displayRanking = userRanking ? `#${userRanking}` : "—"

  let res = styles.correct

  if (!userRanking || !answerRanking) res = styles.none
  else if (userAnswer.ranking < answer.ranking) res = styles.above
  else if (userAnswer.ranking > answer.ranking) res = styles.above

  return <td className={res}>{displayRanking}</td>
}

const parsePopularity = (userAnswer, answer) => {
  const displayPopularity = userAnswer.popularity
    ? Number(userAnswer.popularity).toLocaleString()
    : "—"
  let res = styles.correct

  if (!userAnswer.popularity || !answer.popularity) res = styles.none
  if (userAnswer.popularity < answer.popularity) res = styles.above
  else if (userAnswer.popularity > answer.popularity) res = styles.above

  return <td className={res}>{displayPopularity}</td>
}

export default function Answers() {
  const { answers, answer } = useContext(GameContext)

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Year</th>
            <th>Ranking</th>
            <th>Popularity</th>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((userAnswer, index) => {
            if (!userAnswer) {
              return (
                <tr>
                  <td>SKIPPED</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              )
            }

            return (
              <tr key={userAnswer.id}>
                <td className={styles.marquee}>
                  <p>{userAnswer.title.english}</p>
                </td>
                {parseSeason(userAnswer, answer)}
                {parseRanking(userAnswer, answer)}
                {parsePopularity(userAnswer, answer)}
                <td>{userAnswer.genres.join(", ")}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
