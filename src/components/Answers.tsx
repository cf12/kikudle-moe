import { useContext, useEffect, useRef, useState } from "react"

import styles from "./Answers.module.scss"

import GameContext from "contexts/GameContext"

export default function Answers() {
  const { answers } = useContext(GameContext)
  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Season + Year</th>
            <th>Ranking (all time)</th>
            <th>Popularity</th>
            <th>Genres (top 2)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>???</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
          </tr>

          {answers.map((answer, index) => {
            if (!answer) {
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

            const title = answer.title
            const ranking = answer.rankings.find(
              ({ type, allTime }) => type === "POPULAR" && allTime
            )?.rank

            return (
              <tr key={answer.id}>
                <td>{title.english}</td>
                <td>{`${answer.season} ${answer.seasonYear}`}</td>
                <td>{ranking ? `#${ranking}` : "—"}</td>
                <td>{Number(answer.popularity).toLocaleString()}</td>
                <td>{answer.genres.join(", ")}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
