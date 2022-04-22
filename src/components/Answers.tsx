import useStore from "hooks/useStore"
import {
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaCheckCircle,
  FaHeart,
  FaLeaf,
  FaTrophy,
  FaUsers,
} from "react-icons/fa"
import styles from "./Answers.module.scss"

const Tidbit = ({ style, subtitle, text, textIcon, icon }) => {
  return (
    <div className={styles.tidbit + " " + style}>
      <div className={styles.text}>
        <div className={styles.subtitle}>
          <span>{icon}</span>
          {subtitle}
        </div>

        <h3>
          {text}
          <span>{textIcon}</span>
        </h3>
      </div>
    </div>
  )
}

const displaySeason = (userAnswer, answer) => {
  const userSeasonDate = new Date(
    `${userAnswer.season} ${userAnswer.seasonYear}`
  )
  const answerSeasonDate = new Date(`${answer.season} ${answer.seasonYear}`)
  const displaySeason =
    userAnswer.season && userAnswer.seasonYear
      ? `${userAnswer.season} ${userAnswer.seasonYear}`
      : "—"

  let style = styles.correct
  let icon = <FaCheckCircle />

  if (
    !userAnswer.season ||
    !userAnswer.seasonYear ||
    !answer.season ||
    !answer.seasonYear
  ) {
    style = styles.none
    icon = null
  } else if (userSeasonDate < answerSeasonDate) {
    style = styles.above
    icon = <FaArrowCircleUp />
  } else if (userSeasonDate > answerSeasonDate) {
    icon = <FaArrowCircleDown />
    style = styles.below
  }

  return (
    <Tidbit
      icon={<FaLeaf />}
      style={style}
      subtitle="SEASON"
      text={displaySeason}
      textIcon={icon}
    />
  )
}

const displayRanking = (answer, solution) => {
  const userRanking = answer.rankings.find(
    ({ type, allTime }) => type === "POPULAR" && allTime
  )?.rank
  const answerRanking = solution.rankings.find(
    ({ type, allTime }) => type === "POPULAR" && allTime
  )?.rank
  const displayRanking = userRanking ? `#${userRanking}` : "—"

  let style = styles.correct
  let icon = <FaCheckCircle />

  if (!userRanking || !answerRanking) {
    style = styles.none
    icon = null
  } else if (userRanking < answerRanking) {
    style = styles.below
    icon = <FaArrowCircleDown />
  } else if (userRanking > answerRanking) {
    style = styles.above
    icon = <FaArrowCircleUp />
  }

  return (
    <Tidbit
      icon={<FaTrophy />}
      style={style}
      subtitle="RANKING"
      text={displayRanking}
      textIcon={icon}
    />
  )
}

const displayPopularity = (answer, solution) => {
  const displayPopularity = answer.popularity
    ? Number(answer.popularity).toLocaleString()
    : "—"

  let style = styles.correct
  let icon = <FaCheckCircle />

  if (!answer.popularity || !solution.popularity) {
    style = styles.none
    icon = null
  } else if (answer.popularity < solution.popularity) {
    style = styles.above
    icon = <FaArrowCircleUp />
  } else if (answer.popularity > solution.popularity) {
    style = styles.below
    icon = <FaArrowCircleDown />
  }

  return (
    <Tidbit
      icon={<FaUsers />}
      style={style}
      subtitle="POPULARITY"
      text={displayPopularity}
      textIcon={icon}
    />
  )
}

const displayAverageScore = (answer, solution) => {
  const displayAverageScore = answer.averageScore
    ? `${answer.averageScore}%`
    : "—"

  let style = styles.correct
  let icon = <FaCheckCircle />

  if (!answer.averageScore || !solution.averageScore) {
    style = styles.none
    icon = null
  } else if (answer.averageScore < solution.averageScore) {
    style = styles.above
    icon = <FaArrowCircleUp />
  } else if (answer.averageScore > solution.averageScore) {
    style = styles.below
    icon = <FaArrowCircleDown />
  }

  return (
    <Tidbit
      icon={<FaHeart />}
      style={style}
      subtitle="AVERAGE SCORE"
      text={displayAverageScore}
      textIcon={icon}
    />
  )
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
      {answers.map((answer, index) => {
        if (!answer) {
          return (
            <div className={styles.cardSkipped}>
              <h1 className={styles.number}>#{index + 1}</h1>
              <h1>— SKIPPED —</h1>
            </div>
          )
        }

        const isCorrect = answer.id === solution.id

        return (
          <div
            key={answer.id}
            className={styles.card + " " + (isCorrect ? styles.correct : "")}
          >
            <img src={answer.coverImage.medium} alt="" />

            <span>
              <div className={styles.header}>
                <a href={`https://anilist.co/anime/${answer.id}`}>
                  <h1>{answer.title.english}</h1>
                </a>
                <h1>#{index + 1}</h1>
              </div>

              <div className={styles.genres}>
                {answer.genres.map((genre) => (
                  <span
                    key={genre}
                    className={
                      solution.genres.includes(genre) ? styles.correct : ""
                    }
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className={styles.tidbits}>
                {displaySeason(answer, solution)}
                {displayRanking(answer, solution)}
                {displayPopularity(answer, solution)}
                {displayAverageScore(answer, solution)}
              </div>
            </span>
          </div>
        )
      })}
      {/* <table>
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
      </table> */}
    </div>
  )
}
