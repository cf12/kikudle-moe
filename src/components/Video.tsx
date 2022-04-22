import { useContext, useEffect, useRef, useState } from "react"
import { IoIosPause, IoIosPlay } from "react-icons/io"

import styles from "./Video.module.scss"

import { callbackify } from "util"
import useStore, { GameState } from "hooks/useStore"
import ReactPlayer from "react-player/file"
import {
  FaPause,
  FaPlay,
  FaPlayCircle,
  FaRegPauseCircle,
  FaRegPlayCircle,
} from "react-icons/fa"

// Game stage:
// 0 - 2 seconds
// 1 - 5 seconds
// 2 - 10 seconds
// 3 - 20 seconds
// 4 - 35 seconds
const MAX_DURATION = 35
const BREAKPOINTS = [2, 5, 10, 20, 35]
const BREAKPOINTS_OPACITY = [1, 0.85, 0.7, 0.55, 0.4]

export default function Video() {
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const videoEl = useRef()

  const solution = useStore((state) => state.solution)
  const gameState = useStore((state) => state.gameState)
  const answers = useStore((state) => state.answers)

  const stage = answers.length

  const duration = BREAKPOINTS?.[stage]

  return (
    <div className={styles.videoContainer}>
      <div className={styles.video}>
        {!ready ? (
          <div className={styles.videoOverlayLoader}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <div
            className={
              styles.videoOverlay + " " + (!playing ? styles.active : "")
            }
            onClick={() => {
              setPlaying((playing) => !playing)
            }}
          >
            {playing ? <IoIosPause /> : <IoIosPlay />}
          </div>
        )}

        <div
          style={{
            backgroundColor:
              gameState === GameState.PLAYING
                ? `rgba(0, 0, 0, ${BREAKPOINTS_OPACITY[stage]})`
                : "transparent",
            backdropFilter:
              gameState === GameState.PLAYING ? "blur(16px)" : "none",
          }}
          className={styles.videoHider}
        />

        <ReactPlayer
          className={styles.player}
          width="100%"
          height="100%"
          ref={videoEl}
          pip={false}
          url={solution?.video}
          playing={playing}
          progressInterval={10}
          onProgress={({ playedSeconds, played }) => {
            if (gameState !== GameState.PLAYING) {
              setProgress(played)

              if (played >= 1) {
                setPlaying(false)
                setDone(true)
              }
            } else {
              setProgress(playedSeconds / MAX_DURATION)

              if (playedSeconds >= duration) {
                setPlaying(false)
                setDone(true)
              }
            }
          }}
          onPlay={() => {
            if (done) {
              setDone(false)
              videoEl.current.seekTo(0)
            }
          }}
          onReady={() => setReady(true)}
        />
      </div>

      <div
        className={styles.progress}
        onClick={({ clientX, currentTarget }) => {
          const { left, width } = currentTarget.getBoundingClientRect()
          const progress = (clientX - left) / width

          if (gameState === GameState.PLAYING) {
            const newDuration = progress * MAX_DURATION

            if (newDuration <= duration) {
              videoEl.current.seekTo(newDuration, "seconds")

              if (!playing) {
                setPlaying(true)
              }
            }
          } else {
            videoEl.current.seekTo(progress, "fraction")

            if (!playing) {
              setPlaying(true)
            }
          }
        }}
      >
        <progress max={1} value={progress} />

        {gameState === GameState.PLAYING ? (
          BREAKPOINTS.map((duration, i) => (
            <div
              key={i}
              className={
                styles.marker + " " + (i === stage ? styles.active : "")
              }
              style={{
                zIndex: i === stage ? 1 : 0,
                width:
                  i === BREAKPOINTS.length - 1
                    ? "100%"
                    : `calc(${(duration / MAX_DURATION) * 100}% + 1px)`,
              }}
            />
          ))
        ) : (
          <div
            className={styles.marker + " " + styles.active}
            style={{
              width: `100%`,
            }}
          />
        )}
      </div>
    </div>
  )
}
