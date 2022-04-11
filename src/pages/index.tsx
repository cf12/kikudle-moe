import type { NextPage } from "next"

import Nav from "components/Nav"
import Video from "components/Video"
import Footer from "components/Footer"

import styles from "./index.module.scss"
import AnimeInput from "components/AnimeInput"
import Answers from "components/Answers"

const IndexPage: NextPage = () => {
  return (
    <>
      {/* <Nav />

      <main className={styles.main}>
        <Video />
        <Answers />
      </main>

      <Footer /> */}

      <main className={styles.mainPreview}>
        <video src="https://giant.gfycat.com/LittleShadowyEidolonhelvum.mp4" autoPlay loop />
        <h1>Kikudle — ヒ•ア•dle</h1>
        <p>
          The daily anime wordle game! (Coming soon...)
        </p>
      </main>
    </>
  )
}

export default IndexPage
