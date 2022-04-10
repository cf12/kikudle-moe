import { useContext, useEffect, useRef, useState } from "react"
import { IoIosAddCircle, IoIosSearch } from "react-icons/io"
import { request } from "graphql-request"
import {
  CircleLoader,
  MoonLoader,
  PulseLoader,
  ScaleLoader,
  SquareLoader,
} from "react-spinners"
import useSWRImmutable from "swr/immutable"

import styles from "./AnimeInput.module.scss"
import GameContext from "contexts/GameContext"

const fetcher = (query) => {
  if (!query) return {}

  return request(
    "https://graphql.anilist.co/",
    `
      query($search: String, $isAdult: Boolean) {
        anime: Page(perPage: 30) {
          results: media(type: ANIME, isAdult: $isAdult, search: $search) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              medium
            }
            seasonYear
            season
            genres
            popularity
            rankings {
              id,
              rank
              type,
              allTime
            }
          }
        }
      }
    `,
    {
      search: query,
      isAdult: false,
    }
  )
}

export default function AnimeInput() {
  const [query, setQuery] = useState<String>(null)
  const [submission, setSubmission] = useState<String>(null)
  const [effectiveQuery, setEffectiveQuery] = useState<String>(null)
  const [isTyping, setIsTyping] = useState<Boolean>(false)

  const { stage, setStage, answers, setAnswers } = useContext(GameContext)

  const { data, error, isValidating } = useSWRImmutable(effectiveQuery, fetcher)

  const inputEl = useRef(null)

  const isLoading = (!error && !data) || isValidating

  useEffect(() => {
    setIsTyping(true)

    const delayDebounceFn = setTimeout(() => {
      setIsTyping(false)
      setEffectiveQuery(query)
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  return (
    <>
      <div className={styles.container}>
        <span>
          {query && (isTyping || isLoading) ? (
            <SquareLoader size={16} color="white" />
          ) : (
            <IoIosSearch />
          )}
        </span>

        <input
          type="text"
          ref={inputEl}
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />

        {data && data.anime.results.length !== 0 && !isTyping && !isLoading && (
          <ul className={styles.choices}>
            {data.anime.results.map((entry) => {
              let title = entry.title

              if (!title.english && title.romaji) {
                title.english = title.romaji
                delete title.romaji
              }

              if (title.english === title.romaji) {
                delete title.romaji
              }

              return (
                <li
                  key={entry.id}
                  tabIndex={0}
                  onClick={() => {
                    inputEl.current.value = title.english

                    setSubmission(entry)
                    setQuery(null)
                    setEffectiveQuery(null)
                  }}
                >
                  <img src={entry.coverImage.medium} alt="cover" />
                  <p>
                    <mark>{title.english}</mark> {title.romaji && ` • ${title.romaji}`}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className={styles.buttons}>
        <a>SKIP</a>

        <a
          className={styles.submit}
          onClick={() => {
            setAnswers((answers) => [...answers, submission])
            setStage((stage) => stage + 1)
          }}
        >
          SUBMIT
        </a>
      </div>
    </>
  )
}
