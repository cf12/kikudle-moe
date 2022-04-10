import type { NextPage } from "next"

import Nav from "components/Nav"
import Video from "components/Video"

import styles from "./index.module.scss"

const IndexPage: NextPage = () => {
  return (
    <>
      <Nav />

      <main className={styles.main}>
        <Video />
      </main>
    </>
  )
}

export default IndexPage
