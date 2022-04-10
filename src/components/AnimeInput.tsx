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
  const inputEl = useRef(null)
  const { data, error, isValidating } = useSWRImmutable(effectiveQuery, fetcher)
  const isLoading = (!error && !data) || isValidating
  const [isTyping, setIsTyping] = useState<Boolean>(false)

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
          {query && !submission && (isTyping || isLoading) ? (
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
      </div>

      {data && !isTyping && !isLoading && (
        <ul className={styles.choices}>
          {data.anime.results.map(entry => {
            let {
              id,
              coverImage,
              title: { romaji, english },
            } = entry

            if (!english && romaji) {
              english = romaji
              romaji = undefined
            }

            return (
              <li key={id} tabIndex={0} onClick={() => {
                setSubmission(id)
                inputEl.current.value = english
                setEffectiveQuery(null)
              }}>
                <img src={coverImage.medium} alt="cover" />
                <p>
                  <mark>{english}</mark> {romaji && ` • ${romaji}`}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
