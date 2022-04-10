import { useEffect, useRef, useState } from "react"
import { IoIosPause, IoIosPlay } from "react-icons/io"

import styles from './Video.module.scss'

export default function Video() {
  const videoEl = useRef()
  const progressEl = useRef()
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoEl.current
    const progress = progressEl.current
    if (!video || !progress) return

    let timer

    const onPlay = () => {
      timer = setInterval(() => {
        progress.value = Math.round((video.currentTime / video.duration) * 100)
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
  }, [videoEl, progressEl])

  return (
    <div className={styles.videoContainer}>
      <div className={styles.video}>
        <div
          className={styles.videoOverlay}
          onClick={() => {
            if (playing) videoEl.current.pause()
            else videoEl.current.play()

            setPlaying((playing) => !playing)
          }}
        >
          {playing ? <IoIosPause /> : <IoIosPlay />}
        </div>

        <video
          id="video"
          src="https://animethemes.moe/video/ShingekiNoKyojin-OP1.webm"
          ref={videoEl}
        />
      </div>
      <progress id="progress" max="100" value="0" ref={progressEl}>
        Progress
      </progress>
    </div>
  )
}
