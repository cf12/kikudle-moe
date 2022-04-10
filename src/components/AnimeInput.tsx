import { useEffect, useRef, useState } from "react"
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
              let {
                id,
                coverImage,
                title: { romaji, english },
              } = entry

              if (!english && romaji) {
                english = romaji
                romaji = undefined
              }

              if (english === romaji) {
                romaji = undefined
              }

              return (
                <li
                  key={id}
                  tabIndex={0}
                  onClick={() => {
                    inputEl.current.value = english

                    setSubmission(id)
                    setQuery(null)
                    setEffectiveQuery(null)
                  }}
                >
                  <img src={coverImage.medium} alt="cover" />
                  <p>
                    <mark>{english}</mark> {romaji && ` • ${romaji}`}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className={styles.buttons}>
        <a>
          SKIP
        </a>

        <a>
          SUBMIT
        </a>
      </div>
    </>
  )
}
