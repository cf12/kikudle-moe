import Answers from "components/Answers"
import Footer from "components/Footer"
import Nav from "components/Nav"
import Video from "components/Video"
import withSplash from "hocs/withSplash"
import useStore, { GameState } from "hooks/useStore"
import type { NextPage } from "next"
import Head from "next/head"
import ReactConfetti from "react-confetti"
import styles from "./index.module.scss"

const IndexPage: NextPage = () => {
  const gameState = useStore((state) => state.gameState)

  return (
    <div className={styles.container}>
      <Head>
        <title>Kikudle - Wordle For Weebs!</title>
      </Head>

      <Nav />

      <main className={styles.main}>
        <div className={styles.mainContainer}>
          <Video />
          <Answers />
        </div>
      </main>

      <Footer />

      {
        gameState === GameState.WIN && <ReactConfetti 
        recycle={false}
        initialVelocityY={20}
        />
      }

      {/* <main className={styles.mainPreview}>
        <video src="https://giant.gfycat.com/LittleShadowyEidolonhelvum.mp4" autoPlay="autoplay" loop muted />
        <h1>Kikudle — ヒ•ア•dle</h1>
        <p>
          The daily anime wordle game! (Coming soon...)
        </p>
      </main> */}
    </div>
  )
}

export default withSplash(IndexPage)
