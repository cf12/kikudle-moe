import styles from "./Nav.module.scss"
import { IoIosInformationCircle, IoIosMenu } from "react-icons/io"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import duration from "dayjs/plugin/duration"
import Tippy from "@tippyjs/react"
import { useEffect, useState } from "react"

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(duration)

export default function Nav() {
  const [time, setTime] = useState("--:--:--")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs.utc()
      const end = now.endOf("day")
      const duration = dayjs.duration(end - now)
      setTime(duration.format("HH:mm:ss"))
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <nav className={styles.container}>
      <div className={styles.containerInner}>
        <span className={styles.left}>
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
            <p>{time}</p>
          </Tippy>
        </span>

        <h1 className={styles.center}>Kikudle</h1>

        <span className={styles.right}>
          <IoIosInformationCircle />
        </span>
      </div>
    </nav>
  )
}
