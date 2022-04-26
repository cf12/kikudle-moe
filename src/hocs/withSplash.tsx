import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"

import styles from "./withSplash.module.scss"

const variantsContainer = {
  hidden: { clipPath: "circle(100%)" },
  exit: { clipPath: "circle(0%)" },
}

const variantsChildren = {
  hidden: {
    opacity: 0,
    rotate: 10,
    scale: 0.8,
    translateY: 16,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    translateY: 0,
  },
}

const withSplash = (Component) => {
  const NewComponent = (props) => {
    const [mounted, setMounted] = useState(true)

    useEffect(() => {
      setTimeout(() => {
        setMounted(false)
      }, 1000)
    }, [])

    return (
      <>
        <AnimatePresence>
          {mounted && (
            <motion.div
              key="splash"
              className={styles.container}
              variants={variantsContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                ease: "circOut",
                duration: 0.75,
                staggerChildren: 0.1
              }}
            >
              {["き", "く"].map((letter, index) => (
                <motion.h1
                  key={index}
                  variants={variantsChildren}
                  transition={{ type: "spring", stiffness: 450 }}
                >
                  {letter}
                </motion.h1>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Component />
      </>
    )
  }

  return NewComponent
}

export default withSplash
