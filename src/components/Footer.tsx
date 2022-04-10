import styles from "./Footer.module.scss"

import AnimeInput from "./AnimeInput"

export default function Nav() {
  return (
    <footer className={styles.container}>
      <div className={styles.containerInner}>
        <AnimeInput />
      </div>
    </footer>
  )
}
