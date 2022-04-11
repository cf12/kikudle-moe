import { useContext, useEffect, useRef, useState } from "react"
import { IoIosPause, IoIosPlay } from "react-icons/io"

import styles from "./Video.module.scss"

import { callbackify } from "util"
import useStore, { GameState } from "hooks/useStore"

// Game stage:
// 0 - 2 seconds
// 1 - 5 seconds
// 2 - 10 seconds
// 3 - 20 seconds
// 4 - 35 seconds
const MAX_DURATION = 35
const BREAKPOINTS = [2, 5, 10, 20, 35]
const BREAKPOINTS_OPACITY = [1, 0.9, 0.8, 0.7, 0.6]

export default function Video() {
  const [playing, setPlaying] = useState(false)

  const videoEl = useRef()
  const progressEl = useRef()

  const solution = useStore((state) => state.solution)
  const gameState = useStore((state) => state.gameState)
  const answers = useStore((state) => state.answers)

  const stage = answers.length

  const duration =
    gameState === GameState.PLAYING ? BREAKPOINTS?.[stage] : MAX_DURATION

  useEffect(() => {
    const video = videoEl.current
    const progress = progressEl.current
    if (!video || !progress) return

    let timer

    const onPlay = () => {
      timer = setInterval(() => {
        progress.value = Math.round((video.currentTime / MAX_DURATION) * 10000)

        if (video.currentTime >= duration) {
          setPlaying(false)
          video.currentTime = 0
        }
      }, 10)
    }

    const onPause = () => {
      clearInterval(timer)
    }

    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)

    return () => {
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
    }
  }, [videoEl, progressEl, duration])

  useEffect(() => {
    if (playing) videoEl.current.play()
    else videoEl.current.pause()
  }, [playing])

  return (
    <div className={styles.videoContainer}>
      <div className={styles.video}>
        <div
          className={styles.videoOverlay}
          style={{
            backgroundColor:
              gameState === GameState.PLAYING
                ? `rgba(0, 0, 0, ${BREAKPOINTS_OPACITY[stage]})`
                : "transparent",
            backdropFilter: 
              gameState === GameState.PLAYING
                ? "blur(24px)"
                : "none",
          }}
          onClick={() => {
            setPlaying((playing) => !playing)
          }}
        >
          {playing ? <IoIosPause /> : <IoIosPlay />}
        </div>

        <video id="video" src={solution?.video} ref={videoEl} />
      </div>

      <div className={styles.progress}>
        <progress id="progress" max="10000" value="0" ref={progressEl}>
          Progress
        </progress>

        {BREAKPOINTS.slice(0, -1).map((duration, i) => (
          <div
            key={i}
            className={styles.marker}
            style={{
              left: `${(duration / MAX_DURATION) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
