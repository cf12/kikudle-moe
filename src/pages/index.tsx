import type { NextPage } from "next"

import Nav from "components/Nav"
import Video from "components/Video"

import styles from "./index.module.scss"
import AnimeInput from "components/AnimeInput"

const IndexPage: NextPage = () => {
  return (
    <>
      <Nav />

      <main className={styles.main}>
        <Video />

        <AnimeInput />
      </main>
    </>
  )
}

export default IndexPage
