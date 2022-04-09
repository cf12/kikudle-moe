import Nav from 'components/Nav'
import type { NextPage } from 'next'

import styles from './index.module.scss'

const IndexPage: NextPage = () => {
  return (
    <>
      <Nav />

      <main className={styles.main}>

      </main>
    </>
  )
}

export default IndexPage
