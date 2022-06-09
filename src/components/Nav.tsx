import styles from "./Nav.module.scss"
import { IoIosInformationCircle, IoIosMenu } from "react-icons/io"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import duration from "dayjs/plugin/duration"
import Tippy from "@tippyjs/react"
import { useEffect, useMemo, useState } from "react"
import useStore from "hooks/useStore"

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(duration)

export default function Nav() {
  const [time, setTime] = useState(null)
  const solutionDate = useStore((state) => state.solutionDate)

  const end = useMemo(() => {
    return solutionDate && dayjs.utc(solutionDate).endOf("day")
  }, [solutionDate])

  useEffect(() => {
    if (!end) return

    const interval = setInterval(() => {
      const now = dayjs.utc()
      setTime(dayjs.duration(end - now))
    }, 1000)

    return () => clearInterval(interval)
  }, [end])

  const timeDisplay = time
    ? time.asSeconds() >= 0
      ? time.format("HH:mm:ss")
      : "REPLAYING"
    : "--:--:--"

  const timeStyle = timeDisplay === "REPLAYING" ? styles.orange : styles.green

  return (
    <nav className={styles.container}>
      <div className={styles.containerInner}>
        <span className={styles.left + " " + timeStyle}>
          <Tippy
            duration={200}
            maxWidth={300}
            content={
              <div>
                <p>Displays how much time left before the next Kikudle!</p>
                <p>
                  <i>
                    If you&apos;re replaying a Kikudle, you might need to
                    refresh the page or wait for the next one to start.
                  </i>
                </p>
              </div>
            }
          >
            <p>{timeDisplay}</p>
          </Tippy>
        </span>

        <h1 className={styles.center}>Kikudle</h1>

        <span className={styles.right}>
          {/* <IoIosInformationCircle /> */}
        </span>
      </div>
    </nav>
  )
}
